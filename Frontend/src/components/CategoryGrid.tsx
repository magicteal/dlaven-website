import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import { API_BASE } from "@/lib/api";

/**
 * Single Category Item Component
 */
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

/**
 * Helper to build a safe absolute URL for the categories API.
 * It tries several fallbacks so you won't get an invalid URL when API_BASE is missing.
 */
function buildCategoriesUrl(): string {
  const envBase =
    API_BASE ||
    process.env.API_BASE ||
    process.env.NEXT_PUBLIC_API_BASE ||
    // fallback to localhost for dev if none provided
    `http://localhost:${process.env.PORT || 3000}`;

  try {
    // ensures the result is an absolute URL and joins path correctly
    return new URL("/api/categories", envBase).toString();
  } catch (err) {
    // rethrow with clearer message
    throw new Error(
      `Invalid API base URL. Got: ${String(envBase)} — ${
        (err as Error).message
      }`
    );
  }
}

/**
 * Main Category Grid Component (Server Component / async)
 *
 * - Validates/builds the URL
 * - Catches network or JSON errors and renders a helpful fallback UI
 * - Logs the real error to the server console for debugging
 */
export default async function CategoryGrid({
  title = "Explore The Latest Styles",
}: {
  title?: string;
}) {
  let dataCategories: Array<{
    slug: string;
    name: string;
    imageSrc: string;
    imageAlt: string;
  }> = [];

  const url = (() => {
    try {
      return buildCategoriesUrl();
    } catch (err) {
      // If URL build fails, log and allow component to render the fallback UI.
      // Throwing here would surface the error as a server error — prefer graceful UI.
      // (Still log so you can see the root cause.)
      // eslint-disable-next-line no-console
      console.error("CategoryGrid: failed to construct categories URL:", err);
      return null as unknown as string;
    }
  })();

  if (url) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        // Log details and avoid throwing an unhelpful fetch failed TypeError
        // eslint-disable-next-line no-console
        console.error(
          `CategoryGrid: fetch to ${url} returned non-OK status: ${res.status} ${res.statusText}`
        );
      } else {
        const data = await res.json();
        dataCategories = (data?.items || []) as Array<{
          slug: string;
          name: string;
          imageSrc: string;
          imageAlt: string;
        }>;
      }
    } catch (err) {
      // Network / runtime error (ENOTFOUND, ECONNREFUSED, etc.)
      // Log full error so you can inspect the real cause (DNS, network, invalid URL, etc.)
      // eslint-disable-next-line no-console
      console.error(
        `CategoryGrid: failed to fetch categories from ${url}:`,
        err
      );
    }
  }

  // Render — if categories empty, show a friendly placeholder instead of crashing.
  return (
    <section className="bg-white py-16 sm:py-24">
      <Container className="text-center">
        <h2 className="text-2xl font-bold tracking-widest uppercase text-black">
          {title}
        </h2>

        {dataCategories.length === 0 ? (
          <div className="mt-8 sm:mt-12">
            <p className="text-sm text-gray-500">
              We couldn't load categories right now. Please check your API_BASE
              environment variable and ensure your `/api/categories` endpoint is
              reachable.
            </p>
            {/* small empty grid so layout doesn't jump too much */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-x-8 sm:gap-y-12">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-md overflow-hidden bg-gray-100 aspect-[4/5]"
                />
              ))}
            </div>
          </div>
        ) : (
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
        )}
      </Container>
    </section>
  );
}
