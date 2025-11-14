import Container from "@/components/Container";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="py-20 sm:py-28">
      <Container>
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold tracking-widest uppercase text-black text-center" data-reveal="slideUp">
              Privacy Policy
            </h1>
            <p
              className="mt-4 text-sm uppercase tracking-wider text-black/70 text-center"
              data-reveal="fade"
              data-delay="0.15"
            >
              Last updated: Oct 31, 2025
            </p>

          <div className="mt-12 space-y-10 text-black/80 leading-relaxed" data-reveal="slideUp" data-stagger="0.1" data-delay="0.2">
              <section>
                <h2 className="text-lg font-semibold tracking-wider uppercase text-black">
                  Introduction
                </h2>
                <p className="mt-3 text-sm">
                  This Privacy Policy describes how we collect, use, and
                  disclose information when you use our website and services.
                  This is placeholder content for demonstration purposes.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold tracking-wider uppercase text-black">
                  Information We Collect
                </h2>
                <ul className="mt-3 text-sm list-disc pl-5 space-y-2">
                  <li>Contact details (e.g., name, email, phone).</li>
                  <li>Order and payment information.</li>
                  <li>Usage data and cookies for analytics and performance.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-semibold tracking-wider uppercase text-black">
                  How We Use Information
                </h2>
                <p className="mt-3 text-sm">
                  We use your information to provide and improve our services,
                  process orders, communicate with you, and for security,
                  compliance, and analytics.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold tracking-wider uppercase text-black">
                  Your Choices
                </h2>
                <p className="mt-3 text-sm">
                  You can update your preferences or request access/deletion of
                  your data by contacting us. Some features may require certain
                  information to function.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold tracking-wider uppercase text-black">
                  Contact
                </h2>
                <p className="mt-3 text-sm">
                  For any questions about this policy, please reach out via our{" "}
                  <Link href="/contact" className="underline">
                    Contact page
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
