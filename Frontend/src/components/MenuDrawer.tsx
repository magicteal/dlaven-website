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
import { useRouter } from "next/navigation";

function DrawerLink({
  href,
  children,
  className,
  onNavigate,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  onNavigate: (href: string) => void;
}) {
  return (
    <Link
      href={href}
      onClick={(e) => {
        e.preventDefault();
        onNavigate(href);
      }}
      className={className}
    >
      {children}
    </Link>
  );
}

export default function MenuDrawer({ trigger }: { trigger: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  // Close with animation then navigate
  const navigateWithClose = React.useCallback(
    (href: string) => {
      setOpen(false);
      // match animationDuration in SheetContent (400ms)
      setTimeout(() => router.push(href), 380);
    },
    [router]
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      {/* Removed padding from SheetContent to handle scroll layout better */}
      <SheetContent
        side="right"
        className="w-[360px] sm:w-[400px] flex flex-col p-0
        data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=open]:fade-in-0
        data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=closed]:fade-out-0"
        style={{ animationDuration: "400ms" }}
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
              <DrawerLink
                href="/mens-ready-to-wear"
                onNavigate={navigateWithClose}
                className="block font-semibold no-underline hover:no-underline transition-transform duration-200 will-change-transform hover:scale-105"
              >
                Men
              </DrawerLink>
              <DrawerLink
                href="/heritage-jewelry"
                onNavigate={navigateWithClose}
                className="block font-semibold no-underline hover:no-underline transition-transform duration-200 will-change-transform hover:scale-105"
              >
                Heritage Jewellery
              </DrawerLink>
              <DrawerLink
                href="/fragrances"
                onNavigate={navigateWithClose}
                className="block font-semibold no-underline hover:no-underline transition-transform duration-200 will-change-transform hover:scale-105"
              >
                Fragrances
              </DrawerLink>
              <DrawerLink
                href="/services"
                onNavigate={navigateWithClose}
                className="block font-semibold no-underline hover:no-underline transition-transform duration-200 will-change-transform hover:scale-105"
              >
                DL Services
              </DrawerLink>
              <DrawerLink
                href="/destinations"
                onNavigate={navigateWithClose}
                className="block font-semibold no-underline hover:no-underline transition-transform duration-200 will-change-transform hover:scale-105"
              >
                DL Destinations
              </DrawerLink>
              <DrawerLink
                href="/products"
                onNavigate={navigateWithClose}
                className="block font-semibold no-underline hover:no-underline transition-transform duration-200 will-change-transform hover:scale-105"
              >
                Shop
              </DrawerLink>
              <DrawerLink
                href="/about"
                onNavigate={navigateWithClose}
                className="block font-semibold no-underline hover:no-underline transition-transform duration-200 will-change-transform hover:scale-105"
              >
                About Us
              </DrawerLink>
              <DrawerLink
                href="/contact"
                onNavigate={navigateWithClose}
                className="block font-semibold no-underline hover:no-underline transition-transform duration-200 will-change-transform hover:scale-105"
              >
                Contact Us
              </DrawerLink>
            </div>

            {/* Secondary Links */}
            <div className="mt-8 space-y-4">
              <DrawerLink
                href="/world-of-d-laven"
                onNavigate={navigateWithClose}
                className="block font-semibold no-underline hover:no-underline transition-transform duration-200 will-change-transform hover:scale-105"
              >
                World of D&apos;LAVÉN
              </DrawerLink>
              {/* Gifts route not implemented; point to Shop to avoid 404 */}
              <DrawerLink
                href="/products"
                onNavigate={navigateWithClose}
                className="block font-semibold no-underline hover:no-underline transition-transform duration-200 will-change-transform hover:scale-105"
              >
                Gifts
              </DrawerLink>
              <DrawerLink
                href="/destinations"
                onNavigate={navigateWithClose}
                className="block font-semibold no-underline hover:no-underline transition-transform duration-200 will-change-transform hover:scale-105"
              >
                Store Locator
              </DrawerLink>
            </div>

            {/* Spacer to push bottom content down */}
            <div className="flex-grow"></div>

            {/* Bottom Links */}
            <div className="space-y-4 border-t border-black/10 pt-6 mt-8 text-sm">
              {user ? (
                <DrawerLink
                  href="/me"
                  onNavigate={navigateWithClose}
                  className="block underline hover:no-underline"
                >
                  My Orders
                </DrawerLink>
              ) : (
                <DrawerLink
                  href="/login"
                  onNavigate={navigateWithClose}
                  className="block underline hover:no-underline"
                >
                  Sign In
                </DrawerLink>
              )}
              <DrawerLink
                href="/contact"
                onNavigate={navigateWithClose}
                className="block underline hover:no-underline"
              >
                Contact Us
              </DrawerLink>
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
