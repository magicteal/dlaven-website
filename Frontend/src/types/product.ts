export interface Product {
  slug: string;
  name: string;
  price: number;
  images: string[];
  description?: string;
  rating?: number;
  reviewsCount?: number;
  inStock?: boolean;
  sizeOptions?: string[];
  details?: string[];
  materialCare?: string[];
  category?: string;
  categorySlug?: string;
  tag?: "normal-product" | "dl-limited" | "dl-prive" | "dl-barry";
}
