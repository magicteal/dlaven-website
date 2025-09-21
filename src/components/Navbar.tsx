"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import MenuDrawer from "@/components/MenuDrawer";
import { ShoppingBag, User, Search, Menu, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Atoms ---
function IconButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("rounded-none", className)}
      {...props}
    >
      {children}
    </Button>
  );
}

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

// --- Molecules ---
function ContactUs() {
  return (
    <Link href="/contact" className="flex items-center gap-2 text-sm">
      <Plus className="h-4 w-4" />
      <span>Contact Us</span>
    </Link>
  );
}

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

// --- Organism: Navbar ---
export default function Navbar() {
  return (
    // This is the key change: fixed, top-0, z-50, w-full, and background styles
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/90 backdrop-blur-md shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid h-20 grid-cols-3 items-center">
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
