import { Direction, Position } from "./types";

export const GRID_SIZE = 20;

export const INITIAL_SNAKE: Position[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];

export const INITIAL_DIRECTION: Direction = "UP";

export const INITIAL_FOOD: Position = { x: 5, y: 5 };

export const GAME_SPEED = 150; // milliseconds
