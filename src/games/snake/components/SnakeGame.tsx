"use client";

import React from "react";
import Board from "./Board";
import GameInfo from "./GameInfo";
import GameControls from "./GameControls";
import { useSnake } from "../hooks/useSnake";

const SnakeGame: React.FC = () => {
  const {
    snake,
    food,
    score,
    highScore,
    isGameOver,
    isPaused,
    setIsPaused,
    resetGame,
  } = useSnake();

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-[600px]">
      <GameInfo score={score} highScore={highScore} />

      <div className="relative group">
        <Board snake={snake} food={food} />

        {(isPaused || isGameOver) && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-20">
            {isGameOver ? (
              <>
                <h2 className="text-5xl font-black text-red-500 mb-2 uppercase tracking-tighter">
                  Game Over
                </h2>
                <p className="text-white/60 mb-6 font-medium">
                  Final Score: {score}
                </p>
              </>
            ) : (
              <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter">
                Paused
              </h2>
            )}

            <GameControls
              isPaused={isPaused}
              isGameOver={isGameOver}
              onTogglePause={() => setIsPaused(!isPaused)}
              onReset={resetGame}
            />
          </div>
        )}
      </div>

      {!isPaused && !isGameOver && (
        <div className="mt-8 text-white/40 text-sm font-medium animate-pulse">
          Use Arrow Keys to Navigate • Space to Pause
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
