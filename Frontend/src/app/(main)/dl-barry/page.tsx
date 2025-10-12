import Container from "@/components/Container";
import Image from "next/image";
import Link from "next/link";

export default function DlBarryPage() {
  return (
    <main>
      <section className="relative w-full flex items-center justify-center text-center text-white h-[40vh] min-h-[280px]">
        <div className="absolute inset-0">
          <Image
            src="/images/dl-service-bg.jpg"
            alt="DL Barry background"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 p-4">
          <h1 className="text-4xl font-bold tracking-widest uppercase">
            DL Barry
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-white/90">
            Bespoke made-to-measure tailoring — a service tailored to precision
            and luxury. Contact our advisors to book a consultation.
          </p>
        </div>
      </section>

      <Container className="py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold">Bespoke Tailoring</h2>
          <p className="mt-4 text-sm text-black/70">
            DL Barry offers personalized fittings and handcrafted garments.
            Please get in touch with our Client Advisors to schedule an
            appointment.
          </p>
          <div className="mt-6">
            <Link
              href="/contact"
              className="inline-block px-6 py-3 border border-black text-sm uppercase tracking-wider hover:bg-black hover:text-white"
            >
              Contact an Advisor
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
