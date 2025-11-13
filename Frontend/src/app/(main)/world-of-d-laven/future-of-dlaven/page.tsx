import Head from "next/head";
import Image from "next/image";
import Container from "@/components/Container";
import RevealOnScroll from "@/components/RevealOnScroll";
import StyledText from "@/components/StyledText";

export default function FutureOfDlavenPage() {
  return (
    <>
      <Head>
        <title>Future of D&apos;LAVÉN — World of D&apos;LAVÉN</title>
      </Head>

      <main className="min-h-screen bg-white text-black">
        <Container>
          <div className="py-16">
            <h1 className="text-3xl sm:text-4xl font-bold uppercase text-center">
              Future of D&apos;LAVÉN
            </h1>

            {/* Two images side by side */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative h-64 w-full rounded overflow-hidden bg-white">
                <Image
                  src="/images/placeholder1.jpg"
                  alt="Future 1"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-64 w-full rounded overflow-hidden bg-white">
                <Image
                  src="/images/placeholder2.jpg"
                  alt="Future 2"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="mt-8 max-w-3xl mx-auto text-center text-sm text-black/70">
              <p>
                <StyledText>
                  {"A forward look at D'LAVÉN — how we are combining heritage and innovation to shape the future of craftsmanship, service and design."}
                </StyledText>
              </p>
            </div>

            {/* Reveal on scroll section */}
            <div className="mt-28">
              <RevealOnScroll>
                <div className="max-w-3xl mx-auto text-center px-4">
                  <h2 className="text-2xl font-bold uppercase tracking-widest">
                    The Next Chapter
                  </h2>
                  <div className="mt-6 relative h-80 w-full rounded overflow-hidden bg-gray-100">
                    <Image
                      src="/images/placeholder-square.jpg"
                      alt="The next chapter"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="mt-6 text-sm text-black/70">
                    <StyledText>
                      {"We are exploring new materials and techniques to complement our time-honoured practices. Each piece is conceived with longevity in mind — created to become the heirlooms of tomorrow."}
                    </StyledText>
                  </p>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
