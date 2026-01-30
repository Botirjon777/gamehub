import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  username: string;
  passwordHash: string;
  balance: number;
  purchasedGames: string[]; // Array of game IDs
  profileImage?: string;
  phoneNumber?: string;
  ownedSkins: string[]; // Global owned skins
  selectedSkins: Record<string, string>; // gameId -> skinId
  createdAt: Date;
  updatedAt: Date;
  role: "user" | "admin";
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    balance: { type: Number, default: 1000 }, // Starting credits
    purchasedGames: { type: [String], default: ["snake", "tetris"] }, // Default free games
    profileImage: { type: String, default: "" },
    phoneNumber: { type: String, default: "" },
    ownedSkins: { type: [String], default: ["default"] },
    selectedSkins: { type: Map, of: String, default: {} },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true },
);

if (process.env.NODE_ENV === "development") {
  delete (mongoose.models as any).User;
}

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
