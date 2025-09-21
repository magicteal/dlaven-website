import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import { categories as dataCategories } from "@/data/categories";

// --- Single Category Item Component ---
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
    <Link href={`/categories/${slug}`} className="group block text-center">
      <div className="overflow-hidden aspect-[4/5] bg-gray-100">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={800}
          height={1000}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <p className="mt-4 text-sm font-medium tracking-wider uppercase text-black">
        {name}
      </p>
    </Link>
  );
}

// --- Main Category Grid Component ---
export default function CategoryGrid({ title = "Explore The Latest Styles" }: { title?: string }) {
  return (
    <section className="bg-white py-16 sm:py-24">
      <Container className="text-center">
        <h2 className="text-2xl font-bold tracking-widest uppercase text-black">{title}</h2>
        <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-x-8 sm:gap-y-12">
          {dataCategories.map((category) => (
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
