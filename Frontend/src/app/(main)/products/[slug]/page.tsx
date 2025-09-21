
import { notFound } from "next/navigation";
import { getProductBySlug, products } from "@/data/products";
import ProductDetailClient from "@/components/ProductDetailClient";

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) return notFound();

  const related = products.filter((p) => p.slug !== product.slug && p.categorySlug === product.categorySlug);

  return (
    <main>
      <ProductDetailClient product={product} related={related} />
    </main>
  );
}
