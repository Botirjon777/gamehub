// Tetris game types and interfaces

export type CellValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type Board = CellValue[][];

export interface Position {
  x: number;
  y: number;
}

export interface Tetromino {
  shape: number[][];
  color: CellValue;
}

export interface GameState {
  board: Board;
  currentPiece: Tetromino | null;
  currentPosition: Position;
  nextPiece: Tetromino | null;
  score: number;
  level: number;
  lines: number;
  isGameOver: boolean;
  isPaused: boolean;
}

export interface GameStats {
  score: number;
  level: number;
  lines: number;
}
