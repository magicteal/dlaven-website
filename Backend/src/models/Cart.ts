import { Schema, model, Types, type HydratedDocument } from "mongoose";

export interface ICartItem {
  productSlug: string;
  name: string;
  price: number;
  currency: string;
  image: string;
  quantity: number;
  size?: string;
}

export interface ICart {
  userId?: Types.ObjectId | null;
  guestId?: string | null;
  items: ICartItem[];
}

const CartItemSchema = new Schema<ICartItem>({
  productSlug: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: String, required: true },
  image: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  size: { type: String, required: false },
});

const CartSchema = new Schema<ICart>({
  userId: { type: Schema.Types.ObjectId, ref: "User", index: true, default: null },
  guestId: { type: String, index: true, default: null },
  items: { type: [CartItemSchema], default: [] },
}, { timestamps: true });

export const Cart = model<ICart>("Cart", CartSchema);

export type CartDoc = HydratedDocument<ICart>;
