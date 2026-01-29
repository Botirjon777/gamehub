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

export interface Skin {
  id: string;
  name: string;
  description: string;
  cost: number;
  previewColor: string;
}

export interface MiningState {
  balance: number;
  ownedDinosaurs: OwnedDinosaur[];
  ownedSkins: string[]; // Array of skin IDs
  selectedSkinId: string | null;
  lastUpdate: number;
  isLoading: boolean;
  boostEndTime: number | null;
  lastBoostTime: number | null;
  activateBoost: () => boolean;
  buyDino: (type: DinosaurType) => boolean;
  buySkin: (skinId: string) => boolean;
  selectSkin: (skinId: string) => void;
  collectIncome: () => void;
  getIncomePerMinute: () => number;
  syncToServer: () => Promise<void>;
  loadFromServer: () => Promise<void>;
  resetGame: () => void;
}
