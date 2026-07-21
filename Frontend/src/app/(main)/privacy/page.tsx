import Container from "@/components/Container";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen pt-32 sm:pt-36 pb-24" style={{ backgroundColor: "#F6F4E6" }}>
      <Container>
        <div className="max-w-3xl mx-auto">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] mb-2 text-center font-medium" style={{ color: "#6F3D24" }}>
            Client Protection & Transparency
          </p>
          <h1
            className="font-le-grand text-3xl sm:text-5xl font-normal tracking-widest uppercase text-center"
            style={{ color: "#431717" }}
            data-reveal="slideUp"
          >
            Privacy Policy
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
            <section>
              <h2 className="font-le-grand text-lg uppercase tracking-wider font-normal mb-3" style={{ color: "#431717" }}>
                1. Introduction
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed opacity-80">
                This Privacy Policy describes how D&apos; Lavén collects, uses, and safeguards information when you visit our site or use our client services. We treat your personal details with the utmost confidentiality.
              </p>
            </section>

            <section className="pt-6 border-t border-[#431717]/10">
              <h2 className="font-le-grand text-lg uppercase tracking-wider font-normal mb-3" style={{ color: "#431717" }}>
                2. Information We Collect
              </h2>
              <ul className="text-xs sm:text-sm leading-relaxed space-y-2 opacity-80 list-disc pl-5">
                <li>Client advisory details (e.g. name, contact email, telephone, delivery address).</li>
                <li>Secure order details and transaction reference records.</li>
                <li>Encrypted authentication credentials and preference choices.</li>
              </ul>
            </section>

            <section className="pt-6 border-t border-[#431717]/10">
              <h2 className="font-le-grand text-lg uppercase tracking-wider font-normal mb-3" style={{ color: "#431717" }}>
                3. How We Use Information
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed opacity-80">
                We utilize your information solely to fulfill orders, facilitate private consultations, communicate order status updates, and provide personalized luxury experiences.
              </p>
            </section>

            <section className="pt-6 border-t border-[#431717]/10">
              <h2 className="font-le-grand text-lg uppercase tracking-wider font-normal mb-3" style={{ color: "#431717" }}>
                4. Your Rights & Contacts
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed opacity-80">
                You may request access to, correction of, or deletion of your personal advisory profile at any time by reaching out via our{" "}
                <Link href="/contact" className="underline font-medium hover:opacity-75">
                  Contact Advisory page
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </Container>
    </main>
  );
}
