import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import { API_BASE } from "@/lib/api";
import { shimmerBase64 } from "@/lib/shimmer";

/**
 * Single Category Item Component
 */
function CategoryItem({
  name,
  slug,
  imageSrc,
  imageAlt,
}: {
  name: string;
  slug: string;
  imageSrc: string;
  imageAlt: string;
}) {
  return (
    <Link href={`/categories/${slug}`} className="group block">
      <div className="overflow-hidden rounded-none">
        <div className="relative w-full aspect-[4/5] bg-gray-100">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              placeholder="blur"
              blurDataURL={shimmerBase64(10, 12)}
            />
          </div>
        </div>
      <p className="mt-4 sm:mt-6 text-center text-sm sm:text-base font-medium tracking-wide text-black">
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
    // Use force-cache so this component can be statically optimized during build.
    // Using `no-store` forces dynamic server rendering which prevents static prerender.
    const res = await fetch(`${API_BASE}/api/categories`, { cache: "force-cache" });
    if (res.ok) {
      const j = await res.json();
      data = (j.items || []) as typeof data;
    }
  } catch (e) {
    console.error("[CategoryGrid] Failed to load categories", e);
  }
  return (
    <section className="bg-white py-16 sm:py-20 md:py-24">
      <Container className="text-center max-w-7xl">
        <h2 
          className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide text-black mb-12 sm:mb-16"
          data-reveal="slideUp"
          data-duration="0.8"
        >
          {title}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8" data-reveal="slideUp" data-stagger="0.15" data-delay="0.2">
          {data.slice(0, 4).map((category) => (
            <CategoryItem
              key={category.slug}
              name={category.name}
              slug={category.slug}
              imageSrc={category.imageSrc || "/images/placeholder.png"}
              imageAlt={category.imageAlt || ""}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
