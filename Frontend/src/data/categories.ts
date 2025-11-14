export type Category = {
  slug: string;
  name: string;
  imageSrc: string; // image for cards
  imageAlt: string;
  heroImage?: string; // optional dedicated hero background image
  badge?: string; // small badge text
  description?: string;
};

export const categories: Category[] = [
  {
    slug: "heritage-jewelry",
    name: "Heritage Jewelry",
    imageSrc: "/images/heritage.png",
    imageAlt: "A piece of intricate D'LAVÉN heritage jewelry.",
    heroImage: "/images/heritage.png",
    badge: "Collection",
    description:
      "Explore timeless craftsmanship and iconic designs from our heritage jewelry line.",
  },
  {
    slug: "fragrances",
    name: "Fragrances",
    imageSrc: "/images/frangrence.png",
    imageAlt: "A luxurious bottle of D'LAVÉN fragrance.",
    heroImage: "/images/frangrence.png",
    badge: "Essence",
    description:
      "Signature scents that define presence, crafted with rare and evocative notes.",
  },
  {
    slug: "mens-ready-to-wear",
    name: "Mens Ready To Wear",
    imageSrc: "/images/mensReady.png",
    imageAlt: "A model wearing D'LAVÉN men's ready-to-wear fashion.",
    heroImage: "/images/mensReady.png",
    badge: "Menswear",
    description:
      "Modern silhouettes and refined tailoring for the contemporary wardrobe.",
  },
  {
    slug: "dl-prive",
    name: "DL PRIVE",
    imageSrc: "/images/prive.jpg",
    imageAlt: "DL PRIVE collection image",
    heroImage: "/images/prive.jpg",
    badge: "Prive",
    description: "Exclusive DL PRIVE collection — limited and curated pieces.",
  },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}