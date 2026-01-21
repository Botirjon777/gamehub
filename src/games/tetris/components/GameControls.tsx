"use client";

import Button from "@/components/ui/Button";
import {
  Play,
  RotateCw,
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  Pause,
} from "lucide-react";

interface GameControlsProps {
  onStart: () => void;
  onPause: () => void;
  onLeft: () => void;
  onRight: () => void;
  onDown: () => void;
  onRotate: () => void;
  onHardDrop: () => void;
  isGameOver: boolean;
  isPaused: boolean;
  hasStarted: boolean;
}

export default function GameControls({
  onStart,
  onPause,
  onLeft,
  onRight,
  onDown,
  onRotate,
  onHardDrop,
  isGameOver,
  isPaused,
  hasStarted,
}: GameControlsProps) {
  return (
    <div className="space-y-4">
      {/* Start/Restart Button */}
      <Button variant="primary" size="lg" className="w-full" onClick={onStart}>
        <Play className="w-5 h-5 mr-2" />
        {!hasStarted ? "Start Game" : "Restart"}
      </Button>

      {/* Pause Button */}
      {hasStarted && !isGameOver && (
        <Button variant="ghost" size="lg" className="w-full" onClick={onPause}>
          <Pause className="w-5 h-5 mr-2" />
          {isPaused ? "Resume" : "Pause"}
        </Button>
      )}

      {/* Controls Info */}
      <div className="glass p-4 rounded-lg space-y-2 text-sm">
        <h3 className="font-semibold mb-3">Controls</h3>
        <div className="space-y-1 text-muted-foreground">
          <p>← → : Move</p>
          <p>↓ : Soft Drop</p>
          <p>↑ / Space : Rotate</p>
          <p>Enter : Hard Drop</p>
          <p>P / Esc : Pause</p>
        </div>
      </div>

      {/* Mobile Controls */}
      <div className="glass p-4 rounded-lg md:hidden">
        <h3 className="font-semibold mb-3 text-center">Touch Controls</h3>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onLeft}
            disabled={isGameOver || isPaused}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRotate}
            disabled={isGameOver || isPaused}
          >
            <RotateCw className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRight}
            disabled={isGameOver || isPaused}
          >
            <ArrowRight className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDown}
            disabled={isGameOver || isPaused}
            className="col-start-2"
          >
            <ArrowDown className="w-5 h-5" />
          </Button>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={onHardDrop}
          disabled={isGameOver || isPaused}
          className="w-full mt-2"
        >
          Hard Drop
        </Button>
      </div>
    </div>
  );
}
