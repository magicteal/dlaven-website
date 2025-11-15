import Link from "next/link";
import Image from "next/image";
import { shimmerBase64 } from "@/lib/shimmer";

type Props = {
  slug: string;
  name: string;
  price: number;
  currency?: string;
  image: string;
  rating?: number;
  reviewsCount?: number;
  inStock?: boolean;
};

function formatPrice(value: number, currency = "USD") {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `$${value}`;
  }
}

export default function ProductCard({
  slug,
  name,
  price,
  currency = "USD",
  image,
  rating,
  reviewsCount,
  inStock = true,
}: Props) {
  return (
    <Link href={`/products/${slug}`} className="group block">
      <div className="bg-gray-100 aspect-[4/5] overflow-hidden">
        <Image
          src={image}
          alt={name}
          width={800}
          height={1000}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          placeholder="blur"
          blurDataURL={shimmerBase64(16, 20)}
        />
      </div>
      <div className="mt-3">
        <h3 className="text-sm font-medium text-black">{name}</h3>
        <div className="mt-1 flex items-center justify-between text-sm">
          <span className="text-black/80">{formatPrice(price, currency)}</span>
          <span className={inStock ? "text-emerald-600" : "text-red-600"}>
            {inStock ? "In stock" : "Sold out"}
          </span>
        </div>
        {typeof rating === "number" ? (
          <div className="mt-1 text-xs text-black/60">
            {rating.toFixed(1)} ★ {reviewsCount ? `(${reviewsCount})` : null}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
