"use client";

import { Tetromino } from "../types";
import Cell from "./Cell";

interface NextPieceProps {
  piece: Tetromino | null;
}

export default function NextPiece({ piece }: NextPieceProps) {
  if (!piece) return null;

  return (
    <div className="glass p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-3 text-center">Next</h3>
      <div
        className="inline-grid gap-px mx-auto"
        style={{
          gridTemplateColumns: `repeat(${piece.shape[0].length}, 24px)`,
        }}
      >
        {piece.shape.map((row, y) =>
          row.map((cell, x) => (
            <Cell key={`${y}-${x}`} value={cell !== 0 ? piece.color : 0} />
          )),
        )}
      </div>
    </div>
  );
}
