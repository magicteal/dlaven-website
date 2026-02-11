import { Schema, model, Types } from "mongoose";

export interface IOrderItem {
  productSlug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
}

export interface IOrderAddress {
  label?: string;
  fullName?: string;
  phone?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export type OrderStatus = "created" | "paid" | "failed" | "refunded" | "cancelled" | "shipped" | "delivered";

export interface IOrder {
  userId: Types.ObjectId;
  items: IOrderItem[];
  address: IOrderAddress;
  subtotal: number;
  status: OrderStatus;
  razorpay?: {
    orderId?: string;
    paymentId?: string;
    signature?: string;
  };
}

const OrderItemSchema = new Schema<IOrderItem>({
  productSlug: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  size: { type: String },
});

const AddressSchema = new Schema<IOrderAddress>({
  label: { type: String },
  fullName: { type: String },
  phone: { type: String },
  line1: { type: String },
  line2: { type: String },
  city: { type: String },
  state: { type: String },
  postalCode: { type: String },
  country: { type: String },
});

const OrderSchema = new Schema<IOrder>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  items: { type: [OrderItemSchema], required: true },
  address: { type: AddressSchema, required: true },
  subtotal: { type: Number, required: true },
  status: { type: String, enum: ["created", "paid", "failed", "refunded", "cancelled", "shipped", "delivered"], default: "created", index: true },
  razorpay: {
    orderId: { type: String },
    paymentId: { type: String },
    signature: { type: String },
  },
}, { timestamps: true });

export const Order = model<IOrder>("Order", OrderSchema);
