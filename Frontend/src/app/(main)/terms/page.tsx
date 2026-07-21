import Container from "@/components/Container";
import Link from "next/link";
import RevealOnScroll from "@/components/RevealOnScroll";

export default function TermsPage() {
  return (
    <main className="min-h-screen pt-32 sm:pt-36 pb-24" style={{ backgroundColor: "#F6F4E6" }}>
      <Container>
        <div className="max-w-3xl mx-auto">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] mb-2 text-center font-medium" style={{ color: "#6F3D24" }}>
            Legal Framework & Client Standards
          </p>
          <h1
            className="font-le-grand text-3xl sm:text-5xl font-normal tracking-widest uppercase text-center"
            style={{ color: "#431717" }}
            data-reveal="slideUp"
          >
            Terms & Conditions
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
                  1. Acceptance of Terms
                </h2>
                <p className="text-xs sm:text-sm leading-relaxed opacity-80">
                  By accessing or purchasing from the House of D&apos; Lavén, you agree to adhere to these Terms & Conditions and all related advisory guidelines governing our luxury creations.
                </p>
              </section>
            </RevealOnScroll>

            <RevealOnScroll>
              <section className="zoom-reveal pt-6 border-t border-[#431717]/10">
                <h2 className="font-le-grand text-lg uppercase tracking-wider font-normal mb-3" style={{ color: "#431717" }}>
                  2. Use of the Salon & Boutique
                </h2>
                <ul className="text-xs sm:text-sm leading-relaxed space-y-2 opacity-80 list-disc pl-5">
                  <li>Respect all intellectual property, archival designs, and trademarks of D&apos; Lavén.</li>
                  <li>Ensure accurate client advisory information when creating an account or placing orders.</li>
                  <li>Commercial resale or unauthorized reproduction of Privé creations is strictly prohibited.</li>
                </ul>
              </section>
            </RevealOnScroll>

            <RevealOnScroll>
              <section className="zoom-reveal pt-6 border-t border-[#431717]/10">
                <h2 className="font-le-grand text-lg uppercase tracking-wider font-normal mb-3" style={{ color: "#431717" }}>
                  3. Orders & Bespoke Authenticity
                </h2>
                <p className="text-xs sm:text-sm leading-relaxed opacity-80">
                  All orders are subject to availability and bespoke verification. D&apos; Lavén reserves the right to decline or limit orders to preserve product rarity and authentic craftsmanship standards.
                </p>
              </section>
            </RevealOnScroll>

            <RevealOnScroll>
              <section className="zoom-reveal pt-6 border-t border-[#431717]/10">
                <h2 className="font-le-grand text-lg uppercase tracking-wider font-normal mb-3" style={{ color: "#431717" }}>
                  4. Client Inquiries
                </h2>
                <p className="text-xs sm:text-sm leading-relaxed opacity-80">
                  Should you have any questions regarding these Terms, please contact our Client Advisors via the{" "}
                  <Link href="/contact" className="underline font-medium hover:opacity-75">
                    Contact Advisory page
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
