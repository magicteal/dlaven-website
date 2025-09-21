import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    name: "Heritage Jewelry",
    href: "/heritage-jewelry",
    imageSrc: "/images/heritage.png",
    imageAlt: "A piece of intricate D'LAVÉN heritage jewelry.",
  },
  {
    name: "Fragrances",
    href: "/fragrances",
    imageSrc: "/images/frangrence.png",
    imageAlt: "A luxurious bottle of D'LAVÉN fragrance.",
  },
  {
    name: "Men's Ready-To-Wear",
    href: "/men/ready-to-wear",
    imageSrc: "/images/mensReady.png",
    imageAlt: "A model wearing D'LAVÉN men's ready-to-wear fashion.",
  },
];

// --- Single Category Item Component ---
function CategoryItem({
  name,
  href,
  imageSrc,
  imageAlt,
}: (typeof categories)[0]) {
  return (
    <Link href={href} className="group block text-center">
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
export default function CategoryGrid() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold tracking-widest uppercase text-black">
          Explore The Latest Styles
        </h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
          {categories.map((category) => (
            <CategoryItem key={category.name} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
}
