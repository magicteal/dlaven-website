export type Product = {
  slug: string;
  name: string;
  price: number;
  currency: string;
  image: string; // main image for card/listing
  images?: string[]; // gallery for detail page
  description: string;
  categorySlug?: string;
  rating?: number; // 0-5
  reviewsCount?: number;
  inStock?: boolean;
};

export const products: Product[] = [
  {
    slug: "heritage-diamond-necklace",
    name: "Heritage Diamond Necklace",
    price: 4999,
    currency: "INR",
    image: "/images/products/diamond-necklace.jpg",
    images: [
      "/images/products/diamond-necklace.jpg",
      "/images/products/diamond-necklace-alt1.jpg",
      "/images/products/diamond-necklace-alt2.jpg",
    ],
    description:
      "An exquisite necklace featuring hand-set diamonds in a timeless design.",
    categorySlug: "heritage-jewelry",
    rating: 4.7,
    reviewsCount: 128,
    inStock: true,
  },
  {
    slug: "vintage-emerald-earrings",
    name: "Vintage Emerald Earrings",
    price: 3299,
    currency: "USD",
    image: "/images/products/emerald-earrings.jpg",
    images: [
      "/images/products/emerald-earrings.jpg",
      "/images/products/emerald-earrings-alt1.jpg",
    ],
    description:
      "Brilliant emerald-cut stones set in classic prong settings for timeless allure.",
    categorySlug: "heritage-jewelry",
    rating: 4.8,
    reviewsCount: 64,
    inStock: true,
  },
  {
    slug: "golden-cuff-bracelet",
    name: "Golden Cuff Bracelet",
    price: 1199,
    currency: "USD",
    image: "/images/products/golden-cuff.jpg",
    images: [
      "/images/products/golden-cuff.jpg",
    ],
    description:
      "Sculptural gold-tone cuff bracelet with understated elegance.",
    categorySlug: "heritage-jewelry",
    rating: 4.3,
    reviewsCount: 22,
    inStock: true,
  },
  {
    slug: "oud-royale-eau-de-parfum",
    name: "Oud Royale Eau de Parfum",
    price: 249,
    currency: "USD",
    image: "/images/products/oud-royale.jpg",
    images: [
      "/images/products/oud-royale.jpg",
      "/images/products/oud-royale-alt1.jpg",
    ],
    description:
      "A rich, long-lasting fragrance blending oud wood with amber and spice.",
    categorySlug: "fragrances",
    rating: 4.5,
    reviewsCount: 312,
    inStock: true,
  },
  {
    slug: "amber-noir-parfum",
    name: "Amber Noir Parfum",
    price: 289,
    currency: "USD",
    image: "/images/products/amber-noir.jpg",
    images: [
      "/images/products/amber-noir.jpg",
    ],
    description:
      "Velvety amber wrapped in patchouli and tonka for a sensual signature.",
    categorySlug: "fragrances",
    rating: 4.4,
    reviewsCount: 204,
    inStock: true,
  },
  {
    slug: "citrus-vetiver-edt",
    name: "Citrus Vetiver EDT",
    price: 179,
    currency: "USD",
    image: "/images/products/citrus-vetiver.jpg",
    images: [
      "/images/products/citrus-vetiver.jpg",
    ],
    description:
      "Crisp citrus top notes over a clean vetiver base for daily freshness.",
    categorySlug: "fragrances",
    rating: 4.2,
    reviewsCount: 98,
    inStock: true,
  },
  {
    slug: "tailored-wool-blazer",
    name: "Tailored Wool Blazer",
    price: 899,
    currency: "USD",
    image: "/images/products/wool-blazer.jpg",
    images: [
      "/images/products/wool-blazer.jpg",
      "/images/products/wool-blazer-alt1.jpg",
    ],
    description:
      "A refined wool blazer with modern lines and impeccable construction.",
    categorySlug: "mens-ready-to-wear",
    rating: 4.6,
    reviewsCount: 76,
    inStock: false,
  },
  {
    slug: "cashmere-crewneck",
    name: "Cashmere Crewneck",
    price: 599,
    currency: "USD",
    image: "/images/products/cashmere-crewneck.jpg",
    images: [
      "/images/products/cashmere-crewneck.jpg",
    ],
    description:
      "Ultra-soft pure cashmere knit with a refined, versatile fit.",
    categorySlug: "mens-ready-to-wear",
    rating: 4.7,
    reviewsCount: 142,
    inStock: true,
  },
  {
    slug: "leather-loafers",
    name: "Leather Loafers",
    price: 749,
    currency: "USD",
    image: "/images/products/leather-loafers.jpg",
    images: [
      "/images/products/leather-loafers.jpg",
    ],
    description:
      "Handcrafted calfskin loafers with a cushioned insole and leather sole.",
    categorySlug: "mens-ready-to-wear",
    rating: 4.5,
    reviewsCount: 58,
    inStock: true,
  },
];

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}