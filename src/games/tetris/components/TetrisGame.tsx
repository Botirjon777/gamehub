"use client";

import { useTetris } from "../hooks/useTetris";
import { useKeyboard } from "../hooks/useKeyboard";
import Board from "./Board";
import NextPiece from "./NextPiece";
import GameInfo from "./GameInfo";
import GameControls from "./GameControls";

export default function TetrisGame() {
  const { gameState, actions } = useTetris();

  useKeyboard({
    onLeft: actions.moveLeft,
    onRight: actions.moveRight,
    onDown: actions.dropPiece,
    onRotate: actions.rotate,
    onHardDrop: actions.hardDrop,
    onPause: actions.togglePause,
    enabled: !gameState.isGameOver && gameState.currentPiece !== null,
  });

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Title */}
        <div className="text-center mb-8 animate-slide-down">
          <h1 className="mb-2">
            <span className="gradient-text">Tetris</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Stack the blocks and clear lines!
          </p>
        </div>

        {/* Game Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 items-start">
          {/* Left Panel - Game Info & Next Piece */}
          <div className="space-y-6 lg:order-1 animate-slide-up">
            <GameInfo
              stats={{
                score: gameState.score,
                level: gameState.level,
                lines: gameState.lines,
              }}
              isGameOver={gameState.isGameOver}
              isPaused={gameState.isPaused}
            />
            <NextPiece piece={gameState.nextPiece} />
          </div>

          {/* Center - Game Board */}
          <div className="flex justify-center lg:order-2 animate-scale-in">
            <Board
              board={gameState.board}
              currentPiece={gameState.currentPiece}
              currentPosition={gameState.currentPosition}
            />
          </div>

          {/* Right Panel - Controls */}
          <div
            className="lg:order-3 animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            <GameControls
              onStart={actions.startGame}
              onPause={actions.togglePause}
              onLeft={actions.moveLeft}
              onRight={actions.moveRight}
              onDown={actions.dropPiece}
              onRotate={actions.rotate}
              onHardDrop={actions.hardDrop}
              isGameOver={gameState.isGameOver}
              isPaused={gameState.isPaused}
              hasStarted={
                gameState.currentPiece !== null || gameState.isGameOver
              }
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 max-w-3xl mx-auto glass p-6 rounded-lg animate-fade-in">
          <h2 className="text-2xl font-bold mb-4 text-center">How to Play</h2>
          <div className="grid md:grid-cols-2 gap-6 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                🎯 Objective
              </h3>
              <p className="text-sm">
                Stack falling blocks to create complete horizontal lines. When a
                line is completed, it disappears and you earn points!
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">📈 Scoring</h3>
              <p className="text-sm">
                Single line: 100 pts • Double: 300 pts • Triple: 500 pts •
                Tetris (4 lines): 800 pts
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">⚡ Speed</h3>
              <p className="text-sm">
                The game speeds up every 10 lines cleared. Plan your moves
                carefully as the difficulty increases!
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">💡 Tips</h3>
              <p className="text-sm">
                Try to keep your stack low and avoid creating gaps. Save space
                for the long I-piece to score a Tetris!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
