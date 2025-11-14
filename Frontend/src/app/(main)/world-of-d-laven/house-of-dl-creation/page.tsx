import Head from "next/head";
import Image from "next/image";
import Container from "@/components/Container";

export default function HouseOfDlCreationPage() {
  return (
    <>
      <Head>
        <title>House of DL Creation — World of D&apos;LAVÉN</title>
      </Head>

      <main className="min-h-screen bg-white text-black">
        {/* Hero with overlay text */}
        <section className="relative h-[60vh] min-h-[320px]">
          <div className="absolute inset-0">
            <Image
              src="/images/hero-house.jpg"
              alt="House hero"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 flex items-center justify-center h-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase text-white tracking-widest" data-reveal="scale" data-duration="1">
              House of DL Creations
            </h1>
          </div>
        </section>

        <Container>
          <div className="py-12">
            {/* First three photos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-reveal="slideUp" data-stagger="0.15">
              <div className="relative h-64 w-full rounded overflow-hidden bg-gray-100">
                <Image
                  src="/images/placeholder1.jpg"
                  alt="photo1"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-64 w-full rounded overflow-hidden bg-gray-100">
                <Image
                  src="/images/placeholder2.jpg"
                  alt="photo2"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-64 w-full rounded overflow-hidden bg-gray-100">
                <Image
                  src="/images/placeholder3.jpg"
                  alt="photo3"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Reveal more on scroll */}
            <div className="mt-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-reveal="slideUp" data-stagger="0.15" data-delay="0.2">
                  <div className="relative h-64 w-full rounded overflow-hidden bg-gray-100">
                    <Image
                      src="/images/placeholder4.jpg"
                      alt="photo4"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-64 w-full rounded overflow-hidden bg-gray-100">
                    <Image
                      src="/images/placeholder5.jpg"
                      alt="photo5"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-64 w-full rounded overflow-hidden bg-gray-100">
                    <Image
                      src="/images/placeholder6.jpg"
                      alt="photo6"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
