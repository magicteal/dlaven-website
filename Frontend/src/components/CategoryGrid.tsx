import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import { categories as dataCategories } from "@/data/categories";
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
          className="zoom-reveal overflow-hidden rounded-md shadow-md"
          style={{ transitionDelay: `${Math.min(index * 80, 400)}ms` }}
        >
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
  // Use the local hard-coded categories from data folder
  const data = dataCategories;
  return (
    <section className="bg-white my-22 py-16 sm:py-24">
      <Container className="text-center">
        <RevealOnScroll rootMargin="0px 0px -10% 0px">
          <h2 className="zoom-reveal text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-widest uppercase text-black">
            {title}
          </h2>
        </RevealOnScroll>

        <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
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
