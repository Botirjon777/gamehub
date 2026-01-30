import mongoose, { Schema, Document } from "mongoose";

export interface IPoster extends Document {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PosterSchema = new Schema<IPoster>(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    buttonText: { type: String, default: "Play Now" },
    buttonLink: { type: String, required: true },
    imageUrl: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

if (process.env.NODE_ENV === "development") {
  delete (mongoose.models as any).Poster;
}

const Poster =
  mongoose.models.Poster || mongoose.model<IPoster>("Poster", PosterSchema);
export default Poster;
