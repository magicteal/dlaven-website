import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import { categories as dataCategories } from "@/data/categories";
import { api } from "@/lib/api";
import RevealOnScroll from "@/components/RevealOnScroll";

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
    <RevealOnScroll rootMargin="0px 0px -20% 0px">
      <Link href={`/categories/${slug}`} className="group block">
        <div
          className="zoom-reveal w-full overflow-hidden border border-black/10 shadow-sm"
          style={{ transitionDelay: `${Math.min(index * 80, 400)}ms` }}
        >
          <div className="relative w-full bg-gray-100" style={{ aspectRatio: "3 / 4" }}>
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="50vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
        <p className="mt-4 text-center text-sm font-bold tracking-wider uppercase text-black">
          {name}
        </p>
      </Link>
    </RevealOnScroll>
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
  // Try fetching categories from backend, fall back to local data
  let data = dataCategories;
  try {
    const res = await api.listCategories();
    if (res && Array.isArray(res.items) && res.items.length > 0) {
      data = res.items.map((it: any) => ({
        slug: it.slug,
        name: it.name,
        imageSrc: it.imageSrc || "/images/logos/default-category.jpg",
        imageAlt: it.imageAlt || it.name,
      }));
    }
  } catch (err) {
    // Keep local data as fallback and log the error on the server
    // eslint-disable-next-line no-console
    console.warn("Category fetch failed, using local data:", err);
  }
  return (
    <section className="bg-white my-22 py-16 sm:py-24">
      <Container className="text-center">
        <RevealOnScroll rootMargin="0px 0px -10% 0px">
          <h2 className="zoom-reveal text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-widest uppercase text-black">
            {title}
          </h2>
        </RevealOnScroll>

        <div className="mt-8 sm:mt-12 grid grid-cols-2 gap-8 gap-y-12 items-start max-w-6xl mx-auto">
          {data.map((category, idx) => (
            <CategoryItem
              key={category.slug}
              name={category.name}
              slug={category.slug}
              imageSrc={category.imageSrc}
              imageAlt={category.imageAlt}
              index={idx}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
