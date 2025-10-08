import Container from "@/components/Container";
import { Phone, Mail, MessageSquare } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import faqs from "@/data/faqs.json";

// Individual contact method component
function ContactMethod({
  icon,
  title,
  children,
  actionText,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  actionText: string;
  href: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-black">
        {title}
      </h3>
      <div className="mt-4 text-xs text-black/70 space-y-1">{children}</div>
      <a
        href={href}
        className="mt-6 flex items-center justify-center gap-2 text-sm text-black hover:underline"
      >
        {icon}
        <span>{actionText}</span>
      </a>
    </div>
  );
}

export default function ContactPage() {
  return (
    <main className="py-12 sm:py-20">
      <Container>
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold tracking-widest uppercase text-black">
            Contact Us
          </h1>
          <p className="mt-4 text-sm uppercase tracking-wider text-black/70">
            Choose your preferred method of contact and connect with us
          </p>
        </div>

        {/* Contact Methods Grid */}
        <div className="mt-20 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-16 gap-x-8">
            <ContactMethod
              icon={<Phone size={16} />}
              title="Phone"
              href="tel:+18774822430"
              actionText="Call Us +1 (877) 482-2430"
            >
              <p>Monday - Saturday from 9 AM to 11 PM (EST).</p>
              <p>Sunday from 10 AM to 9 PM (EST)</p>
            </ContactMethod>

            <ContactMethod
              icon={<Mail size={16} />}
              title="Email"
              href="mailto:youremail@gmail.com"
              actionText="Write Us"
            >
              <p>Your inquiry will receive a response from a Client Advisor.</p>
            </ContactMethod>

            <div className="md:col-span-2 flex justify-center pt-8">
              <ContactMethod
                icon={<MessageSquare size={16} />}
                title="WhatsApp"
                href="https://wa.me/18774822430"
                actionText="WhatsApp Us"
              >
                <p>Monday - Saturday from 9AM to 8PM (EST)</p>
                <p>Sunday from 10 AM to 7 PM (EST)</p>
              </ContactMethod>
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-center text-xl font-bold tracking-widest uppercase text-black">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full mt-8">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-black/80">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Container>
    </main>
  );
}
