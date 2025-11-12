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
  onOpenPanel,
  panelId,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  onNavigate: (href: string) => void;
  onOpenPanel?: (panelId: string) => void;
  panelId?: string;
}) {
  // If this link opens an in-drawer panel, render a plain button so it
  // never triggers navigation. Otherwise render a Next.js Link that
  // closes the drawer then navigates.
  if (panelId && onOpenPanel) {
    return (
      <button
        type="button"
        onClick={() => onOpenPanel(panelId)}
        className={`${
          className ?? ""
        } group flex items-center justify-between text-left w-full`}
      >
        <span className="flex items-center gap-2">
          <span>{children}</span>
        </span>
        <span
          className="ml-0 opacity-0 translate-x-0.5 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
          aria-hidden
        >
          ›
        </span>
      </button>
    );
  }

  return (
    <Link
      href={href}
      onClick={(e) => {
        e.preventDefault();
        onNavigate(href);
      }}
      className={`${className ?? ""} group flex items-center justify-between`}
    >
      <span className="flex items-center gap-2">
        <span>{children}</span>
      </span>
      <span
        className="ml-0 opacity-0 translate-x-0.5 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
        aria-hidden
      >
        ›
      </span>
    </Link>
  );
}

function PanelView({
  id,
  onBack,
  onNavigate,
  onOpenPanel,
}: {
  id: string;
  onBack: () => void;
  onNavigate: (href: string) => void;
  onOpenPanel?: (panelId: string) => void;
}) {
  // Minimal demo content; extend per panel id
  if (id === "new-in") {
    return (
      <div className="flex flex-col h-full">
        {/* Panel header */}
        <div className="flex items-center gap-2 p-6 pb-2">
          <button
            onClick={onBack}
            className="text-sm uppercase underline decoration-1 underline-offset-4 hover:no-underline"
            aria-label="Back"
          >
            ‹ Back
          </button>
        </div>
        <div className="p-6 pt-4 space-y-4">
          <h2 className="text-2xl">New In</h2>
          <div className="space-y-3">
            <DrawerLink
              href="/products"
              onNavigate={onNavigate}
              className="block font-normal uppercase no-underline hover:no-underline"
            >
              View All
            </DrawerLink>
          </div>
        </div>
      </div>
    );
  }

  if (id === "men") {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 p-6 pb-2">
          <button
            onClick={onBack}
            className="text-sm uppercase underline decoration-1 underline-offset-4 hover:no-underline"
            aria-label="Back"
          >
            ‹ Back
          </button>
        </div>
        <div className="p-6 pt-4 space-y-4">
          <h2 className="text-2xl">Men</h2>
          <div className="space-y-3">
            <DrawerLink
              href="/prive"
              onNavigate={onNavigate}
              onOpenPanel={onOpenPanel}
              panelId="men-prive"
              className="block font-normal uppercase no-underline hover:no-underline"
            >
              DL PRIVÉ EDITION
            </DrawerLink>

            <DrawerLink
              href="/products"
              onNavigate={onNavigate}
              className="block font-normal uppercase no-underline hover:no-underline"
            >
              NEW IN MEN
            </DrawerLink>

            <DrawerLink
              href="/mens-ready-to-wear"
              onNavigate={onNavigate}
              onOpenPanel={onOpenPanel}
              panelId="men-ready"
              className="block font-normal uppercase no-underline hover:no-underline"
            >
              READY-TO-WEAR
            </DrawerLink>

            <DrawerLink
              href="/heritage-jewelry"
              onNavigate={onNavigate}
              className="block font-normal uppercase no-underline hover:no-underline"
            >
              HERITAGE JEWELERY
            </DrawerLink>
          </div>
        </div>
      </div>
    );
  }

  if (id === "heritage") {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 p-6 pb-2">
          <button
            onClick={onBack}
            className="text-sm uppercase underline decoration-1 underline-offset-4 hover:no-underline"
            aria-label="Back"
          >
            ‹ Back
          </button>
        </div>
        <div className="p-6 pt-4 space-y-4">
          <h2 className="text-2xl">Heritage Jewelry</h2>
          <div className="space-y-3">
            <DrawerLink
              href="/heritage-jewelry"
              onNavigate={onNavigate}
              className="block font-normal uppercase no-underline hover:no-underline"
            >
              View All
            </DrawerLink>
          </div>
        </div>
      </div>
    );
  }

  if (id === "fragrances") {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 p-6 pb-2">
          <button
            onClick={onBack}
            className="text-sm uppercase underline decoration-1 underline-offset-4 hover:no-underline"
            aria-label="Back"
          >
            ‹ Back
          </button>
        </div>
        <div className="p-6 pt-4 space-y-4">
          <h2 className="text-2xl">Fragrances</h2>
          <div className="space-y-3">
            <DrawerLink
              href="/fragrances"
              onNavigate={onNavigate}
              className="block font-normal uppercase no-underline hover:no-underline"
            >
              View All
            </DrawerLink>
          </div>
        </div>
      </div>
    );
  }

  // Men -> Ready-to-wear panel
  if (id === "men-ready") {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 p-6 pb-2">
          <button
            onClick={onBack}
            className="text-sm uppercase underline decoration-1 underline-offset-4 hover:no-underline"
            aria-label="Back"
          >
            ‹ Back
          </button>
        </div>
        <div className="p-6 pt-4 space-y-4">
          <h2 className="text-2xl">Ready-to-wear</h2>
          <div className="space-y-3">
            <DrawerLink
              href="/mens-ready-to-wear/t-shirts-polo"
              onNavigate={onNavigate}
              className="block font-normal uppercase no-underline hover:no-underline"
            >
              T-SHIRTS & POLO
            </DrawerLink>

            <DrawerLink
              href="/mens-ready-to-wear/shirts"
              onNavigate={onNavigate}
              className="block font-normal uppercase no-underline hover:no-underline"
            >
              SHIRTS
            </DrawerLink>

            <DrawerLink
              href="/mens-ready-to-wear/pants-shorts"
              onNavigate={onNavigate}
              className="block font-normal uppercase no-underline hover:no-underline"
            >
              PANTS & SHORTS
            </DrawerLink>

            <DrawerLink
              href="/mens-ready-to-wear/knitwear"
              onNavigate={onNavigate}
              className="block font-normal uppercase no-underline hover:no-underline"
            >
              KNITWEAR
            </DrawerLink>

            <DrawerLink
              href="/mens-ready-to-wear/jackets"
              onNavigate={onNavigate}
              className="block font-normal uppercase no-underline hover:no-underline"
            >
              JACKETS
            </DrawerLink>
          </div>
        </div>
      </div>
    );
  }

  // Men -> DL Privé panel (view all)
  if (id === "men-prive") {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 p-6 pb-2">
          <button
            onClick={onBack}
            className="text-sm uppercase underline decoration-1 underline-offset-4 hover:no-underline"
            aria-label="Back"
          >
            ‹ Back
          </button>
        </div>
        <div className="p-6 pt-4 space-y-4">
          <h2 className="text-2xl">DL PRIVÉ EDITION</h2>
          <div className="space-y-3">
            <DrawerLink
              href="/prive"
              onNavigate={onNavigate}
              className="block font-normal uppercase no-underline hover:no-underline"
            >
              VIEW ALL
            </DrawerLink>
          </div>
        </div>
      </div>
    );
  }

  if (id === "services") {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 p-6 pb-2">
          <button
            onClick={onBack}
            className="text-sm uppercase underline decoration-1 underline-offset-4 hover:no-underline"
            aria-label="Back"
          >
            ‹ Back
          </button>
        </div>
        <div className="p-6 pt-4 space-y-4">
          <h2 className="text-2xl">DL Services</h2>
          <div className="space-y-3">
            <DrawerLink
              href="/services"
              onNavigate={onNavigate}
              className="block font-normal uppercase no-underline hover:no-underline"
            >
              Explore Services
            </DrawerLink>
          </div>
        </div>
      </div>
    );
  }

  if (id === "world") {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 p-6 pb-2">
          <button
            onClick={onBack}
            className="text-sm uppercase underline decoration-1 underline-offset-4 hover:no-underline"
            aria-label="Back"
          >
            ‹ Back
          </button>
        </div>
        <div className="p-6 pt-4 space-y-4">
          <h2 className="text-2xl">World of D ’ L Avén</h2>
          <div className="space-y-3">
            <DrawerLink
              href="/world-of-d-laven"
              onNavigate={onNavigate}
              className="block font-normal uppercase no-underline hover:no-underline"
            >
              Discover Stories
            </DrawerLink>
          </div>
        </div>
      </div>
    );
  }

  if (id === "destinations") {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 p-6 pb-2">
          <button
            onClick={onBack}
            className="text-sm uppercase underline decoration-1 underline-offset-4 hover:no-underline"
            aria-label="Back"
          >
            ‹ Back
          </button>
        </div>
        <div className="p-6 pt-4 space-y-4">
          <h2 className="text-2xl">DL Destinations</h2>
          <div className="space-y-3">
            <DrawerLink
              href="/destinations"
              onNavigate={onNavigate}
              className="block font-normal uppercase no-underline hover:no-underline"
            >
              Explore Destinations
            </DrawerLink>
          </div>
        </div>
      </div>
    );
  }

  // Fallback for unknown panels
  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="text-sm uppercase underline decoration-1 underline-offset-4 hover:no-underline"
        aria-label="Back"
      >
        ‹ Back
      </button>
      <div className="mt-4">Section coming soon.</div>
    </div>
  );
}

