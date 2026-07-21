"use client";

import { useState } from "react";
import Container from "@/components/Container";
import { Phone, Mail, MessageSquare, ArrowRight, CheckCircle2, Clock, MapPin, Send } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import faqs from "@/data/faqs.json";
import Dash from "@/components/Dash";
import StyledText from "@/components/StyledText";

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFormSubmitted(true);
    }, 1000);
  };

  return (
    <main className="py-24 sm:py-32 min-h-screen" style={{ backgroundColor: "#F6F4E6" }}>
      <Container>
        {/* ── Section 1: Hero Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-20 sm:mb-24">
          <p
            className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.35em] mb-4"
            style={{ color: "#6F3D24" }}
          >
            Client Services
          </p>
          <h1
            className="font-le-grand text-3xl sm:text-5xl md:text-6xl font-normal tracking-widest uppercase leading-tight"
            style={{ color: "#431717" }}
          >
            How To Contact D&apos; Lavén
          </h1>
          <div
            className="h-px w-16 mx-auto my-6"
            style={{ backgroundColor: "rgba(111,61,36,0.3)" }}
          />
          <p className="text-sm sm:text-base leading-relaxed max-w-xl mx-auto" style={{ color: "#431717", opacity: 0.75 }}>
            Our Client Advisors are at your disposal to assist with tailored advice, product inquiries, and personalized assistance.
          </p>
        </div>

        {/* ── Section 2: Contact Channels Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto mb-24">
          {/* Channel 1: Phone */}
          <div
            className="p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
            style={{
              backgroundColor: "rgba(255,255,255,0.4)",
              border: "1px solid rgba(67,23,23,0.12)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-6"
                style={{ backgroundColor: "rgba(67,23,23,0.06)", color: "#431717" }}
              >
                <Phone className="h-5 w-5" />
              </div>
              <h3
                className="font-le-grand text-lg sm:text-xl font-normal tracking-wider uppercase mb-3"
                style={{ color: "#431717" }}
              >
                By Telephone
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed mb-6" style={{ color: "#431717", opacity: 0.7 }}>
                Speak directly with an advisor for immediate guidance regarding orders or bespoke services.
              </p>
              <div className="space-y-1.5 text-xs text-[#431717]/80 pt-4 border-t border-[#431717]/10 mb-8">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 opacity-60 flex-shrink-0" />
                  <span>Mon <Dash /> Sat: 9 AM – 11 PM (EST)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 opacity-60 flex-shrink-0" />
                  <span>Sun: 10 AM – 9 PM (EST)</span>
                </div>
              </div>
            </div>
            <a
              href="tel:+18774822430"
              className="group inline-flex items-center justify-between w-full pt-4 text-xs font-semibold uppercase tracking-[0.18em] transition-colors"
              style={{ color: "#6F3D24", borderTop: "1px solid rgba(111,61,36,0.15)" }}
            >
              <span>+1 (877) 482-2430</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>

          {/* Channel 2: WhatsApp */}
          <div
            className="p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
            style={{
              backgroundColor: "rgba(255,255,255,0.4)",
              border: "1px solid rgba(67,23,23,0.12)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-6"
                style={{ backgroundColor: "rgba(67,23,23,0.06)", color: "#431717" }}
              >
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3
                className="font-le-grand text-lg sm:text-xl font-normal tracking-wider uppercase mb-3"
                style={{ color: "#431717" }}
              >
                Instant Messaging
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed mb-6" style={{ color: "#431717", opacity: 0.7 }}>
                Connect with our client services team via WhatsApp for real-time recommendations and updates.
              </p>
              <div className="space-y-1.5 text-xs text-[#431717]/80 pt-4 border-t border-[#431717]/10 mb-8">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 opacity-60 flex-shrink-0" />
                  <span>Mon <Dash /> Sat: 9 AM – 8 PM (EST)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 opacity-60 flex-shrink-0" />
                  <span>Sun: 10 AM – 7 PM (EST)</span>
                </div>
              </div>
            </div>
            <a
              href="https://wa.me/18774822430"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-between w-full pt-4 text-xs font-semibold uppercase tracking-[0.18em] transition-colors"
              style={{ color: "#6F3D24", borderTop: "1px solid rgba(111,61,36,0.15)" }}
            >
              <span>Chat on WhatsApp</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>

          {/* Channel 3: Email */}
          <div
            className="p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
            style={{
              backgroundColor: "rgba(255,255,255,0.4)",
              border: "1px solid rgba(67,23,23,0.12)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-6"
                style={{ backgroundColor: "rgba(67,23,23,0.06)", color: "#431717" }}
              >
                <Mail className="h-5 w-5" />
              </div>
              <h3
                className="font-le-grand text-lg sm:text-xl font-normal tracking-wider uppercase mb-3"
                style={{ color: "#431717" }}
              >
                By Email
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed mb-6" style={{ color: "#431717", opacity: 0.7 }}>
                Send us a message anytime. A dedicated Client Advisor will respond within 24 hours.
              </p>
              <div className="space-y-1.5 text-xs text-[#431717]/80 pt-4 border-t border-[#431717]/10 mb-8">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 opacity-60 flex-shrink-0" />
                  <span>support@dlaven.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 opacity-60 flex-shrink-0" />
                  <span>Worldwide Client Assistance</span>
                </div>
              </div>
            </div>
            <a
              href="#contact-form"
              className="group inline-flex items-center justify-between w-full pt-4 text-xs font-semibold uppercase tracking-[0.18em] transition-colors"
              style={{ color: "#6F3D24", borderTop: "1px solid rgba(111,61,36,0.15)" }}
            >
              <span>Write To Us</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* ── Section 3: Interactive Inquiry Form ── */}
        <div
          id="contact-form"
          className="max-w-4xl mx-auto mb-28 p-8 sm:p-14 transition-all"
          style={{
            backgroundColor: "rgba(255,255,255,0.55)",
            border: "1px solid rgba(67,23,23,0.12)",
            boxShadow: "0 20px 40px -15px rgba(67,23,23,0.05)",
          }}
        >
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2
              className="font-le-grand text-2xl sm:text-3xl font-normal tracking-widest uppercase mb-3"
              style={{ color: "#431717" }}
            >
              Send An Inquiry
            </h2>
            <p className="text-xs sm:text-sm" style={{ color: "#431717", opacity: 0.7 }}>
              Fill out the form below and our Client Advisory team will review your message.
            </p>
          </div>

          {formSubmitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: "#431717", color: "#F6F4E6" }}>
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="font-le-grand text-2xl uppercase tracking-wider" style={{ color: "#431717" }}>
                Message Sent
              </h3>
              <p className="text-sm max-w-md mx-auto" style={{ color: "#431717", opacity: 0.7 }}>
                Thank you for reaching out to D&apos; Lavén. A Client Advisor will contact you shortly.
              </p>
              <button
                onClick={() => {
                  setFormSubmitted(false);
                  setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
                }}
                className="mt-6 text-xs uppercase tracking-[0.2em] underline underline-offset-4 font-semibold"
                style={{ color: "#6F3D24" }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] mb-2 font-medium" style={{ color: "#6F3D24" }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your Name"
                    className="w-full bg-transparent border-b py-3 text-sm outline-none transition-colors placeholder:opacity-30 focus:border-b-2"
                    style={{ borderColor: "rgba(67,23,23,0.25)", color: "#431717" }}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] mb-2 font-medium" style={{ color: "#6F3D24" }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full bg-transparent border-b py-3 text-sm outline-none transition-colors placeholder:opacity-30 focus:border-b-2"
                    style={{ borderColor: "rgba(67,23,23,0.25)", color: "#431717" }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] mb-2 font-medium" style={{ color: "#6F3D24" }}>
                  Subject / Category *
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-transparent border-b py-3 text-sm outline-none transition-colors appearance-none cursor-pointer"
                  style={{ borderColor: "rgba(67,23,23,0.25)", color: "#431717" }}
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Orders & Shipping">Orders & Shipping</option>
                  <option value="DL Privé & Bespoke">DL Privé & Bespoke</option>
                  <option value="Personalization Services">Personalization Services</option>
                  <option value="Product Information">Product Information</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] mb-2 font-medium" style={{ color: "#6F3D24" }}>
                  Your Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we assist you today?"
                  className="w-full bg-transparent border-b py-3 text-sm outline-none transition-colors placeholder:opacity-30 focus:border-b-2 resize-none"
                  style={{ borderColor: "rgba(67,23,23,0.25)", color: "#431717" }}
                />
              </div>

              <div className="pt-4 flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative inline-flex items-center justify-center gap-3 px-12 py-4 text-xs uppercase tracking-[0.25em] font-medium text-white transition-all duration-300 disabled:opacity-60 overflow-hidden"
                  style={{ backgroundColor: "#431717" }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {loading ? "Sending Message..." : "Submit Inquiry"}
                    {!loading && <Send className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />}
                  </span>
                  <span
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: "#6F3D24" }}
                  />
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ── Section 4: Frequently Asked Questions ── */}
        <div className="max-w-3xl mx-auto pt-8">
          <div className="text-center mb-12">
            <p
              className="text-[10px] font-medium uppercase tracking-[0.3em] mb-3"
              style={{ color: "#6F3D24" }}
            >
              Information & Assistance
            </p>
            <h2
              className="font-le-grand text-2xl sm:text-4xl font-normal tracking-widest uppercase"
              style={{ color: "#431717" }}
            >
              Frequently Asked Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border rounded-sm px-6 py-1 transition-colors"
                style={{
                  borderColor: "rgba(67,23,23,0.15)",
                  backgroundColor: "rgba(255,255,255,0.3)",
                }}
              >
                <AccordionTrigger
                  className="text-sm font-medium text-left hover:no-underline py-5 tracking-wide"
                  style={{ color: "#431717" }}
                >
                  <StyledText>{faq.question}</StyledText>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm pb-5 leading-relaxed" style={{ color: "#431717", opacity: 0.75 }}>
                    <StyledText>{faq.answer}</StyledText>
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Container>
    </main>
  );
}
