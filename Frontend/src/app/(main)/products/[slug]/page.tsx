import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/ProductDetailClient";
import { API_BASE } from "@/lib/api";
import type { Product as ClientProduct } from "@/types/product";

type ApiProduct = {
  slug: string;
  name: string;
  description?: string;
  price: number;
  images: string[];
  categorySlug?: string;
  rating?: number;
  reviewsCount?: number;
  inStock?: boolean;
  sizeOptions?: string[];
  details?: string[];
  materialCare?: string[];
};

function toClientProduct(p: ApiProduct): ClientProduct {
  return {
    slug: p.slug,
    name: p.name,
    price: p.price,
    images: p.images,
    description: p.description || "",
    categorySlug: p.categorySlug,
    rating: p.rating,
    reviewsCount: p.reviewsCount,
    inStock: p.inStock,
    sizeOptions: p.sizeOptions,
    details: p.details,
    materialCare: p.materialCare,
  };
}

async function fetchProduct(slug: string): Promise<ApiProduct | null> {
  const res = await fetch(`${API_BASE}/api/products/${slug}`, { cache: "no-store" });
  
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load product");
  const data = await res.json();
  // console.log("Fetched product data:", data);
  return data.item as ApiProduct;
}

async function fetchRelated(categorySlug: string | undefined, currentSlug: string): Promise<ClientProduct[]> {
  const url = new URL(`${API_BASE}/api/products`);
  if (categorySlug) url.searchParams.set("category", categorySlug);
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  const items: ApiProduct[] = data.items || [];
  return items.filter((p) => p.slug !== currentSlug).map(toClientProduct);
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const apiProduct = await fetchProduct(slug);
  if (!apiProduct) return notFound();
  const product = toClientProduct(apiProduct);
  const related = await fetchRelated(product.categorySlug, product.slug);
  return (
    <main>
      <ProductDetailClient product={product} related={related} />
    </main>
  );
}
