import ProductDetailClient from "@/components/ProductDetailClient";
import { API_BASE } from "@/lib/api";
import type { Product as ClientProduct } from "@/types/product";

export const dynamic = "force-dynamic";

type ApiProduct = {
  slug: string;
  name: string;
  description?: string;
  price: number;
  images: string[];
  categorySlug?: string;
  rating?: number;
  reviewsCount?: number;
  inStock?: boolean;
  sizeOptions?: string[];
  details?: string[];
  materialCare?: string[];
};

function formatSlugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function createFallbackProduct(slug: string): ClientProduct {
  // Custom fallback definitions for known showcase items
  const knownFallbacks: Record<string, Partial<ClientProduct>> = {
    // Showcase creations from the DL collection pages (CollectionProductsView).
    // Kept in sync so clicking EXPLORE opens the SAME product that is shown.
    "la-voie-lactee": {
      name: "LA VOIE LACTÉE",
      price: 16000,
      // Product hero uses a near-black backdrop, so lead with the real model/lifestyle
      // photos of the same dress (the transparent cutout is only used on the white
      // collection page). Same product, shown on-model here.
      images: [
        "/images/voie_lactee_full_model.png",
        "/images/voie_lactee_outdoor_selfie.png",
        "/images/voie_lactee_lounge_selfie.png",
        "/images/voie_lactee_resort_shot.png",
      ],
      description:
        "Inspired by the iconic Calcutta promenade where the decorative coexists with the pragmatic. A sequinned drape couture edition from the D'LAVÉN × Stella Élégance atelier.",
      categorySlug: "womens-ready-to-wear",
      sizeOptions: ["XS", "S", "M", "L"],
      details: [
        "Hand-embellished iridescent sequin drape",
        "Signature D'LAVÉN × Stella Élégance atelier piece",
        "Draped silhouette with structured bodice",
        "Includes certificate of authenticity",
      ],
    },
    "royal-heritage-couture": {
      name: "L'ÉDITION COUTURE HERITAGE",
      price: 24500,
      images: [
        "/images/menswear/IMG_9691.PNG",
        "/images/menswear/IMG_9340.PNG",
        "/images/menswear/adornments_main.png",
        "/images/heritage/mens_heritage.jpg",
      ],
      description:
        "Crafted with archival zardozi threadwork and precious hand-loomed silk, embodying sovereign authority.",
      categorySlug: "mens-ready-to-wear",
      sizeOptions: ["S", "M", "L", "XL"],
      details: [
        "Archival zardozi hand threadwork",
        "Precious hand-loomed silk",
        "Tailored by master heritage artisans",
        "Includes certificate of authenticity",
      ],
    },
    "womens-bangles": {
      name: "Women's Bangles",
      price: 560,
      images: [
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=800&auto=format&fit=crop",
      ],
      description:
        "In the Fall Winter 2025 collection, D'LAVÉN continues to feature archival symbols. The Horsebit Hardware recalls the House's equestrian heritage. Crafted in supple leather and defined by light gold-toned hardware.",
      sizeOptions: ["S", "M", "L", "XL"],
      details: [
        "Supple dark brown premium leather",
        "Light gold-toned handcrafted hardware",
        "Signature D'LAVÉN Horsebit detail",
        "Handcrafted in Italy by master artisans",
      ],
      materialCare: [
        "Protect from direct light, heat, and rain.",
        "Clean with a dry soft cloth.",
        "Store in the provided flannel pouch.",
      ],
    },
    "heritage-royal-embroidered-sherwani": {
      name: "Heritage Royal Embroidered Coat",
      price: 185000,
      images: [
        "/images/womenswear/adornments_1.png",
        "/images/womenswear/adornments_2.jpg",
      ],
      description: "Archival hand-embroidery on fine velvet, crafted for royal occasions.",
      sizeOptions: ["S", "M", "L"],
    },
    "heritage-gold-woven-adornment": {
      name: "Heritage Gold Filigree Adornment",
      price: 240000,
      images: [
        "/images/womenswear/adornments_2.jpg",
        "/images/prive_jewellery_cover.png",
      ],
      description: "Hand-bent 22k gold filigree woven with rare gemstones.",
      sizeOptions: ["One Size"],
    },
    "international-architectural-suit": {
      name: "International Sculptural Wool Suit",
      price: 145000,
      images: ["/images/mensReady.png", "/images/hero_bg.png"],
      description: "Modern architectural tailoring in Italian super-150s virgin wool.",
      sizeOptions: ["38R", "40R", "42R", "44R"],
    },
  };

  const override = knownFallbacks[slug] || {};

  return {
    slug,
    name: override.name || formatSlugToTitle(slug),
    price: override.price || 125000,
    images: override.images && override.images.length > 0 ? override.images : ["/images/oneImg.png", "/images/twoImg.png"],
    description:
      override.description ||
      `D'LAVÉN creation — ${formatSlugToTitle(slug)}. Designed under strict heritage craftsmanship protocols with rare materials.`,
    categorySlug: override.categorySlug || "heritage-jewelry",
    rating: 5.0,
    reviewsCount: 12,
    inStock: true,
    sizeOptions: override.sizeOptions || ["S", "M", "L", "XL"],
    details: override.details || [
      "Signature D'LAVÉN craftsmanship",
      "Hand-inspected for luxury standards",
      "Includes certificate of authenticity",
    ],
    materialCare: override.materialCare || [
      "Handle with care.",
      "Store in signature luxury box.",
      "Professional specialist cleaning only.",
    ],
  };
}

function toClientProduct(p: ApiProduct): ClientProduct {
  return {
    slug: p.slug,
    name: p.name,
    price: p.price,
    images: p.images && p.images.length > 0 ? p.images : ["/images/placeholder.png"],
    description: p.description || "",
    categorySlug: p.categorySlug,
    rating: p.rating,
    reviewsCount: p.reviewsCount,
    inStock: p.inStock !== undefined ? p.inStock : true,
    sizeOptions: p.sizeOptions && p.sizeOptions.length > 0 ? p.sizeOptions : ["S", "M", "L"],
    details: p.details && p.details.length > 0 ? p.details : ["Authentic D'LAVÉN product"],
    materialCare: p.materialCare && p.materialCare.length > 0 ? p.materialCare : ["Handle with care"],
  };
}

async function fetchProduct(slug: string): Promise<ApiProduct | null> {
  try {
    const res = await fetch(`${API_BASE}/api/products/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.item as ApiProduct;
  } catch (err) {
    console.warn(`[ProductDetailPage] Backend fetch for slug "${slug}" failed, using fallback.`, err);
    return null;
  }
}

async function fetchRelated(categorySlug: string | undefined, currentSlug: string): Promise<ClientProduct[]> {
  try {
    const url = new URL(`${API_BASE}/api/products`);
    if (categorySlug) url.searchParams.set("category", categorySlug);
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    const items: ApiProduct[] = data.items || [];
    return items.filter((p) => p.slug !== currentSlug).map(toClientProduct);
  } catch {
    return [];
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const apiProduct = await fetchProduct(slug);
  
  // Use API product if found in DB, otherwise generate clean luxury fallback product so product page ALWAYS opens!
  const product = apiProduct ? toClientProduct(apiProduct) : createFallbackProduct(slug);
  const related = await fetchRelated(product.categorySlug, product.slug);

  return (
    <main>
      <ProductDetailClient product={product} related={related} />
    </main>
  );
}
