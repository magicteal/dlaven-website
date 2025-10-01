import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICode extends Document {
  code: string; // numeric string; keep as string to preserve leading zeros. Prefix handled in presentation.
  usedBy?: Types.ObjectId | null; // reference to User who used it (nullable)
  createdAt: Date;
  updatedAt: Date;
}

const CodeSchema = new Schema<ICode>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      // Store only numeric characters so leading zeros are preserved.
      match: [/^\d+$/, "Code must contain only digits"],
    },
    usedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

export const Code =
  mongoose.models.Code || mongoose.model<ICode>("Code", CodeSchema);
