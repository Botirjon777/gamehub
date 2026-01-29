"use client";

import { CellValue } from "../types";
import { TETROMINO_COLORS } from "../constants";

interface CellProps {
  value: CellValue;
}

export default function Cell({ value }: CellProps) {
  const color = TETROMINO_COLORS[value];
  const isEmpty = value === 0;

  return (
    <div
      className="aspect-square border transition-all duration-75"
      style={{
        backgroundColor: color,
        borderColor: isEmpty
          ? "rgba(255, 255, 255, 0.05)"
          : "rgba(0, 0, 0, 0.2)",
        boxShadow: isEmpty
          ? "none"
          : `inset 0 0 0 1px rgba(255, 255, 255, 0.1)`,
      }}
    />
  );
}
