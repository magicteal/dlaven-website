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
import PersonalizationModal from "@/components/PersonalizationModal";
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
  const [showPersonalization, setShowPersonalization] = React.useState(false);

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
    <>
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
              {/* Main Links (updated per design) */}
              <div className="space-y-4">
                <DrawerLink
                  href="/products"
                  onNavigate={navigateWithClose}
                  className="block font-normal uppercase no-underline hover:no-underline transition-transform duration-200 will-change-transform hover:scale-105"
                >
                  New In
                </DrawerLink>
                <DrawerLink
                  href="/mens-ready-to-wear"
                  onNavigate={navigateWithClose}
                  className="block font-normal uppercase no-underline hover:no-underline transition-transform duration-200 will-change-transform hover:scale-105"
                >
                  Men
                </DrawerLink>
                <DrawerLink
                  href="/heritage-jewelry"
                  onNavigate={navigateWithClose}
                  className="block font-normal uppercase no-underline hover:no-underline transition-transform duration-200 will-change-transform hover:scale-105"
                >
                  Heritage Jewelery
                </DrawerLink>
                <DrawerLink
                  href="/fragrances"
                  onNavigate={navigateWithClose}
                  className="block font-normal uppercase no-underline hover:no-underline transition-transform duration-200 will-change-transform hover:scale-105"
                >
                  Fragrance
                </DrawerLink>
                {/* spacer between Fragrance and Personalization Services */}
                <div className="h-6" />
                {/* PERSONALIZATION SERVICES opens a centered modal */}
                <button
                  onClick={() => {
                    // close drawer then open modal after animation
                    setOpen(false);
                    setTimeout(() => setShowPersonalization(true), 380);
                  }}
                  className="block text-left w-full font-normal uppercase no-underline hover:no-underline transition-transform duration-200 will-change-transform hover:scale-105"
                >
                  PERSONALIZATION SERVICES
                </button>
                <DrawerLink
                  href="/services"
                  onNavigate={navigateWithClose}
                  className="block font-normal uppercase no-underline hover:no-underline transition-transform duration-200 will-change-transform hover:scale-105"
                >
                  DL SERVICES
                </DrawerLink>
                <DrawerLink
                  href="/world-of-d-laven"
                  onNavigate={navigateWithClose}
                  className="block font-normal uppercase no-underline hover:no-underline transition-transform duration-200 will-change-transform hover:scale-105"
                >
                  WORLD OF D ’ L AVÉN
                </DrawerLink>
                <DrawerLink
                  href="/destinations"
                  onNavigate={navigateWithClose}
                  className="block font-normal uppercase no-underline hover:no-underline transition-transform duration-200 will-change-transform hover:scale-105"
                >
                  DL DESTINATIONS
                </DrawerLink>
              </div>

              {/* Spacer to push bottom content down */}
              <div className="flex-grow"></div>

              {/* Bottom Links */}
              <div className="space-y-4 border-t border-black/10 pt-6 mt-8 text-sm">
                {user ? (
                  <>
                    <DrawerLink
                      href="/me"
                      onNavigate={navigateWithClose}
                      className="block underline uppercase hover:no-underline"
                    >
                      My Orders
                    </DrawerLink>

                    {/* Purchases link directly under My Orders */}
                    <DrawerLink
                      href="/purchases"
                      onNavigate={navigateWithClose}
                      className="block underline uppercase hover:no-underline"
                    >
                      Purchases
                    </DrawerLink>
                  </>
                ) : (
                  <DrawerLink
                    href="/login"
                    onNavigate={navigateWithClose}
                    className="block underline uppercase hover:no-underline"
                  >
                    Sign In
                  </DrawerLink>
                )}
                <DrawerLink
                  href="/contact"
                  onNavigate={navigateWithClose}
                  className="block underline uppercase hover:no-underline"
                >
                  Contact Us
                </DrawerLink>
                <a
                  href="tel:+917488575159"
                  className="block hover:underline"
                  aria-label="Call +91 7488-575159"
                >
                  +91 7488-575159
                </a>
              </div>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
      {/* Personalization modal rendered outside the drawer content so it appears centered */}
      <PersonalizationModal
        isOpen={showPersonalization}
        onClose={() => setShowPersonalization(false)}
      />
    </>
  );
}
