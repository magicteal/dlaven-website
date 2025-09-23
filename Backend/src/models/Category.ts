import { Schema, model } from "mongoose";

export interface ICategory {
  slug: string;
  name: string;
  imageSrc?: string;
  imageAlt?: string;
  heroImage?: string;
  badge?: string;
  description?: string;
}

const CategorySchema = new Schema<ICategory>({
  slug: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  imageSrc: { type: String },
  imageAlt: { type: String },
  heroImage: { type: String },
  badge: { type: String },
  description: { type: String },
});

export const Category = model<ICategory>("Category", CategorySchema);
