import { useState, useEffect, useCallback, useRef } from "react";
import { Direction, Position, GameState } from "../types";
import {
  GRID_SIZE,
  INITIAL_SNAKE,
  INITIAL_DIRECTION,
  INITIAL_FOOD,
  GAME_SPEED,
} from "../constants";

export const useSnake = () => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Position>(INITIAL_FOOD);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  const directionRef = useRef<Direction>(INITIAL_DIRECTION);

  useEffect(() => {
    const savedHighScore = localStorage.getItem("snakeHighScore");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("snakeHighScore", score.toString());
    }
  }, [score, highScore]);

  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food spawns on snake body
      const onSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y,
      );
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(INITIAL_FOOD);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  }, []);

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (directionRef.current) {
        case "UP":
          newHead.y -= 1;
          break;
        case "DOWN":
          newHead.y += 1;
          break;
        case "LEFT":
          newHead.x -= 1;
          break;
        case "RIGHT":
          newHead.x += 1;
          break;
      }

      // Check collision with walls
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Check collision with self
      if (
        prevSnake.some(
          (segment) => segment.x === newHead.x && segment.y === newHead.y,
        )
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if food eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((prev) => prev + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop(); // Remove tail
      }

      return newSnake;
    });
  }, [food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [moveSnake]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowUp":
        if (directionRef.current !== "DOWN") {
          setDirection("UP");
          directionRef.current = "UP";
        }
        break;
      case "ArrowDown":
        if (directionRef.current !== "UP") {
          setDirection("DOWN");
          directionRef.current = "DOWN";
        }
        break;
      case "ArrowLeft":
        if (directionRef.current !== "RIGHT") {
          setDirection("LEFT");
          directionRef.current = "LEFT";
        }
        break;
      case "ArrowRight":
        if (directionRef.current !== "LEFT") {
          setDirection("RIGHT");
          directionRef.current = "RIGHT";
        }
        break;
      case " ":
        setIsPaused((prev) => !prev);
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  return {
    snake,
    food,
    score,
    highScore,
    isGameOver,
    isPaused,
    setIsPaused,
    resetGame,
  };
};
