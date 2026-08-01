import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import { API_BASE } from "@/lib/api";

export const dynamic = "force-dynamic";

type ProductItem = {
  slug: string;
  name: string;
  price: number;
  images: string[];
  rating?: number;
  reviewsCount?: number;
  inStock?: boolean;
};

const FALLBACK_PRODUCTS: ProductItem[] = [
  {
    slug: "womens-bangles",
    name: "Women's Bangles",
    price: 560,
    images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop"],
    inStock: true,
  },
  {
    slug: "heritage-royal-embroidered-sherwani",
    name: "Heritage Royal Embroidered Coat",
    price: 185000,
    images: ["/images/womenswear/adornments_1.png"],
    inStock: true,
  },
  {
    slug: "heritage-gold-woven-adornment",
    name: "Heritage Gold Filigree Adornment",
    price: 240000,
    images: ["/images/womenswear/adornments_2.jpg"],
    inStock: true,
  },
  {
    slug: "international-architectural-suit",
    name: "International Sculptural Wool Suit",
    price: 145000,
    images: ["/images/mensReady.png"],
    inStock: true,
  },
];

async function fetchProducts(): Promise<ProductItem[]> {
  try {
    const res = await fetch(`${API_BASE}/api/products`, { cache: "no-store" });
    if (!res.ok) return FALLBACK_PRODUCTS;
    const data = await res.json();
    const items = (data.items || []) as ProductItem[];
    if (items.length === 0) return FALLBACK_PRODUCTS;
    return items;
  } catch (err) {
    console.warn("[ProductsPage] Failed to fetch products from API, using catalog fallbacks.", err);
    return FALLBACK_PRODUCTS;
  }
}

export default async function ProductsPage() {
  const products = await fetchProducts();

  return (
    <main className="min-h-screen pt-36 sm:pt-44 lg:pt-48 pb-24" style={{ backgroundColor: "#F6F4E6" }}>
      <Container>
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-xs uppercase tracking-[0.35em] text-[#6F3D24] font-medium mb-2">
            D&apos; LAVÉN CREATIONS
          </p>
          <h1 className="font-le-grand text-4xl sm:text-6xl font-normal tracking-wide uppercase text-[#431717]" data-reveal="slideUp">
            ALL CREATIONS
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-[#431717]/80 max-w-xl mx-auto leading-relaxed">
            Explore our complete catalog of fine jewellery, sartorial attire, and haute parfumerie.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8" data-reveal="slideUp" data-stagger="0.1" data-delay="0.2">
          {products.map((p) => (
            <ProductCard
              key={p.slug}
              slug={p.slug}
              name={p.name}
              price={p.price}
              image={p.images && p.images[0] ? p.images[0] : "/images/placeholder.png"}
              rating={p.rating}
              reviewsCount={p.reviewsCount}
              inStock={p.inStock}
            />
          ))}
        </div>
      </Container>
    </main>
  );
}
