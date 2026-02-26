"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const OrderItemSchema = new mongoose_1.Schema({
    productSlug: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    size: { type: String },
});
const AddressSchema = new mongoose_1.Schema({
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
const OrderSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    orderNumber: { type: String, required: true, index: true },
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
exports.Order = (0, mongoose_1.model)("Order", OrderSchema);
