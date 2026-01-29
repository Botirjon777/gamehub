import React from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

interface GameControlsProps {
  isPaused: boolean;
  isGameOver: boolean;
  onTogglePause: () => void;
  onReset: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  isPaused,
  isGameOver,
  onTogglePause,
  onReset,
}) => {
  return (
    <div className="flex gap-4 mt-8">
      {!isGameOver ? (
        <button
          onClick={onTogglePause}
          className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20"
        >
          {isPaused ? (
            <Play size={20} fill="currentColor" />
          ) : (
            <Pause size={20} fill="currentColor" />
          )}
          {isPaused ? "Start Game" : "Pause"}
        </button>
      ) : (
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-500 text-white rounded-full font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-red-500/20"
        >
          <RotateCcw size={20} />
          Play Again
        </button>
      )}

      {!isGameOver && (
        <button
          onClick={onReset}
          className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all transform hover:scale-105 active:scale-95 border border-white/10"
          title="Restart Game"
        >
          <RotateCcw size={20} />
        </button>
      )}
    </div>
  );
};

export default GameControls;
