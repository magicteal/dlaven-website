import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICode extends Document {
  code: string;
  batch: number;
  isDeleted: boolean; 
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
    isDeleted: {
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
    // codeCollection removed: DLaven tracks only codes; collection concept has been removed
  },
  { timestamps: true }
);

export const Code =
  mongoose.models.Code || mongoose.model<ICode>("Code", CodeSchema);