export default function MenuDrawer({
  trigger,
  side = "right",
}: {
  trigger: React.ReactNode;
  side?: "left" | "right";
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [showPersonalization, setShowPersonalization] = React.useState(false);
  const [activePanel, setActivePanel] = React.useState<string | null>(null);

  // Reset panel when drawer closes
  React.useEffect(() => {
    if (!open) setActivePanel(null);
  }, [open]);

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
          side={side}
          className={`w-[360px] sm:w-[400px] flex flex-col p-0
        data-[state=open]:animate-in ${
          side === "left"
            ? "data-[state=open]:slide-in-from-left"
            : "data-[state=open]:slide-in-from-right"
        } data-[state=open]:fade-in-0
        data-[state=closed]:animate-out ${
          side === "left"
            ? "data-[state=closed]:slide-out-to-left"
            : "data-[state=closed]:slide-out-to-right"
        } data-[state=closed]:fade-out-0`}
          style={{ animationDuration: "400ms" }}
        >
          {/* Header with Close Button */}
          <div className="flex items-center justify-end p-4 border-b border-black/10">
            <SheetClose asChild>
              <Button
                aria-label="Close menu"
                className="h-10 w-10 rounded-full bg-black text-white text-2xl flex items-center justify-center shadow transition-transform duration-150 hover:scale-95 hover:shadow-md"
              >
                <span className="leading-none">×</span>
              </Button>
            </SheetClose>
          </div>

          {/* Scrollable Navigation Area */}
          <div className="flex-1 relative">
            {/* Both root nav and panels are rendered and animated between using
                translate + opacity transitions. This avoids unmount/mount
                jank and gives a smooth panel slide-in effect. */}
            <nav
              className={`absolute inset-0 overflow-y-auto p-6 flex flex-col text-left text-base transform transition-all duration-300 ease-out will-change-transform
                ${
                  activePanel
                    ? "opacity-0 -translate-x-4 pointer-events-none"
                    : "opacity-100 translate-x-0"
                }
              `}
            >
              {/* Main Links (updated per design) */}
              <div className="space-y-4">
                <DrawerLink
                  href="/products"
                  onNavigate={navigateWithClose}
                  onOpenPanel={(id) => setActivePanel(id)}
                  panelId="new-in"
                  className="block font-normal uppercase no-underline hover:no-underline transition-transform duration-200 will-change-transform hover:scale-105"
                >
                  New In
                </DrawerLink>
                <DrawerLink
                  href="/mens-ready-to-wear"
                  onNavigate={navigateWithClose}
                  onOpenPanel={(id) => setActivePanel(id)}
                  panelId="men"
                  className="block font-normal uppercase no-underline hover:no-underline transition-transform duration-200 will-change-transform hover:scale-105"
                >
                  Men
                </DrawerLink>
                <DrawerLink
                  href="/heritage-jewelry"
                  onNavigate={navigateWithClose}
                  onOpenPanel={(id) => setActivePanel(id)}
                  panelId="heritage"
                  className="block font-normal uppercase no-underline hover:no-underline transition-transform duration-200 will-change-transform hover:scale-105"
                >
                  Heritage Jewelery
                </DrawerLink>
                <DrawerLink
                  href="/fragrances"
                  onNavigate={navigateWithClose}
                  onOpenPanel={(id) => setActivePanel(id)}
                  panelId="fragrances"
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
                  className="text-left w-full font-normal uppercase no-underline hover:no-underline transition-transform duration-200 will-change-transform hover:scale-105 group flex items-center justify-between"
                >
                  <span>PERSONALIZATION SERVICES</span>
                  <span
                    className="ml-0 opacity-0 translate-x-0.5 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
                    aria-hidden
                  >
                    ›
                  </span>
                </button>
                <DrawerLink
                  href="/services"
                  onNavigate={navigateWithClose}
                  onOpenPanel={(id) => setActivePanel(id)}
                  panelId="services"
                  className="block font-normal uppercase no-underline hover:no-underline transition-transform duration-200 will-change-transform hover:scale-105"
                >
                  DL SERVICES
                </DrawerLink>
                <DrawerLink
                  href="/world-of-d-laven"
                  onNavigate={navigateWithClose}
                  onOpenPanel={(id) => setActivePanel(id)}
                  panelId="world"
                  className="block font-normal uppercase no-underline hover:no-underline transition-transform duration-200 will-change-transform hover:scale-105"
                >
                  WORLD OF D ’ L AVÉN
                </DrawerLink>
                <DrawerLink
                  href="/destinations"
                  onNavigate={navigateWithClose}
                  onOpenPanel={(id) => setActivePanel(id)}
                  panelId="destinations"
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

            {/* Panel area (placed after nav so it appears above when active) */}
            <div
              className={`absolute inset-0 overflow-y-auto bg-white transform transition-all duration-300 ease-out will-change-transform
                ${
                  activePanel
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-4 pointer-events-none"
                }
              `}
            >
              {activePanel && (
                <PanelView
                  id={activePanel}
                  onBack={() => setActivePanel(null)}
                  onNavigate={navigateWithClose}
                  onOpenPanel={(id) => setActivePanel(id)}
                />
              )}
            </div>
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
