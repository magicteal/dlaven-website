import Container from "@/components/Container";
import Link from "next/link";
import RevealOnScroll from "@/components/RevealOnScroll";

export default function UniqueDesign() {
  return (
    <section className="bg-white py-20 sm:py-28 text-center">
      <Container>
        <RevealOnScroll>
          <h2 className="zoom-reveal text-3xl sm:text-4xl md:text-5xl font-bold tracking-widest uppercase">
            Your Unique DL Design
          </h2>
        </RevealOnScroll>
        <RevealOnScroll>
          <p
            className="zoom-reveal mt-6 max-w-3xl mx-auto text-sm text-black/70"
            style={{ transitionDelay: "100ms" }}
          >
            To personalize your DL pieces, connect directly with our concierge.
            Our team will assist you in creating your unique DL design.
          </p>
        </RevealOnScroll>
        <RevealOnScroll>
          <Link
            href="/contact"
            className="zoom-reveal mt-8 inline-block px-8 py-3 border border-black text-xs uppercase tracking-wider hover:bg-black hover:text-white"
            style={{ transitionDelay: "180ms" }}
          >
            Message a Concierge
          </Link>
        </RevealOnScroll>
      </Container>
    </section>
  );
}
