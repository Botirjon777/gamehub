import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  username: string;
  passwordHash: string;
  balance: number;
  purchasedGames: string[]; // Array of game IDs
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    balance: { type: Number, default: 1000 }, // Starting credits
    purchasedGames: { type: [String], default: ["snake", "tetris"] }, // Default free games
  },
  { timestamps: true },
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
