import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICode extends Document {
  code: string;
  batch: number;
  isDeleted: boolean; // <-- Nayi field add ki
  usedBy?: Types.ObjectId | null;
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
    },
    batch: {
      type: Number,
      required: true,
      index: true,
    },
    isDeleted: { // <-- Nayi field ka schema
      type: Boolean,
      default: false,
      index: true,
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