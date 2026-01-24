"use client";

import React from "react";
import Link from "next/link";
import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";
import BrandText from "@/components/BrandText";
import Apostrophe from "@/components/Apostrophe";
// No animation for footer logo — static and smaller

export default function Footer() {
  // Footer logo is static (no animation). Size adjusted in JSX below.

  return (
    <footer className="bg-black text-white border-t border-white/10">
      {/* Top grid - 4 columns */}
      <div className="mx-auto max-w-[95%] px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: HELP */}
          <div>
            <p className="text-sm uppercase tracking-wider font-semibold mb-6">
              HELP
            </p>
            <ul className="space-y-3 text-base">
              <li>
                <p className="text-white/80">
                  A Client Advisor is available at{" "}
                  <Link href="tel:18001039988" className="underline hover:no-underline">
                    1800 103 9988
                  </Link>
                  . You can also{" "}
                  <Link href="/contact" className="underline hover:no-underline">
                    chat
                  </Link>{" "}
                  or{" "}
                  <Link href="mailto:contact@dlaven.com" className="underline hover:no-underline">
                    email us
                  </Link>
                  .
                </p>
              </li>
              <li>
                <Link href="/faq" className="hover:underline">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/product-care" className="hover:underline">
                  Product Care
                </Link>
              </li>
              <li>
                <Link href="/stores" className="hover:underline">
                  Stores
                </Link>
              </li>
            </ul>
            <hr className="my-4 border-white/10" />
            <div className="flex items-center gap-4">
              <a href="#" aria-label="Instagram" className="text-white/90 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Facebook" className="text-white/90 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Twitter" className="text-white/90 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" aria-label="YouTube" className="text-white/90 hover:text-white">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2: QUICK LINKS */}
          <div>
            <p className="text-sm uppercase tracking-wider font-semibold mb-6">
              QUICK LINKS
            </p>
            <ul className="space-y-3 text-base">
              <li>
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:underline">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:underline">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: WORLD OF D'LAVÉN (mirror navbar links) */}
          <div>
            <div className="space-y-2 text-base">
              <Link href="/login" className="block hover:underline">
                Sign In
              </Link>
              <Link href="/me" className="block hover:underline">
                My Account
              </Link>
              <Link href="/purchases" className="block hover:underline">
                Purchases
              </Link>
              <Link href="/profile" className="block hover:underline">
                Account Setting
              </Link>
              <Link href="/prive" className="block hover:underline">
                DL Privé
              </Link>
              <Link href="/me#saved" className="block hover:underline">
                Saved Items
              </Link>
            </div>
          </div>

          {/* Column 4: CONNECT */}
          <div>
            <p className="text-sm uppercase tracking-wider font-semibold mb-6">
              CONNECT
            </p>
            <p className="text-base text-white/80 mb-4">
              Sign up for D<Apostrophe /> Lavén emails and receive the latest news from the Maison, including exclusive online pre-launches and new collections.
            </p>
            <p className="text-sm mb-6">
              <Link href="/social" className="underline hover:no-underline">
                Follow Us
              </Link>
            </p>
          </div>
        </div>

        {/* Country selector */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <button className="flex items-center gap-2 text-base hover:underline">
            <span className="text-lg">🇮🇳</span>
            <span>India</span>
          </button>
        </div>

        {/* Manufacturer and Importer details */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-white/70">
          <div>
            <p className="font-semibold mb-2">Full Name and Address of the Manufacturer</p>
            <p>D<Apostrophe /> Lavén Maison SAS</p>
            <p>2 Rue du Pont Neuf</p>
            <p>75034 Paris CEDEX 01</p>
            <p>FRANCE</p>
          </div>
          <div>
            <p className="font-semibold mb-2">Full Name and Address of the Importer</p>
            <p>D<Apostrophe /> Lavén India Retail Private Limited</p>
            <p>901A Ninth Floor, Time Tower, MG Road</p>
            <p>Gurgaon, Haryana - 122002</p>
            <p>INDIA</p>
          </div>
        </div>

        <p className="mt-6 text-sm text-white/70">
          Please refer to the product label for specific country of origin for each product.
        </p>
      </div>

      {/* Bottom brand section with logo */}
      <div className="border-t border-white/10 bg-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Footer bottom links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm mb-6">
            <Link href="/sitemap" className="hover:underline">
              Sitemap
            </Link>
            <Link href="/legal" className="hover:underline">
              Legal & Privacy
            </Link>
            <Link href="/cookies" className="hover:underline">
              Cookies
            </Link>
          </div>

          {/* Centered brand logo */}
          <div className="flex justify-center">
            <div>
              <BrandText className="w-[160px] sm:w-[220px] md:w-[280px]" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
