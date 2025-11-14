import Container from "@/components/Container";
import Link from "next/link";

export default function RefundPolicyPage() {
  return (
    <main className="py-20 sm:py-28">
      <Container>
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold tracking-widest uppercase text-black text-center" data-reveal="slideUp">
              Refund Policy
            </h1>
            <p
              className="mt-4 text-sm uppercase tracking-wider text-black/70 text-center"
              data-reveal="fade"
              data-delay="0.15"
            >
              Last updated: Oct 31, 2025
            </p>

          <div className="mt-12 space-y-10 text-black/80 leading-relaxed" data-reveal="slideUp" data-stagger="0.1" data-delay="0.2">
            <RevealOnScroll>
              <section className="zoom-reveal">
                <h2 className="text-lg font-semibold tracking-wider uppercase text-black">
                  Eligibility
                </h2>
                <p className="mt-3 text-sm">
                  To be eligible for a return, items must be unused, in their
                  original packaging, and returned within the timeframe stated
                  here. This is placeholder text.
                </p>
              </section>
            </RevealOnScroll>

            <RevealOnScroll>
              <section
                className="zoom-reveal"
                style={{ transitionDelay: "80ms" }}
              >
                <h2 className="text-lg font-semibold tracking-wider uppercase text-black">
                  Refund Process
                </h2>
                <ol className="mt-3 text-sm list-decimal pl-5 space-y-2">
                  <li>Submit a return request with your order details.</li>
                  <li>Ship the item using the provided instructions.</li>
                  <li>
                    Once received and inspected, we’ll notify you regarding
                    approval.
                  </li>
                </ol>
              </section>
            </RevealOnScroll>

            <RevealOnScroll>
              <section
                className="zoom-reveal"
                style={{ transitionDelay: "140ms" }}
              >
                <h2 className="text-lg font-semibold tracking-wider uppercase text-black">
                  Exchanges & Exceptions
                </h2>
                <p className="mt-3 text-sm">
                  Certain items may not be eligible for return or may be
                  exchange-only due to hygiene or customization. Shipping
                  charges are generally non-refundable.
                </p>
              </section>
            </RevealOnScroll>

            <RevealOnScroll>
              <section
                className="zoom-reveal"
                style={{ transitionDelay: "200ms" }}
              >
                <h2 className="text-lg font-semibold tracking-wider uppercase text-black">
                  Need Help?
                </h2>
                <p className="mt-3 text-sm">
                  Reach out via our{" "}
                  <Link href="/contact" className="underline">
                    Contact page
                  </Link>{" "}
                  for assistance with returns or exchanges.
                </p>
              </section>
            </RevealOnScroll>
          </div>
        </div>
      </Container>
    </main>
  );
}
