"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import MenuDrawer from "@/components/MenuDrawer";
import { ShoppingBag, User, Search, Menu, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

// Atomic pattern (in-file): atoms -> molecules -> organism

// Atom: IconButton (ghost)
function IconButton({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) {
  return (
    <Button variant="ghost" size="icon" className={cn("rounded-none", className)} {...props}>
      {children}
    </Button>
  );
}

// Atom: Brand mark (DL monogram)
function Brand() {
  return (
    <Link href="/" className="select-none leading-none inline-block">
      <Image
        src="/logos/logoBlack.png"
        alt="D’ LAVÉN"
        width={32}
        height={32}
        priority
        className="h-8 w-auto"
      />
    </Link>
  );
}

// Molecule: Left action "+ Contact Us"
function ContactUs() {
  return (
    <Link href="/contact" className="flex items-center gap-2 text-sm">
      <Plus className="h-4 w-4" />
      <span>Contact Us</span>
    </Link>
  );
}

// Molecule: Right controls (bag, user, search, menu)
function RightControls() {
  return (
    <div className="flex items-center gap-3">
      <IconButton aria-label="Cart">
        <ShoppingBag className="h-5 w-5" />
      </IconButton>
      <IconButton aria-label="Account">
        <User className="h-5 w-5" />
      </IconButton>
      <IconButton aria-label="Search">
        <Search className="h-5 w-5" />
      </IconButton>
      <MenuDrawer
        trigger={
          <div className="flex items-center gap-2 cursor-pointer select-none">
            <IconButton aria-label="Menu">
              <Menu className="h-5 w-5" />
            </IconButton>
            <button className="text-sm">MENU</button>
          </div>
        }
      />
    </div>
  );
}

// Organism: Navbar
export default function Navbar() {
  return (
    <header className="w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 items-center py-4">
          <div className="justify-self-start">
            <ContactUs />
          </div>

          <div className="justify-self-center">
            <Brand />
          </div>

          <div className="justify-self-end">
            <RightControls />
          </div>
        </div>
      </div>
    </header>
  );
}
