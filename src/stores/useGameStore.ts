import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface GameSession {
  id: string;
  gameId: string;
  score: number;
  duration: number;
  completed: boolean;
  createdAt: string;
}

export interface GameStats {
  gameId: string;
  totalPlays: number;
  totalScore: number;
  highScore: number;
  totalDuration: number;
  lastPlayed: string;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  gameId: string;
  score: number;
  rank?: number;
  createdAt: string;
}

interface GameState {
  sessions: GameSession[];
  stats: Record<string, GameStats>;
  leaderboard: LeaderboardEntry[];

  // Actions
  startSession: (gameId: string) => string;
  endSession: (sessionId: string, score: number, duration: number) => void;
  updateLeaderboard: (gameId: string, username: string, score: number) => void;
  getGameStats: (gameId: string) => GameStats | undefined;
  getLeaderboard: (gameId: string) => LeaderboardEntry[];
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      sessions: [],
      stats: {},
      leaderboard: [],

      startSession: (gameId: string) => {
        const sessionId = Math.random().toString(36).substring(7);
        const newSession: GameSession = {
          id: sessionId,
          gameId,
          score: 0,
          duration: 0,
          completed: false,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          sessions: [...state.sessions, newSession],
        }));

        return sessionId;
      },

      endSession: (sessionId: string, score: number, duration: number) => {
        set((state) => {
          const session = state.sessions.find((s) => s.id === sessionId);
          if (!session) return state;

          const updatedSessions = state.sessions.map((s) =>
            s.id === sessionId ? { ...s, score, duration, completed: true } : s,
          );

          // Update stats
          const gameId = session.gameId;
          const currentStats = state.stats[gameId] || {
            gameId,
            totalPlays: 0,
            totalScore: 0,
            highScore: 0,
            totalDuration: 0,
            lastPlayed: new Date().toISOString(),
          };

          const updatedStats = {
            ...state.stats,
            [gameId]: {
              ...currentStats,
              totalPlays: currentStats.totalPlays + 1,
              totalScore: currentStats.totalScore + score,
              highScore: Math.max(currentStats.highScore, score),
              totalDuration: currentStats.totalDuration + duration,
              lastPlayed: new Date().toISOString(),
            },
          };

          return {
            sessions: updatedSessions,
            stats: updatedStats,
          };
        });
      },

      updateLeaderboard: (gameId: string, username: string, score: number) => {
        set((state) => {
          const newEntry: LeaderboardEntry = {
            id: Math.random().toString(36).substring(7),
            username,
            gameId,
            score,
            createdAt: new Date().toISOString(),
          };

          const updatedLeaderboard = [...state.leaderboard, newEntry]
            .filter((entry) => entry.gameId === gameId)
            .sort((a, b) => b.score - a.score)
            .map((entry, index) => ({ ...entry, rank: index + 1 }));

          const otherGames = state.leaderboard.filter(
            (entry) => entry.gameId !== gameId,
          );

          return {
            leaderboard: [...otherGames, ...updatedLeaderboard],
          };
        });
      },

      getGameStats: (gameId: string) => {
        return get().stats[gameId];
      },

      getLeaderboard: (gameId: string) => {
        return get()
          .leaderboard.filter((entry) => entry.gameId === gameId)
          .sort((a, b) => (a.rank || 0) - (b.rank || 0));
      },
    }),
    {
      name: "game-storage",
    },
  ),
);
