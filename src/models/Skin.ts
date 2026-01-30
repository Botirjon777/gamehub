import mongoose, { Schema, Document } from "mongoose";

export interface ISkin extends Document {
  id: string;
  gameId: string;
  name: string;
  description: string;
  cost: number;
  previewColor: string; // Gradient or solid color
  createdAt: Date;
  updatedAt: Date;
}

const SkinSchema = new Schema<ISkin>(
  {
    id: { type: String, required: true, unique: true },
    gameId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    cost: { type: Number, required: true, default: 0 },
    previewColor: { type: String, required: true },
  },
  { timestamps: true },
);

if (process.env.NODE_ENV === "development") {
  delete (mongoose.models as any).Skin;
}

const Skin = mongoose.models.Skin || mongoose.model<ISkin>("Skin", SkinSchema);
export default Skin;
