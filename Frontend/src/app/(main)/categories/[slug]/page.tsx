import Image from "next/image";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import { API_BASE } from "@/lib/api";

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
    images: string[];
    rating?: number;
    reviewsCount?: number;
    inStock?: boolean;
  }>;
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const catRes = await fetch(
    `${API_BASE}/api/categories/${encodeURIComponent(slug)}`,
    { cache: "no-store" }
  );
  if (!catRes.ok) return notFound();
  const catData = await catRes.json();
  const category = (catData.item || null) as {
    slug: string;
    name: string;
    imageSrc?: string;
    imageAlt?: string;
    heroImage?: string;
    badge?: string;
  } | null;
  if (!category) return notFound();

  const items = await fetchProductsForCategory(slug);
  const bg =
    category.imageSrc || category.heroImage || "/images/placeholder.png";

  return (
    <main>
      {/* Hero Section - now with top and side spacing */}
      <section className="relative w-full text-white mt-8 px-4 sm:px-8">
        <div className="relative h-[42vh] min-h-[360px] w-full max-w-[1200px] mx-auto overflow-hidden rounded-none">
          <Image
            src={bg}
            alt={category.imageAlt || ""}
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />

          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6">
            {category.badge ? (
              <span className="inline-block text-[10px] tracking-[0.2em] uppercase  text-white px-2 py-1 mb-2 rounded-sm" data-reveal="fade">
                {category.badge}
              </span>
            ) : null}
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-widest uppercase" data-reveal="scale" data-duration="1" data-delay="0.2">
              {category.name}
            </h1>
          </div>
        </div>
      </section>

      {/* Products under category */}
      <section className="py-12 sm:py-16">
        <Container>
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-bold tracking-widest uppercase text-black" data-reveal="slideUp">
              Products
            </h2>
            <span className="text-xs text-black/60" data-reveal="fade" data-delay="0.15">{items.length} items</span>
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6" data-reveal="slideUp" data-stagger="0.1" data-delay="0.2">
            {items.map((p) => (
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
