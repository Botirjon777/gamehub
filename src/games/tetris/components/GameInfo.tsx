"use client";

import { GameStats } from "../types";

interface GameInfoProps {
  stats: GameStats;
  isGameOver: boolean;
  isPaused: boolean;
}

export default function GameInfo({
  stats,
  isGameOver,
  isPaused,
}: GameInfoProps) {
  return (
    <div className="space-y-4">
      <div className="glass p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Score</h3>
        <p className="text-3xl font-bold gradient-text">{stats.score}</p>
      </div>

      <div className="glass p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Level</h3>
        <p className="text-2xl font-bold text-primary-light">{stats.level}</p>
      </div>

      <div className="glass p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Lines</h3>
        <p className="text-2xl font-bold text-secondary-light">{stats.lines}</p>
      </div>

      {isPaused && !isGameOver && (
        <div className="glass-strong p-4 rounded-lg border border-warning">
          <p className="text-center text-warning font-semibold">⏸ PAUSED</p>
        </div>
      )}

      {isGameOver && (
        <div className="glass-strong p-4 rounded-lg border border-error">
          <p className="text-center text-error font-semibold">GAME OVER</p>
        </div>
      )}
    </div>
  );
}
