import mongoose, { Schema, Document } from "mongoose";

export interface IGame extends Document {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  route: string;
  price: number;
  comingSoon: boolean;
  isNewArrival: boolean;
  settings?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const GameSchema = new Schema<IGame>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    thumbnail: { type: String, required: true },
    route: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    comingSoon: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    settings: { type: Map, of: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

if (process.env.NODE_ENV === "development") {
  delete (mongoose.models as any).Game;
}

const Game = mongoose.models.Game || mongoose.model<IGame>("Game", GameSchema);
export default Game;
