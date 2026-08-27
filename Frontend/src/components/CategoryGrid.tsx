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
      <p className="mt-4 sm:mt-6 text-center text-sm sm:text-base font-medium tracking-wide" style={{ color: "#F6F4E6" }}>
        {name}
      </p>
    </Link>
  );
}

const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  prive: "/images/dlprive_1.jpg",
  "dl-prive": "/images/dlprive_1.jpg",
  fragrances: "/images/frangrence.png",
  "heritage-jewelry": "/images/heritage.png",
  "mens-ready-to-wear": "/images/mensReady.png",
  "womens-ready-to-wear": "/images/couture_sequin_dress.png",
  "womens-adornments": "/images/womenswear/adornments_1.png",
  "mens-adornments": "/images/menswear/adornments_main.png",
};

const FALLBACK_CATEGORIES = [
  {
    name: "DL PRIVE",
    slug: "dl-prive",
    imageSrc: "/images/dlprive_1.jpg",
    imageAlt: "DL PRIVE Haute Couture & High Jewelry",
  },
  {
    name: "Fragrances",
    slug: "fragrances",
    imageSrc: "/images/frangrence.png",
    imageAlt: "D' LAVÉN Artisanal Fragrance & Haute Parfumerie",
  },
  {
    name: "Heritage Jewelry",
    slug: "heritage-jewelry",
    imageSrc: "/images/heritage.png",
    imageAlt: "D' LAVÉN Heritage Jewelry Collection",
  },
  {
    name: "Mens Ready To Wear",
    slug: "mens-ready-to-wear",
    imageSrc: "/images/mensReady.png",
    imageAlt: "D' LAVÉN Mens Ready To Wear & Tailoring",
  },
];

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

  // Use fallback categories if API data is empty
  const displayCategories = data.length >= 4 ? data.slice(0, 4) : FALLBACK_CATEGORIES;

  return (
    <section
      className="py-14 sm:py-18 md:py-24 px-4 md:px-8 w-full"
      style={{ backgroundColor: "#6F3D24" }}
      data-reveal="slideUp"
      data-duration="0.9"
    >
      <div className="text-center max-w-[95%] mx-auto">
        <h2
          className="font-le-grand text-4xl sm:text-5xl md:text-6xl font-normal tracking-wide mb-12 sm:mb-16"
          style={{ color: "#F6F4E6" }}
        >
          {title}
        </h2>

        {/* 4 Category Items Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          {displayCategories.map((category) => {
            const resolvedImage =
              category.imageSrc &&
              !category.imageSrc.includes("Screenshot_2025") &&
              !category.imageSrc.includes("nappy-dcBO4nt4MRE")
                ? category.imageSrc
                : DEFAULT_CATEGORY_IMAGES[category.slug] || "/images/placeholder.png";

            return (
              <CategoryItem
                key={category.slug}
                name={category.name}
                slug={category.slug === "prive" ? "dl-prive" : category.slug}
                imageSrc={resolvedImage}
                imageAlt={category.imageAlt || category.name}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
