"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongoose_1 = require("mongoose");
const CategorySchema = new mongoose_1.Schema({
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    imageSrc: { type: String },
    imageAlt: { type: String },
    heroImage: { type: String },
    badge: { type: String },
    description: { type: String },
});
exports.Category = (0, mongoose_1.model)("Category", CategorySchema);
