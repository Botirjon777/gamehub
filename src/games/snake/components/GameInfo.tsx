import React from "react";

interface GameInfoProps {
  score: number;
  highScore: number;
}

const GameInfo: React.FC<GameInfoProps> = ({ score, highScore }) => {
  return (
    <div className="flex justify-between items-center w-full max-w-[500px] mb-6 p-4 bg-[#1a1c2c]/50 rounded-xl backdrop-blur-sm border border-white/10">
      <div className="flex flex-col">
        <span className="text-white/60 text-xs uppercase tracking-wider font-bold">
          Score
        </span>
        <span className="text-3xl font-black text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.3)]">
          {score.toString().padStart(4, "0")}
        </span>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-white/60 text-xs uppercase tracking-wider font-bold">
          High Score
        </span>
        <span className="text-3xl font-black text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.3)]">
          {highScore.toString().padStart(4, "0")}
        </span>
      </div>
    </div>
  );
};

export default GameInfo;
