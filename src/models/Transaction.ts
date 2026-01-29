import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  gameId: string;
  amount: number;
  type: "purchase" | "reward" | "adjustment";
  status: "completed" | "pending" | "failed";
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    gameId: { type: String, required: true },
    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: ["purchase", "reward", "adjustment"],
      default: "purchase",
    },
    status: {
      type: String,
      enum: ["completed", "pending", "failed"],
      default: "completed",
    },
  },
  { timestamps: true },
);

export default mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);
