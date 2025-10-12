import { Schema, model, Types } from "mongoose";
import { listProducts, getProductBySlug, createProduct, updateProductBySlug, deleteProductBySlug } from "../controllers/productsController";

export interface IProduct {
  slug: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  images: string[];
  categorySlug: string;
  rating?: number;
  reviewsCount?: number;
  inStock?: boolean;
  sizeOptions?: string[];
  details?: string[];
  materialCare?: string[];
  isLimited?: boolean; // New field for Dlaven Limited products
  section?: string; // 'prive' | 'dlaven-limited' | 'dl-barry' (optional)
  tags?: string[]; // e.g. ['normal-product','dl-limited','dl-prive','dl-barry']
}

const ProductSchema = new Schema<IProduct>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    images: { type: [String], default: [] },
    categorySlug: { type: String, required: true, index: true },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    sizeOptions: { type: [String], default: undefined },
    details: { type: [String], default: undefined },
    materialCare: { type: [String], default: undefined },
    isLimited: { type: Boolean, default: false, index: true }, // New field added to schema
  section: { type: String, default: null, index: true },
    tags: { type: [String], default: undefined, index: true },
  },
  { timestamps: true }
);

export const Product = model<IProduct>("Product", ProductSchema);
