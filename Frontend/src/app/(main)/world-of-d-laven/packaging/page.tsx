import Head from "next/head";
import Container from "@/components/Container";
import Image from "next/image";
import Link from "next/link";

export default function PackagingPage() {
  return (
    <>
      <Head>
        <title>Packaging — World of D&apos;LAVÉN</title>
      </Head>

      <main className="min-h-screen bg-white text-black">
        <Container>
          <div className="py-16 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold uppercase">
              Packaging
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-sm text-black/70">
              Discover the art and care behind our signature packaging — where
              heritage meets presentation.
            </p>

            {/* Video placeholder */}
            <div className="mt-12 max-w-4xl mx-auto">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <svg
                  width="96"
                  height="96"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="11"
                    stroke="#111827"
                    strokeWidth="1.5"
                    fill="rgba(17,24,39,0.04)"
                  />
                  <path d="M10 8.5v7l6-3.5-6-3.5z" fill="#111827" />
                </svg>
              </div>
            </div>

            <div className="mt-8 max-w-3xl mx-auto text-sm text-black/70">
              <p>
                Every package is crafted to protect and present our creations —
                using sustainable materials blended with luxurious finishes.
              </p>
            </div>

            {/* Two photos */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="relative h-64 w-full rounded overflow-hidden bg-gray-100">
                <Image
                  src="/images/placeholder1.jpg"
                  alt="Packaging photo 1"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-64 w-full rounded overflow-hidden bg-gray-100">
                <Image
                  src="/images/placeholder2.jpg"
                  alt="Packaging photo 2"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="mt-10">
              <Link
                href="/contact"
                className="inline-block px-8 py-2 border border-black text-xs uppercase tracking-wider hover:bg-black hover:text-white"
              >
                Contact an Advisor
              </Link>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
