"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";
import { useAuth } from "@/components/providers/AuthProvider";

export default function MenuDrawer({ trigger }: { trigger: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      {/* Removed padding from SheetContent to handle scroll layout better */}
      <SheetContent
        side="right"
        className="w-[360px] sm:w-[400px] flex flex-col p-0"
      >
        {/* Header with Close Button */}
        <div className="flex items-center justify-end p-4 border-b border-black/10">
          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close menu"
              className="h-10 w-10 text-2xl"
            >
              ×
            </Button>
          </SheetClose>
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto">
          <nav className="flex flex-col h-full text-left text-base p-6">
            {/* Main Links */}
            <div className="space-y-4">
              <Link href="/" className="block hover:underline">
                Home
              </Link>
              <Link href="/men" className="block hover:underline">
                Men
              </Link>
              <Link
                href="/heritage-jewellery"
                className="block hover:underline"
              >
                Heritage Jewellery
              </Link>
              <Link href="/fragrances" className="block hover:underline">
                Fragrances
              </Link>
              <Link href="/services" className="block hover:underline">
                DL Services
              </Link>
              <Link href="/destinations" className="block hover:underline">
                DL Destinations
              </Link>
              <Link href="/products" className="block hover:underline">
                Shop
              </Link>
              <Link href="/about" className="block hover:underline">
                About Us
              </Link>
              <Link href="/contact" className="block hover:underline">
                Contact Us
              </Link>
            </div>

            {/* Secondary Links */}
            <div className="mt-8 space-y-4">
              <Link href="/world-of-d-laven" className="block hover:underline">
                World of D'LAVÉN
              </Link>
              <Link href="/gifts" className="block hover:underline">
                Gifts
              </Link>
              <Link href="/store-locator" className="block hover:underline">
                Store Locator
              </Link>
            </div>

            {/* Spacer to push bottom content down */}
            <div className="flex-grow"></div>

            {/* Bottom Links */}
            <div className="space-y-4 border-t border-black/10 pt-6 mt-8 text-sm">
              {user ? (
                <Link href="/me" className="block underline hover:no-underline">
                  My Orders
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="block underline hover:no-underline"
                >
                  Sign In
                </Link>
              )}
              <Link
                href="/contact"
                className="block underline hover:no-underline"
              >
                Contact Us
              </Link>
              <a
                href="tel:+18774822430"
                className="block hover:underline"
                aria-label="Call +1 877 482 2430"
              >
                +1 8774822430
              </a>
            </div>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
