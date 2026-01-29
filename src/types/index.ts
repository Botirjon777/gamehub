export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string | null;
  balance: number;
  purchasedGames: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  category: "puzzle" | "strategy" | "arcade" | "mining";
  thumbnail: string;
  route: string;
  price: number;
  comingSoon?: boolean;
  isNew?: boolean;
}

export interface GameSession {
  id: string;
  userId: string;
  gameId: string;
  score: number;
  duration: number;
  completed: boolean;
  createdAt: Date;
}

export interface GameStats {
  id: string;
  userId: string;
  gameId: string;
  totalPlays: number;
  totalScore: number;
  highScore: number;
  totalDuration: number;
  lastPlayed: Date;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  gameId: string;
  score: number;
  rank?: number | null;
  createdAt: Date;
  user: {
    username: string;
    avatar?: string | null;
  };
}
