import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name?: string;
  title?: string;
  phone?: string;
  dob?: string;
  marketingConsent?: boolean;
  role: "user" | "admin";
  addresses?: Types.DocumentArray<IUserAddress> | IUserAddress[];
  address?: {
    fullName?: string;
    phone?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  passwordResetToken?: string | null;
  passwordResetExpires?: Date | null;
  // Tracking Privé usage and Barry entitlements
  privePurchasesCount?: number;
  barryEntitlementsAvailable?: number;
  lastPriveCodeVerifiedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserAddress extends Document {
  _id: Types.ObjectId;
  label?: string;
  fullName?: string;
  phone?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
}

const AddressSchema = new Schema<IUserAddress>(
  {
    label: { type: String },
    fullName: { type: String },
    phone: { type: String },
    line1: { type: String },
    line2: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String },
    isDefault: { type: Boolean, default: false, index: true },
  },
  { _id: true, id: false, timestamps: false }
);

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String },
    title: { type: String },
    phone: { type: String },
    dob: { type: String },
    marketingConsent: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      index: true,
    },
    addresses: { type: [AddressSchema], default: [] },
    address: {
      fullName: { type: String },
      phone: { type: String },
      line1: { type: String },
      line2: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
    passwordResetToken: { type: String, default: null },
    passwordResetExpires: { type: Date, default: null },
    // New fields for Privé/Barry logic
    privePurchasesCount: { type: Number, default: 0 },
    barryEntitlementsAvailable: { type: Number, default: 0 },
    lastPriveCodeVerifiedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
