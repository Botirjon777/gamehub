"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { GameState, Tetromino, Position } from "../types";
import {
  createEmptyBoard,
  getRandomTetromino,
  isValidPosition,
  rotateTetromino,
  mergePieceToBoard,
  clearLines,
  calculateScore,
  calculateLevel,
  getDropSpeed,
  isGameOver as checkGameOver,
} from "../functions/gameLogic";
import { INITIAL_POSITION } from "../constants";

export function useTetris() {
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    currentPiece: null,
    currentPosition: INITIAL_POSITION,
    nextPiece: getRandomTetromino(),
    score: 0,
    level: 0,
    lines: 0,
    isGameOver: false,
    isPaused: false,
  });

  const dropIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start a new game
  const startGame = useCallback(() => {
    const firstPiece = getRandomTetromino();
    const nextPiece = getRandomTetromino();

    setGameState({
      board: createEmptyBoard(),
      currentPiece: firstPiece,
      currentPosition: INITIAL_POSITION,
      nextPiece,
      score: 0,
      level: 0,
      lines: 0,
      isGameOver: false,
      isPaused: false,
    });
  }, []);

  // Move piece left
  const moveLeft = useCallback(() => {
    setGameState((prev) => {
      if (!prev.currentPiece || prev.isGameOver || prev.isPaused) return prev;

      const newPosition = {
        x: prev.currentPosition.x - 1,
        y: prev.currentPosition.y,
      };

      if (isValidPosition(prev.board, prev.currentPiece, newPosition)) {
        return { ...prev, currentPosition: newPosition };
      }

      return prev;
    });
  }, []);

  // Move piece right
  const moveRight = useCallback(() => {
    setGameState((prev) => {
      if (!prev.currentPiece || prev.isGameOver || prev.isPaused) return prev;

      const newPosition = {
        x: prev.currentPosition.x + 1,
        y: prev.currentPosition.y,
      };

      if (isValidPosition(prev.board, prev.currentPiece, newPosition)) {
        return { ...prev, currentPosition: newPosition };
      }

      return prev;
    });
  }, []);

  // Rotate piece
  const rotate = useCallback(() => {
    setGameState((prev) => {
      if (!prev.currentPiece || prev.isGameOver || prev.isPaused) return prev;

      const rotated = rotateTetromino(prev.currentPiece);

      if (isValidPosition(prev.board, rotated, prev.currentPosition)) {
        return { ...prev, currentPiece: rotated };
      }

      return prev;
    });
  }, []);

  // Drop piece one row
  const dropPiece = useCallback(() => {
    setGameState((prev) => {
      if (!prev.currentPiece || prev.isGameOver || prev.isPaused) return prev;

      const newPosition = {
        x: prev.currentPosition.x,
        y: prev.currentPosition.y + 1,
      };

      // Check if piece can move down
      if (isValidPosition(prev.board, prev.currentPiece, newPosition)) {
        return { ...prev, currentPosition: newPosition };
      }

      // Piece has landed - merge it to the board
      const mergedBoard = mergePieceToBoard(
        prev.board,
        prev.currentPiece,
        prev.currentPosition,
      );
      const { board: clearedBoard, linesCleared } = clearLines(mergedBoard);

      const newLines = prev.lines + linesCleared;
      const newLevel = calculateLevel(newLines);
      const newScore = prev.score + calculateScore(linesCleared, prev.level);

      // Spawn next piece
      const nextPiece = getRandomTetromino();
      const isOver = checkGameOver(
        clearedBoard,
        prev.nextPiece!,
        INITIAL_POSITION,
      );

      return {
        ...prev,
        board: clearedBoard,
        currentPiece: isOver ? null : prev.nextPiece,
        currentPosition: INITIAL_POSITION,
        nextPiece,
        score: newScore,
        level: newLevel,
        lines: newLines,
        isGameOver: isOver,
      };
    });
  }, []);

  // Hard drop (instant drop to bottom)
  const hardDrop = useCallback(() => {
    setGameState((prev) => {
      if (!prev.currentPiece || prev.isGameOver || prev.isPaused) return prev;

      let dropDistance = 0;
      let newPosition = { ...prev.currentPosition };

      // Find the lowest valid position
      while (
        isValidPosition(prev.board, prev.currentPiece, {
          x: newPosition.x,
          y: newPosition.y + 1,
        })
      ) {
        newPosition.y++;
        dropDistance++;
      }

      // Merge piece to board
      const mergedBoard = mergePieceToBoard(
        prev.board,
        prev.currentPiece,
        newPosition,
      );
      const { board: clearedBoard, linesCleared } = clearLines(mergedBoard);

      const newLines = prev.lines + linesCleared;
      const newLevel = calculateLevel(newLines);
      const newScore =
        prev.score +
        calculateScore(linesCleared, prev.level) +
        dropDistance * 2;

      // Spawn next piece
      const nextPiece = getRandomTetromino();
      const isOver = checkGameOver(
        clearedBoard,
        prev.nextPiece!,
        INITIAL_POSITION,
      );

      return {
        ...prev,
        board: clearedBoard,
        currentPiece: isOver ? null : prev.nextPiece,
        currentPosition: INITIAL_POSITION,
        nextPiece,
        score: newScore,
        level: newLevel,
        lines: newLines,
        isGameOver: isOver,
      };
    });
  }, []);

  // Toggle pause
  const togglePause = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      isPaused: !prev.isPaused,
    }));
  }, []);

  // Auto-drop effect
  useEffect(() => {
    if (gameState.isGameOver || gameState.isPaused || !gameState.currentPiece) {
      if (dropIntervalRef.current) {
        clearInterval(dropIntervalRef.current);
        dropIntervalRef.current = null;
      }
      return;
    }

    const speed = getDropSpeed(gameState.level);

    dropIntervalRef.current = setInterval(() => {
      dropPiece();
    }, speed);

    return () => {
      if (dropIntervalRef.current) {
        clearInterval(dropIntervalRef.current);
      }
    };
  }, [
    gameState.level,
    gameState.isGameOver,
    gameState.isPaused,
    gameState.currentPiece,
    dropPiece,
  ]);

  return {
    gameState,
    actions: {
      startGame,
      moveLeft,
      moveRight,
      rotate,
      dropPiece,
      hardDrop,
      togglePause,
    },
  };
}
