import Container from "@/components/Container";
import RevealOnScroll from "@/components/RevealOnScroll";
import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="py-20 sm:py-28">
      <Container>
        <div className="max-w-3xl mx-auto">
          <RevealOnScroll>
            <h1 className="zoom-reveal text-3xl font-bold tracking-widest uppercase text-black text-center">
              Terms & Conditions
            </h1>
          </RevealOnScroll>
          <RevealOnScroll>
            <p
              className="zoom-reveal mt-4 text-sm uppercase tracking-wider text-black/70 text-center"
              style={{ transitionDelay: "80ms" }}
            >
              Last updated: Oct 31, 2025
            </p>
          </RevealOnScroll>

          <div className="mt-12 space-y-10 text-black/80 leading-relaxed">
            <RevealOnScroll>
              <section className="zoom-reveal">
                <h2 className="text-lg font-semibold tracking-wider uppercase text-black">
                  Acceptance of Terms
                </h2>
                <p className="mt-3 text-sm">
                  By accessing or using our website, you agree to be bound by
                  these Terms and any additional policies referenced here. This
                  content is for demonstration.
                </p>
              </section>
            </RevealOnScroll>

            <RevealOnScroll>
              <section
                className="zoom-reveal"
                style={{ transitionDelay: "80ms" }}
              >
                <h2 className="text-lg font-semibold tracking-wider uppercase text-black">
                  Use of the Site
                </h2>
                <ul className="mt-3 text-sm list-disc pl-5 space-y-2">
                  <li>Don’t misuse the site or engage in unlawful activity.</li>
                  <li>
                    Provide accurate information when creating an account or
                    placing an order.
                  </li>
                  <li>Respect intellectual property and applicable laws.</li>
                </ul>
              </section>
            </RevealOnScroll>

            <RevealOnScroll>
              <section
                className="zoom-reveal"
                style={{ transitionDelay: "140ms" }}
              >
                <h2 className="text-lg font-semibold tracking-wider uppercase text-black">
                  Orders & Payments
                </h2>
                <p className="mt-3 text-sm">
                  All orders are subject to acceptance and availability. Prices,
                  promotions, and availability may change without notice.
                </p>
              </section>
            </RevealOnScroll>

            <RevealOnScroll>
              <section
                className="zoom-reveal"
                style={{ transitionDelay: "200ms" }}
              >
                <h2 className="text-lg font-semibold tracking-wider uppercase text-black">
                  Contact
                </h2>
                <p className="mt-3 text-sm">
                  Questions about these Terms? Contact us via our{" "}
                  <Link href="/contact" className="underline">
                    Contact page
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
