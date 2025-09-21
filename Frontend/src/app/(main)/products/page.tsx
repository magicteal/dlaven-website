import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export default function ProductsPage() {
  return (
    <main className="py-12 sm:py-20">
      <Container>
        <h1 className="text-2xl font-bold tracking-widest uppercase text-black">Products</h1>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p) => (
            <ProductCard
              key={p.slug}
              slug={p.slug}
              name={p.name}
              price={p.price}
              currency={p.currency}
              image={p.images[0]}
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
