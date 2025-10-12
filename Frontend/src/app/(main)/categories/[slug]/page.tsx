import Image from "next/image";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import { API_BASE } from "@/lib/api";
import { getCategoryBySlug } from "@/data/categories";

async function fetchProductsForCategory(slug: string) {
  const res = await fetch(
    `${API_BASE}/api/products?category=${encodeURIComponent(slug)}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to load products");
  const data = await res.json();
  return (data.items || []) as Array<{
    slug: string;
    name: string;
    price: number;
    currency: string;
    images: string[];
    rating?: number;
    reviewsCount?: number;
    inStock?: boolean;
  }>;
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const category = getCategoryBySlug(slug);
  if (!category) return notFound();

  const items = await fetchProductsForCategory(slug);
  const bg =
    category.heroImage || category.imageSrc || "/images/placeholder.png";

  return (
    <main>
      {/* Hero Section */}
      <section className="relative w-full text-white">
        <div className="relative h-[42vh] min-h-[360px] w-full overflow-hidden">
          <Image
            src={bg}
            alt={category.imageAlt || ""}
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
            {category.badge ? (
              <span className="inline-block text-[10px] tracking-[0.2em] uppercase bg-white/15 text-white px-2 py-1 mb-2 rounded-sm">
                {category.badge}
              </span>
            ) : null}
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-widest uppercase">
              {category.name}
            </h1>
          </div>
        </div>
      </section>

      {/* Products under category */}
      <section className="py-12 sm:py-16">
        <Container>
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-bold tracking-widest uppercase text-black">
              Products
            </h2>
            <span className="text-xs text-black/60">{items.length} items</span>
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {items.map((p) => (
              <ProductCard
                key={p.slug}
                slug={p.slug}
                name={p.name}
                price={p.price}
                currency={p.currency}
                image={p.images[0]}
                rating={p.rating}
                reviewsCount={p.reviewsCount}
                inStock={p.inStock}
              />
            ))}
          </div>

          {items.length === 0 ? (
            <p className="mt-8 text-sm text-neutral-700">
              No products found in this category.
            </p>
          ) : null}
        </Container>
      </section>
    </main>
  );
}
