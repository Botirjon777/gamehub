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
  activateBoost: () => boolean;
  buyDino: (type: DinosaurType) => boolean;
  collectIncome: () => void;
  getIncomePerMinute: () => number;
  syncToServer: () => Promise<void>;
  loadFromServer: () => Promise<void>;
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

      buyDino: (type: DinosaurType) => {
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

        // Sync to server immediately after purchase
        get().syncToServer();
        return true;
      },

      syncToServer: async () => {
        const { balance, ownedDinosaurs, lastUpdate } = get();
        try {
          const res = await fetch("/api/mining/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ balance, ownedDinosaurs, lastUpdate }),
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

      loadFromServer: async () => {
        set({ isLoading: true });
        try {
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
              });
              // Catch up immediately after loading from DB
              get().collectIncome();
              console.log("Successfully loaded and caught up from database");
            } else {
              console.log(
                "Local progress is newer than server, syncing local data...",
              );
              get().syncToServer();
            }
          } else {
            console.log("No progress found in database, syncing local data...");
            get().syncToServer();
          }
        } catch (e) {
          console.error("Failed to load mining progress:", e);
        } finally {
          set({ isLoading: false });
        }
      },

      collectIncome: () => {
        const now = Date.now();
        const { lastUpdate, getIncomePerMinute, boostEndTime } = get();
        const diffMs = now - lastUpdate;

        let multiplier = 1;
        if (boostEndTime && now < boostEndTime) {
          multiplier = 5;
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

        // Auto sync to server occasionally (can be handled in component too)
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
