import { DinosaurConfig } from "./types";

export const INITIAL_BALANCE = 100;

export const DINOSAURS: DinosaurConfig[] = [
  {
    id: "raptor",
    name: "Velociraptor",
    description: "Small and fast miner. Efficient for beginners.",
    cost: 50,
    incomePerMinute: 1,
    color: "#4ade80", // Green
  },
  {
    id: "triceratops",
    name: "Triceratops",
    description: "Steady and reliable. Strong head for digging.",
    cost: 250,
    incomePerMinute: 6,
    color: "#60a5fa", // Blue
  },
  {
    id: "pterodactyl",
    name: "Pterodactyl",
    description: "Airborne observation helps find better spots.",
    cost: 1000,
    incomePerMinute: 25,
    color: "#f472b6", // Pink
  },
  {
    id: "t-rex",
    name: "Tyrannosaurus Rex",
    description: "The king of miners. Massive income potential.",
    cost: 5000,
    incomePerMinute: 150,
    color: "#f87171", // Red
  },
  {
    id: "spinosaurus",
    name: "Spinosaurus",
    description: "Aquatic mining expert. Untapped riches await.",
    cost: 25000,
    incomePerMinute: 800,
    color: "#818cf8", // Indigo
  },
  {
    id: "brachiosaurus",
    name: "Brachiosaurus",
    description: "Reaches the highest nodes. Legendary miner.",
    cost: 100000,
    incomePerMinute: 4000,
    color: "#fbbf24", // Amber
  },
];
