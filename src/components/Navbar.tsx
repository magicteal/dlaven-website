"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import MenuDrawer from "@/components/MenuDrawer";
import { ShoppingBag, User, Search, Menu, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import Container from "@/components/Container";

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
    <>
      <IconButton aria-label="Cart">
        <ShoppingBag className="h-5 w-5" />
      </IconButton>
      <IconButton aria-label="Account" className="hidden sm:inline-flex">
        <User className="h-5 w-5" />
      </IconButton>
      <IconButton aria-label="Search" className="hidden sm:inline-flex">
        <Search className="h-5 w-5" />
      </IconButton>
      <MenuDrawer
        trigger={
          <Button
            variant="ghost"
            className="rounded-none h-9 px-2 sm:px-3 flex items-center gap-2 select-none"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
            <span className="hidden sm:inline text-sm whitespace-nowrap">MENU</span>
          </Button>
        }
      />
    </>
  );
}

// --- Organism: Navbar ---
export default function Navbar() {
  return (
    // This is the key change: fixed, top-0, z-50, w-full, and background styles
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/90 backdrop-blur-md shadow-sm">
      <Container>
        <nav aria-label="Primary">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20 md:grid md:grid-cols-3">
          <div className="justify-self-start hidden md:block">
            <ContactUs />
          </div>

          <div className="md:justify-self-center">
            <div className="md:scale-100 scale-95">
              <Brand />
            </div>
          </div>

          <div className="justify-self-end">
            <div className="flex items-center gap-1 sm:gap-2">
              <RightControls />
            </div>
          </div>
        </div>
        </nav>
      </Container>
    </header>
  );
}
