export type DinosaurType =
  | "raptor"
  | "triceratops"
  | "pterodactyl"
  | "t-rex"
  | "spinosaurus"
  | "brachiosaurus";

export interface DinosaurConfig {
  id: DinosaurType;
  name: string;
  description: string;
  cost: number;
  incomePerMinute: number;
  color: string;
}

export interface OwnedDinosaur {
  id: string; // Unique instance ID
  type: DinosaurType;
  purchasedAt: number;
}

export interface MiningState {
  balance: number;
  ownedDinosaurs: OwnedDinosaur[];
  lastUpdate: number;
}
