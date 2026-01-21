"use client";

import { Board as BoardType, Tetromino, Position } from "../types";
import { mergePieceToBoard } from "../functions/gameLogic";
import Cell from "./Cell";

interface BoardProps {
  board: BoardType;
  currentPiece: Tetromino | null;
  currentPosition: Position;
}

export default function Board({
  board,
  currentPiece,
  currentPosition,
}: BoardProps) {
  // Merge current piece with board for display
  const displayBoard = currentPiece
    ? mergePieceToBoard(board, currentPiece, currentPosition)
    : board;

  return (
    <div
      className="inline-grid gap-px p-2 glass-strong rounded-lg"
      style={{
        gridTemplateColumns: `repeat(10, 28px)`,
        gridTemplateRows: `repeat(20, 28px)`,
      }}
    >
      {displayBoard.map((row, y) =>
        row.map((cell, x) => <Cell key={`${y}-${x}`} value={cell} />),
      )}
    </div>
  );
}
