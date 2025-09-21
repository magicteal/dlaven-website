"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetClose } from "@/components/ui/sheet";

// Molecule/Organism: MenuDrawer (encapsulates sheet)
export default function MenuDrawer({ trigger }: { trigger: React.ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="right" className="w-[360px]">
        <div className="flex items-center justify-end">
          <SheetClose asChild>
            <Button variant="ghost" size="icon" aria-label="Close menu">×</Button>
          </SheetClose>
        </div>
        <nav className="mt-2 grid gap-3 text-sm">
          <Link href="/" className="hover:opacity-80">Home</Link>
          <Link href="/heritage-jewellery" className="hover:opacity-80">Heritage Jewellery</Link>
          <Link href="/men" className="hover:opacity-80">Men</Link>
          <Link href="/shop" className="hover:opacity-80">Shop</Link>
          <Link href="/contact" className="hover:opacity-80">Contact Us</Link>
          <Link href="/about" className="hover:opacity-80">About Us</Link>
          <Link href="/fragrances" className="hover:opacity-80">Fragrances</Link>
          <Link href="/services" className="hover:opacity-80">DL Services</Link>
          <Link href="/destinations" className="hover:opacity-80">DL Destinations</Link>
          <Link href="/gifts" className="hover:opacity-80">Gifts</Link>
          <Link href="/world-of-d-laven" className="hover:opacity-80">World of D&apos; LAVÉN</Link>
          <Link href="/store-locator" className="hover:opacity-80">Store Locator</Link>
          <Link href="/signin" className="hover:opacity-80">Sign In</Link>
          <Link href="/orders" className="hover:opacity-80">My Orders</Link>
          <Link href="/contact" className="hover:opacity-80">Contact Us</Link>
          <a href="tel:+18774822430" className="hover:opacity-80">+1 8774822430</a>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
