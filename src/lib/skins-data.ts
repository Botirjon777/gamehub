export interface GlobalSkin {
  id: string;
  gameId: string; // The game this skin belongs to
  name: string;
  description: string;
  cost: number;
  multiplier: number; // Boost effect for that game
  previewColor: string;
}

export const GLOBAL_SKINS: GlobalSkin[] = [
  // Mining Adventure Skins
  {
    id: "mining-classic",
    gameId: "mining-adventure",
    name: "Classic Miner",
    description: "The original prehistoric look.",
    cost: 0,
    multiplier: 1,
    previewColor: "linear-gradient(135deg, #4ade80, #60a5fa)",
  },
  {
    id: "mining-neon",
    gameId: "mining-adventure",
    name: "Neon Strike",
    description: "Cyberpunk dinosaurs. Boosts income by 2x!",
    cost: 5000,
    multiplier: 2,
    previewColor: "linear-gradient(135deg, #f472b6, #818cf8)",
  },
  {
    id: "mining-gold",
    gameId: "mining-adventure",
    name: "Midas Touch",
    description: "Golden touch. Boosts income by 3x!",
    cost: 50000,
    multiplier: 3,
    previewColor: "linear-gradient(135deg, #fbbf24, #f59e0b)",
  },
  {
    id: "mining-void",
    gameId: "mining-adventure",
    name: "Void Dweller",
    description: "The ultimate miner. Boosts income by 4x!",
    cost: 250000,
    multiplier: 4,
    previewColor: "linear-gradient(135deg, #1f2937, #111827)",
  },
];
