import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import { API_BASE } from "@/lib/api";

async function fetchProducts() {
  const res = await fetch(`${API_BASE}/api/products`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load products");
  const data = await res.json();
  return data.items as Array<{
    slug: string;
    name: string;
    price: number;
    images: string[];
    rating?: number;
    reviewsCount?: number;
    inStock?: boolean;
  }>;
}

export default async function ProductsPage() {
  const products = await fetchProducts();
  return (
    <main className="py-12 sm:py-20">
      <Container>
        <h1 className="text-2xl font-bold tracking-widest uppercase text-black" data-reveal="slideUp">Products</h1>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6" data-reveal="slideUp" data-stagger="0.1" data-delay="0.2">
          {products.map((p) => (
            <ProductCard
              key={p.slug}
              slug={p.slug}
              name={p.name}
              price={p.price}
              image={p.images[0]}
              rating={p.rating}
              reviewsCount={p.reviewsCount}
              inStock={p.inStock}
            />
          ))}
        </div>
      </Container>
    </main>
  );
}
