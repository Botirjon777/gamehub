import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DinosaurType, OwnedDinosaur, DinosaurConfig } from "../types";
import { DINOSAURS, INITIAL_BALANCE } from "../constants";

interface MiningState {
  balance: number;
  ownedDinosaurs: OwnedDinosaur[];
  lastUpdate: number; // Timestamp of last calculation
  isLoading: boolean;
  boostEndTime: number | null;
  lastBoostTime: number | null;
  globalMultiplier: number;
  userId: string | null;
  activateBoost: () => boolean;
  buyDino: (type: DinosaurType, currentUserId: string) => boolean;
  setGlobalMultiplier: (multiplier: number) => void;
  collectIncome: () => void;
  getIncomePerMinute: () => number;
  syncToServer: (currentUserId: string) => Promise<void>;
  loadFromServer: (currentUserId: string) => Promise<void>;
  resetGame: () => void;
}

export const useMiningStore = create<MiningState>()(
  persist(
    (set, get) => ({
      balance: INITIAL_BALANCE,
      ownedDinosaurs: [],
      lastUpdate: Date.now(),
      isLoading: false,
      boostEndTime: null,
      lastBoostTime: null,
      globalMultiplier: 1,
      userId: null,

      activateBoost: () => {
        const now = Date.now();
        const { lastBoostTime } = get();
        const COOLDOWN = 12 * 60 * 60 * 1000; // 12 hours

        if (lastBoostTime && now - lastBoostTime < COOLDOWN) {
          return false;
        }

        set({
          boostEndTime: now + 60000,
          lastBoostTime: now,
        });
        return true;
      },

      getIncomePerMinute: () => {
        const { ownedDinosaurs } = get();
        return ownedDinosaurs.reduce((total, owned) => {
          const config = DINOSAURS.find((d) => d.id === owned.type);
          return total + (config?.incomePerMinute || 0);
        }, 0);
      },

      buyDino: (type: DinosaurType, currentUserId: string) => {
        const config = DINOSAURS.find((d) => d.id === type);
        if (!config || get().balance < config.cost) return false;

        set((state) => ({
          balance: state.balance - config.cost,
          ownedDinosaurs: [
            ...state.ownedDinosaurs,
            {
              id: Math.random().toString(36).substr(2, 9),
              type,
              purchasedAt: Date.now(),
            },
          ],
        }));

        if (currentUserId) {
          // Sync to server immediately after purchase if we have a userId
          get().syncToServer(currentUserId);
        }
        return true;
      },

      syncToServer: async (currentUserId: string) => {
        const { balance, ownedDinosaurs, lastUpdate, lastBoostTime } = get();
        try {
          // Update internal userId before syncing
          set({ userId: currentUserId });
          const res = await fetch("/api/mining/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              balance,
              ownedDinosaurs,
              lastUpdate,
              lastBoostTime,
            }),
          });

          if (!res.ok) {
            const data = await res.json();
            throw new Error(
              data.error || `Server responded with ${res.status}`,
            );
          }
          console.log("Successfully synced mining progress to server");
        } catch (e) {
          console.error("Failed to sync mining progress:", e);
        }
      },

      loadFromServer: async (currentUserId: string) => {
        set({ isLoading: true });
        try {
          // Check if local storage belongs to another user
          const state = get();
          if (state.userId && state.userId !== currentUserId) {
            console.log("Local state belongs to different user, resetting...");
            get().resetGame();
            set({ userId: currentUserId });
          }

          const res = await fetch("/api/mining/progress");
          if (!res.ok) {
            const data = await res.json();
            throw new Error(
              data.error || `Server responded with ${res.status}`,
            );
          }

          const data = await res.json();
          if (data) {
            const localLastUpdate = get().lastUpdate;
            const isDefaultState =
              get().balance === INITIAL_BALANCE &&
              get().ownedDinosaurs.length === 0;

            // Only adopt server state if it's newer, or if we have default state
            if (data.lastUpdate >= localLastUpdate || isDefaultState) {
              set({
                balance: data.balance,
                ownedDinosaurs: data.ownedDinosaurs,
                lastUpdate: data.lastUpdate,
                lastBoostTime: data.lastBoostTime,
              });
              // Catch up immediately after loading from DB
              get().collectIncome();
              console.log("Successfully loaded and caught up from database");
            } else {
              console.log(
                "Local progress is newer than server, syncing local data...",
              );
              get().syncToServer(currentUserId);
            }
          } else {
            console.log("No progress found in database, syncing local data...");
            // Before syncing fresh local data, ensure it belongs to this user
            if (!get().userId || get().userId === currentUserId) {
              get().syncToServer(currentUserId);
            } else {
              console.log("Local data mismatch, skipping sync.");
              get().resetGame();
              get().syncToServer(currentUserId);
            }
          }
        } catch (e) {
          console.error("Failed to load mining progress:", e);
        } finally {
          set({ isLoading: false });
        }
      },

      setGlobalMultiplier: (multiplier: number) =>
        set({ globalMultiplier: multiplier }),

      collectIncome: () => {
        const now = Date.now();
        const {
          lastUpdate,
          getIncomePerMinute,
          boostEndTime,
          globalMultiplier,
        } = get();
        const diffMs = now - lastUpdate;

        let multiplier = globalMultiplier;
        if (boostEndTime && now < boostEndTime) {
          multiplier *= 5; // Dinosaur Boost stacks with Skin Multiplier!
        }

        const incomePerMs = (getIncomePerMinute() * multiplier) / 60000;
        const earned = diffMs * incomePerMs;

        if (earned > 0) {
          set((state) => ({
            balance: state.balance + earned,
            lastUpdate: now,
          }));
        } else {
          set({ lastUpdate: now });
        }
      },

      resetGame: () => {
        set({
          balance: INITIAL_BALANCE,
          ownedDinosaurs: [],
          lastUpdate: Date.now(),
        });
      },
    }),
    {
      name: "mining-adventure-storage",
      // We'll handle account-specific storage by prefixing the name per user if needed,
      // but for now simple localStorage is fine.
    },
  ),
);
