import { Game } from "@/types";

export const gamesData: Game[] = [
  {
    id: "snake",
    title: "Snake Game",
    description:
      "Classic snake game with modern graphics. Eat food, grow longer, and avoid hitting yourself!",
    category: "arcade",
    thumbnail: "/games/snake.jpg",
    route: "/games/snake",
    comingSoon: true,
  },
  {
    id: "tetris",
    title: "Tetris",
    description:
      "The legendary puzzle game. Stack blocks and clear lines to score points!",
    category: "puzzle",
    thumbnail: "/games/tetris.jpg",
    route: "/games/tetris",
    comingSoon: true,
  },
  {
    id: "chess",
    title: "Chess",
    description:
      "Strategic board game. Challenge the AI or play against other players online!",
    category: "strategy",
    thumbnail: "/games/chess.jpg",
    route: "/games/chess",
    comingSoon: true,
  },
  {
    id: "monopoly",
    title: "Monopoly",
    description: "Buy, sell, and trade properties in this classic board game!",
    category: "strategy",
    thumbnail: "/games/monopoly.jpg",
    route: "/games/monopoly",
    comingSoon: true,
  },
  {
    id: "mining",
    title: "Mining Adventure",
    description: "Dig deep, collect resources, and build your mining empire!",
    category: "mining",
    thumbnail: "/games/mining.jpg",
    route: "/games/mining",
    comingSoon: true,
  },
  {
    id: "crypto-miner",
    title: "Crypto Miner",
    description: "Mine virtual cryptocurrency and upgrade your mining rigs!",
    category: "mining",
    thumbnail: "/games/crypto.jpg",
    route: "/games/crypto-miner",
    comingSoon: true,
  },
];

export function getGameById(id: string): Game | undefined {
  return gamesData.find((game) => game.id === id);
}

export function getGamesByCategory(category: string): Game[] {
  return gamesData.filter((game) => game.category === category);
}
