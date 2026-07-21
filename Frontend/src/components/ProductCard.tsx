import Link from "next/link";
import Image from "next/image";
import { shimmerBase64 } from "@/lib/shimmer";
import { fmt } from "@/lib/utils";

type Props = {
  slug: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
  reviewsCount?: number;
  inStock?: boolean;
};

export default function ProductCard({
  slug,
  name,
  price,
  image,
  rating,
  reviewsCount,
  inStock = true,
}: Props) {
  return (
    <Link href={`/products/${slug}`} className="group block">
      <div className="bg-[#F6F4E6] aspect-[4/5] overflow-hidden border border-[#431717]/10 relative transition-all duration-300">
        <Image
          src={image}
          alt={name}
          width={800}
          height={1000}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          placeholder="blur"
          blurDataURL={shimmerBase64(16, 20)}
        />
      </div>
      <div className="mt-4">
        <h3 className="font-le-grand text-base sm:text-lg font-normal tracking-wide text-[#431717] group-hover:underline truncate">
          {name}
        </h3>
        <div className="mt-1.5 flex items-center justify-between text-xs sm:text-sm">
          <span className="font-le-grand text-[#431717] font-normal">{fmt(price)}</span>
          <span className={inStock ? "text-emerald-800 text-[10px] uppercase tracking-widest font-medium" : "text-red-800 text-[10px] uppercase tracking-widest font-medium"}>
            {inStock ? "In stock" : "Sold out"}
          </span>
        </div>
        {typeof rating === "number" && rating > 0 ? (
          <div className="mt-1 text-xs text-[#6F3D24]">
            {rating.toFixed(1)} ★ {reviewsCount ? `(${reviewsCount})` : null}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
