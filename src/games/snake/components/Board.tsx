import React from "react";
import { Position } from "../types";
import { GRID_SIZE } from "../constants";

interface BoardProps {
  snake: Position[];
  food: Position;
}

const Board: React.FC<BoardProps> = ({ snake, food }) => {
  return (
    <div
      className="grid bg-[#1a1c2c] border-4 border-[#25283d] rounded-lg overflow-hidden shadow-2xl"
      style={{
        gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
        gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        width: "min(90vw, 500px)",
        height: "min(90vw, 500px)",
      }}
    >
      {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
        const x = i % GRID_SIZE;
        const y = Math.floor(i / GRID_SIZE);
        const isSnakeHead = snake[0].x === x && snake[0].y === y;
        const isSnakeBody = snake.slice(1).some((s) => s.x === x && s.y === y);
        const isFood = food.x === x && food.y === y;

        return (
          <div
            key={i}
            className={`
              w-full h-full transition-all duration-150
              ${isSnakeHead ? "bg-green-400 rounded-sm scale-110 z-10 shadow-[0_0_10px_rgba(74,222,128,0.5)]" : ""}
              ${isSnakeBody ? "bg-green-600 rounded-sm scale-95" : ""}
              ${isFood ? "bg-red-500 rounded-full scale-75 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.6)]" : ""}
              ${!isSnakeHead && !isSnakeBody && !isFood ? "bg-transparent border-[0.5px] border-white/5" : ""}
            `}
          />
        );
      })}
    </div>
  );
};

export default Board;
