"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = require("mongoose");
const ProductSchema = new mongoose_1.Schema({
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    images: { type: [String], default: [] },
    categorySlug: { type: String, required: true, index: true },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    sizeOptions: { type: [String], default: undefined },
    details: { type: [String], default: undefined },
    materialCare: { type: [String], default: undefined },
    tags: { type: [String], default: undefined, index: true },
}, { timestamps: true });
exports.Product = (0, mongoose_1.model)("Product", ProductSchema);
