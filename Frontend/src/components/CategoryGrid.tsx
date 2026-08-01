import Link from "next/link";
import Image from "next/image";
export const dynamic = "force-dynamic";
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
      <p className="mt-4 sm:mt-6 text-center text-sm sm:text-base font-medium tracking-wide" style={{ color: "#431717" }}>
        {name}
      </p>
    </Link>
  );
}

/**
 * Main Category Grid Component (Server Component / async)
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
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="text-center max-w-[95%] mx-auto">
        <h2
          className="font-le-grand text-4xl sm:text-5xl md:text-6xl font-normal tracking-wide mb-12 sm:mb-16"
          style={{ color: "#431717" }}
          data-reveal="slideUp"
          data-duration="0.8"
        >
          {title}
        </h2>

        {/* 4 Category Items Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-12" data-reveal="slideUp" data-stagger="0.15" data-delay="0.2">
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
      </div>
    </section>
  );
}
