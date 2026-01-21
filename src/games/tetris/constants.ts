import { Tetromino } from "./types";

// Board dimensions
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

// Game speeds (milliseconds per drop)
export const INITIAL_SPEED = 1000;
export const SPEED_INCREASE_PER_LEVEL = 100;
export const MIN_SPEED = 100;

// Scoring
export const POINTS_SINGLE_LINE = 100;
export const POINTS_DOUBLE_LINE = 300;
export const POINTS_TRIPLE_LINE = 500;
export const POINTS_TETRIS = 800;
export const POINTS_SOFT_DROP = 1;
export const POINTS_HARD_DROP = 2;

// Lines needed to level up
export const LINES_PER_LEVEL = 10;

// Tetromino shapes (I, O, T, S, Z, J, L)
export const TETROMINOES: Tetromino[] = [
  // I - Cyan
  {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: 1,
  },
  // O - Yellow
  {
    shape: [
      [2, 2],
      [2, 2],
    ],
    color: 2,
  },
  // T - Purple
  {
    shape: [
      [0, 3, 0],
      [3, 3, 3],
      [0, 0, 0],
    ],
    color: 3,
  },
  // S - Green
  {
    shape: [
      [0, 4, 4],
      [4, 4, 0],
      [0, 0, 0],
    ],
    color: 4,
  },
  // Z - Red
  {
    shape: [
      [5, 5, 0],
      [0, 5, 5],
      [0, 0, 0],
    ],
    color: 5,
  },
  // J - Blue
  {
    shape: [
      [6, 0, 0],
      [6, 6, 6],
      [0, 0, 0],
    ],
    color: 6,
  },
  // L - Orange
  {
    shape: [
      [0, 0, 7],
      [7, 7, 7],
      [0, 0, 0],
    ],
    color: 7,
  },
];

// Colors for each tetromino type
export const TETROMINO_COLORS: Record<number, string> = {
  0: "transparent",
  1: "#00f0f0", // Cyan (I)
  2: "#f0f000", // Yellow (O)
  3: "#a000f0", // Purple (T)
  4: "#00f000", // Green (S)
  5: "#f00000", // Red (Z)
  6: "#0000f0", // Blue (J)
  7: "#f0a000", // Orange (L)
};

// Initial starting position for new pieces
export const INITIAL_POSITION = {
  x: Math.floor(BOARD_WIDTH / 2) - 2,
  y: 0,
};
