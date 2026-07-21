import Container from "@/components/Container";
import Link from "next/link";
import RevealOnScroll from "@/components/RevealOnScroll";

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen pt-32 sm:pt-36 pb-24" style={{ backgroundColor: "#F6F4E6" }}>
      <Container>
        <div className="max-w-3xl mx-auto">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] mb-2 text-center font-medium" style={{ color: "#6F3D24" }}>
            Client Care & Returns
          </p>
          <h1
            className="font-le-grand text-3xl sm:text-5xl font-normal tracking-widest uppercase text-center"
            style={{ color: "#431717" }}
            data-reveal="slideUp"
          >
            Refund & Exchange Policy
          </h1>
          <div className="h-px w-16 mx-auto my-4" style={{ backgroundColor: "rgba(111,61,36,0.3)" }} />
          <p
            className="text-xs uppercase tracking-widest text-center"
            style={{ color: "#6F3D24" }}
            data-reveal="fade"
            data-delay="0.15"
          >
            Last updated: Oct 31, 2025
          </p>

          <div
            className="mt-12 p-8 sm:p-12 space-y-10 border"
            style={{
              backgroundColor: "rgba(255,255,255,0.55)",
              borderColor: "rgba(67,23,23,0.12)",
              color: "#431717",
            }}
            data-reveal="slideUp"
            data-stagger="0.1"
            data-delay="0.2"
          >
            <RevealOnScroll>
              <section className="zoom-reveal">
                <h2 className="font-le-grand text-lg uppercase tracking-wider font-normal mb-3" style={{ color: "#431717" }}>
                  1. Return Eligibility
                </h2>
                <p className="text-xs sm:text-sm leading-relaxed opacity-80">
                  To be eligible for a return or exchange, items must be unused, in their original condition with all security seals intact, and presented in the original D&apos; Lavén signature orange box packaging within 14 days of delivery.
                </p>
              </section>
            </RevealOnScroll>

            <RevealOnScroll>
              <section className="zoom-reveal pt-6 border-t border-[#431717]/10">
                <h2 className="font-le-grand text-lg uppercase tracking-wider font-normal mb-3" style={{ color: "#431717" }}>
                  2. Complimentary Concierge Returns
                </h2>
                <ol className="text-xs sm:text-sm leading-relaxed space-y-2 opacity-80 list-decimal pl-5">
                  <li>Submit a return request through your account dashboard or contact a Client Advisor.</li>
                  <li>Our courier concierge will collect the package directly from your specified address.</li>
                  <li>Upon quality inspection at our atelier, your refund will be processed to the original payment method.</li>
                </ol>
              </section>
            </RevealOnScroll>

            <RevealOnScroll>
              <section className="zoom-reveal pt-6 border-t border-[#431717]/10">
                <h2 className="font-le-grand text-lg uppercase tracking-wider font-normal mb-3" style={{ color: "#431717" }}>
                  3. Bespoke & Personalized Items
                </h2>
                <p className="text-xs sm:text-sm leading-relaxed opacity-80">
                  Made-to-order creations (DL Barry), engraved jewelry, sealed fragrances, and personalized Privé items are non-refundable to maintain strict hygiene and bespoke authenticity.
                </p>
              </section>
            </RevealOnScroll>

            <RevealOnScroll>
              <section className="zoom-reveal pt-6 border-t border-[#431717]/10">
                <h2 className="font-le-grand text-lg uppercase tracking-wider font-normal mb-3" style={{ color: "#431717" }}>
                  4. Advisory Assistance
                </h2>
                <p className="text-xs sm:text-sm leading-relaxed opacity-80">
                  For personalized assistance with returns or exchanges, please reach out via our{" "}
                  <Link href="/contact" className="underline font-medium hover:opacity-75">
                    Client Advisory page
                  </Link>
                  .
                </p>
              </section>
            </RevealOnScroll>
          </div>
        </div>
      </Container>
    </main>
  );
}
