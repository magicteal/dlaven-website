"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = void 0;
const mongoose_1 = require("mongoose");
const CartItemSchema = new mongoose_1.Schema({
    productSlug: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    size: { type: String, required: false },
});
const CartSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", index: true, default: null },
    guestId: { type: String, index: true, default: null },
    items: { type: [CartItemSchema], default: [] },
}, { timestamps: true });
exports.Cart = (0, mongoose_1.model)("Cart", CartSchema);
