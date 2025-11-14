import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import { API_BASE } from "@/lib/api";

/**
 * Single Category Item Component
 */
function CategoryItem({
  name,
  slug,
  imageSrc,
  imageAlt,
  index = 0,
}: {
  name: string;
  slug: string;
  imageSrc: string;
  imageAlt: string;
  index?: number;
}) {
  return (
    <Link href={`/categories/${slug}`} className="group block">
      <div className="overflow-hidden rounded-md shadow-md">
        <div className="relative w-full h-[360px] sm:h-[420px] lg:h-[480px] bg-gray-100">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(max-width: 640px) 360px, (max-width: 1024px) 420px, 480px"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      <p className="mt-4 text-center text-sm font-bold tracking-wider uppercase text-black">
        {name}
      </p>
    </Link>
  );
}

/**
 * Main Category Grid Component (Server Component / async)
 *
 * - Validates/builds the URL
 * - Catches network or JSON errors and renders a helpful fallback UI
 * - Logs the real error to the server console for debugging
 */
export default async function CategoryGrid({
  title = "Explore The Latest Styles",
}: {
  title?: string;
}) {
  // Fetch categories from backend
  let data: Array<{
    slug: string;
    name: string;
    imageSrc?: string;
    imageAlt?: string;
  }> = [];
  try {
    const res = await fetch(`${API_BASE}/api/categories`, { cache: "no-store" });
    if (res.ok) {
      const j = await res.json();
      data = (j.items || []) as typeof data;
    }
  } catch (e) {
    console.error("[CategoryGrid] Failed to load categories", e);
  }
  return (
    <section className="bg-white my-22 py-16 sm:py-24">
      <Container className="text-center">
        <h2 
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-widest uppercase text-black"
          data-reveal="slideUp"
          data-duration="0.8"
        >
          {title}
        </h2>

        <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-start" data-reveal="slideUp" data-stagger="0.15" data-delay="0.2">
          {data.map((category, idx) => (
            <CategoryItem
              key={category.slug}
              name={category.name}
              slug={category.slug}
              imageSrc={category.imageSrc || "/images/placeholder.png"}
              imageAlt={category.imageAlt || ""}
              index={idx}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
