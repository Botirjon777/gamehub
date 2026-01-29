import mongoose, { Schema, Document } from "mongoose";

export interface IMiningProgress extends Document {
  userId: mongoose.Types.ObjectId;
  balance: number;
  ownedDinosaurs: {
    id: string;
    type: string;
    purchasedAt: number;
  }[];
  ownedSkins: string[];
  selectedSkinId: string | null;
  lastUpdate: number;
  lastBoostTime: number | null;
}

const OwnedDinosaurSchema = new Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  purchasedAt: { type: Number, required: true },
});

const MiningProgressSchema = new Schema<IMiningProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    balance: { type: Number, default: 100 },
    ownedDinosaurs: [OwnedDinosaurSchema],
    ownedSkins: { type: [String], default: ["default"] },
    selectedSkinId: { type: String, default: "default" },
    lastUpdate: { type: Number, default: Date.now },
    lastBoostTime: { type: Number, default: null },
  },
  { timestamps: true },
);

// Force delete the model from cache if we need to update schema during dev
if (process.env.NODE_ENV === "development") {
  delete mongoose.models.MiningProgress;
}

export default mongoose.models.MiningProgress ||
  mongoose.model<IMiningProgress>("MiningProgress", MiningProgressSchema);
