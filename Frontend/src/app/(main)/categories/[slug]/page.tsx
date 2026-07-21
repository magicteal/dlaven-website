import Image from "next/image";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import { API_BASE } from "@/lib/api";

async function fetchProductsForCategory(slug: string) {
  try {
    const res = await fetch(
      `${API_BASE}/api/products?category=${encodeURIComponent(slug)}`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
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
  } catch (e) {
    console.error("[CategoryPage] fetch products error:", e);
    return [];
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let category: {
    slug: string;
    name: string;
    imageSrc?: string;
    imageAlt?: string;
    heroImage?: string;
    badge?: string;
  } | null = null;

  try {
    const catRes = await fetch(
      `${API_BASE}/api/categories/${encodeURIComponent(slug)}`,
      { cache: "no-store" }
    );
    if (catRes.ok) {
      const catData = await catRes.json();
      category = (catData.item || null);
    }
  } catch (e) {
    console.error("[CategoryPage] fetch category error:", e);
  }

  // Fallback category details if backend category not found directly
  if (!category) {
    const displayName = slug.replace(/-/g, " ");
    category = {
      slug,
      name: displayName,
      imageSrc: "/images/fragrance_hero.png",
      imageAlt: displayName,
      badge: "D' LAVÉN COLLECTION",
    };
  }

  const items = await fetchProductsForCategory(slug);
  const bg =
    category.imageSrc || category.heroImage || "/images/fragrance_hero.png";

  return (
    <main className="min-h-screen pt-36 sm:pt-44 lg:pt-48 pb-24" style={{ backgroundColor: "#F6F4E6" }}>
      {/* Category Hero Section */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto mb-16">
        <div className="relative h-[36vh] min-h-[300px] sm:min-h-[380px] w-full overflow-hidden border border-[#431717]/15 shadow-sm">
          <Image
            src={bg}
            alt={category.imageAlt || category.name}
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          {/* Warm Vignette Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(67,23,23,0.55) 0%, rgba(67,23,23,0.4) 60%, rgba(67,23,23,0.65) 100%)",
            }}
          />

          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6">
            <span
              className="inline-block text-[10px] sm:text-xs tracking-[0.35em] uppercase text-[#F6F4E6]/90 mb-3"
            >
              {category.badge || "D' LAVÉN COLLECTION"}
            </span>
            <h1
              className="font-le-grand text-3xl sm:text-5xl md:text-6xl font-normal tracking-[0.2em] uppercase leading-tight text-[#F6F4E6]"
            >
              {category.name}
            </h1>
            <div
              className="h-px w-12 my-4"
              style={{ backgroundColor: "rgba(246,244,230,0.5)" }}
            />
          </div>
        </div>
      </section>

      {/* Category Products Listing */}
      <section>
        <Container>
          <div
            className="flex items-baseline justify-between pb-6 mb-10 border-b"
            style={{ borderColor: "rgba(67,23,23,0.15)" }}
          >
            <div>
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] mb-1" style={{ color: "#6F3D24" }}>
                Curated Selection
              </p>
              <h2
                className="font-le-grand text-2xl sm:text-3xl font-normal tracking-widest uppercase"
                style={{ color: "#431717" }}
              >
                Products
              </h2>
            </div>
            <span className="text-xs uppercase tracking-[0.2em]" style={{ color: "#6F3D24" }}>
              {items.length} {items.length === 1 ? "item" : "items"}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
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

          {items.length === 0 && (
            <div
              className="py-16 px-8 text-center max-w-lg mx-auto rounded-sm mt-8"
              style={{
                backgroundColor: "rgba(255,255,255,0.4)",
                border: "1px solid rgba(67,23,23,0.12)",
              }}
            >
              <h3 className="font-le-grand text-xl uppercase tracking-widest mb-2" style={{ color: "#431717" }}>
                No Products Available
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: "#431717", opacity: 0.7 }}>
                New items are coming soon to this collection. Check back shortly or explore other categories.
              </p>
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}
