import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import { categories as dataCategories } from "@/data/categories";

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
      <p className="mt-4 text-center text-sm font-medium tracking-wider uppercase text-black">
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
  // Use the local hard-coded categories from data folder
  const data = dataCategories;
  return (
    <section className="bg-white py-16 sm:py-24">
      <Container className="text-center">
        <h2 className="text-2xl font-bold tracking-widest uppercase text-black">
          {title}
        </h2>

        <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {data.map((category) => (
            <CategoryItem
              key={category.slug}
              name={category.name}
              slug={category.slug}
              imageSrc={category.imageSrc}
              imageAlt={category.imageAlt}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
