import { Board, Tetromino, Position, CellValue } from "../types";
import { BOARD_WIDTH, BOARD_HEIGHT, TETROMINOES } from "../constants";

// Create an empty board
export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array(BOARD_WIDTH).fill(0),
  ) as Board;
}

// Get a random tetromino
export function getRandomTetromino(): Tetromino {
  const randomIndex = Math.floor(Math.random() * TETROMINOES.length);
  return {
    shape: TETROMINOES[randomIndex].shape.map((row) => [...row]),
    color: TETROMINOES[randomIndex].color,
  };
}

// Rotate a tetromino 90 degrees clockwise
export function rotateTetromino(tetromino: Tetromino): Tetromino {
  const size = tetromino.shape.length;
  const rotated = Array.from({ length: size }, () =>
    Array(size).fill(0),
  ) as number[][];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      rotated[x][size - 1 - y] = tetromino.shape[y][x];
    }
  }

  return {
    shape: rotated,
    color: tetromino.color,
  };
}

// Check if a position is valid (no collision)
export function isValidPosition(
  board: Board,
  tetromino: Tetromino,
  position: Position,
): boolean {
  for (let y = 0; y < tetromino.shape.length; y++) {
    for (let x = 0; x < tetromino.shape[y].length; x++) {
      if (tetromino.shape[y][x] !== 0) {
        const newX = position.x + x;
        const newY = position.y + y;

        // Check boundaries
        if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
          return false;
        }

        // Check collision with existing pieces (but allow negative Y for spawning)
        if (newY >= 0 && board[newY][newX] !== 0) {
          return false;
        }
      }
    }
  }
  return true;
}

// Merge the current piece into the board
export function mergePieceToBoard(
  board: Board,
  tetromino: Tetromino,
  position: Position,
): Board {
  const newBoard = board.map((row) => [...row]) as Board;

  for (let y = 0; y < tetromino.shape.length; y++) {
    for (let x = 0; x < tetromino.shape[y].length; x++) {
      if (tetromino.shape[y][x] !== 0) {
        const boardY = position.y + y;
        const boardX = position.x + x;
        if (boardY >= 0 && boardY < BOARD_HEIGHT) {
          newBoard[boardY][boardX] = tetromino.color as CellValue;
        }
      }
    }
  }

  return newBoard;
}

// Clear completed lines and return the number of lines cleared
export function clearLines(board: Board): {
  board: Board;
  linesCleared: number;
} {
  let linesCleared = 0;
  const newBoard: Board = [];

  for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
    if (board[y].every((cell) => cell !== 0)) {
      linesCleared++;
    } else {
      newBoard.unshift([...board[y]] as CellValue[]);
    }
  }

  // Add empty lines at the top
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(0) as CellValue[]);
  }

  return { board: newBoard, linesCleared };
}

// Calculate score based on lines cleared
export function calculateScore(linesCleared: number, level: number): number {
  const basePoints = [0, 100, 300, 500, 800];
  return basePoints[linesCleared] * (level + 1);
}

// Calculate the level based on lines cleared
export function calculateLevel(totalLines: number): number {
  return Math.floor(totalLines / 10);
}

// Get the drop speed for the current level
export function getDropSpeed(level: number): number {
  const speed = 1000 - level * 100;
  return Math.max(speed, 100);
}

// Check if the game is over
export function isGameOver(
  board: Board,
  tetromino: Tetromino,
  position: Position,
): boolean {
  return !isValidPosition(board, tetromino, position);
}
