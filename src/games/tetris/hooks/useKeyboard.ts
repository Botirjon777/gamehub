"use client";

import { useEffect, useCallback } from "react";

interface UseKeyboardProps {
  onLeft: () => void;
  onRight: () => void;
  onDown: () => void;
  onRotate: () => void;
  onHardDrop: () => void;
  onPause: () => void;
  enabled: boolean;
}

export function useKeyboard({
  onLeft,
  onRight,
  onDown,
  onRotate,
  onHardDrop,
  onPause,
  enabled,
}: UseKeyboardProps) {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          onLeft();
          break;
        case "ArrowRight":
          event.preventDefault();
          onRight();
          break;
        case "ArrowDown":
          event.preventDefault();
          onDown();
          break;
        case "ArrowUp":
        case " ":
          event.preventDefault();
          onRotate();
          break;
        case "Enter":
          event.preventDefault();
          onHardDrop();
          break;
        case "p":
        case "P":
        case "Escape":
          event.preventDefault();
          onPause();
          break;
      }
    },
    [enabled, onLeft, onRight, onDown, onRotate, onHardDrop, onPause],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);
}
