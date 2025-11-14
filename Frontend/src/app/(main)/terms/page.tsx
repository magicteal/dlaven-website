import Container from "@/components/Container";
import Link from "next/link";
import RevealOnScroll from "@/components/RevealOnScroll";

export default function TermsPage() {
  return (
    <main className="py-20 sm:py-28">
      <Container>
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold tracking-widest uppercase text-black text-center" data-reveal="slideUp">
              Terms & Conditions
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
