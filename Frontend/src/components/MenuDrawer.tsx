"use client";

import React from "react";
import Link from "next/link";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";
import { X } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import PersonalizationModal from "@/components/PersonalizationModal";
import { useRouter } from "next/navigation";
import Apostrophe from "@/components/Apostrophe";
import Dash from "@/components/Dash";

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
          <h2 className="text-3xl">New In</h2>
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
              READY
              <Dash />
              TO
              <Dash />
              WEAR
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

  if (id === "women") {
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
          <h2 className="text-2xl">Women</h2>
          <div className="space-y-3">
            <DrawerLink
              href="/prive"
              onNavigate={onNavigate}
              onOpenPanel={onOpenPanel}
              panelId="women-prive"
              className="block font-normal uppercase no-underline hover:no-underline"
            >
              DL PRIVÉ EDITION
            </DrawerLink>

            <DrawerLink
              href="/products"
              onNavigate={onNavigate}
              className="block font-normal uppercase no-underline hover:no-underline"
            >
              NEW IN WOMEN
            </DrawerLink>

            <DrawerLink
              href="/womens-ready-to-wear"
              onNavigate={onNavigate}
              className="block font-normal uppercase no-underline hover:no-underline"
            >
              READY
              <Dash />
              TO
              <Dash />
              WEAR
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
          <h2 className="text-2xl">
            Ready
            <Dash />
            to
            <Dash />
            wear
          </h2>
          <div className="space-y-3">
            <DrawerLink
              href="/mens-ready-to-wear/t-shirts-polo"
              onNavigate={onNavigate}
              className="block font-normal uppercase no-underline hover:no-underline"
            >
              T<Dash />
              SHIRTS & POLO
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

  if (id === "women-prive") {
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
              href="/world-of-d-laven/sealed-in-heritage"
              onNavigate={onNavigate}
              className="block font-normal uppercase no-underline hover:no-underline"
            >
              SEALED IN HERITAGE & SENT WITH LUXURY PACKAGING
            </DrawerLink>

            <DrawerLink
              href="/world-of-d-laven/packaging"
              onNavigate={onNavigate}
              className="block font-normal uppercase no-underline hover:no-underline"
            >
              PACKAGING
            </DrawerLink>

            <DrawerLink
              href="/me"
              onNavigate={onNavigate}
              className="block font-normal uppercase no-underline hover:no-underline"
            >
              MY D’LAVÉN ACCOUNT
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
          <h2 className="text-2xl">
            World of D<Apostrophe /> L Avén
          </h2>
          <div className="space-y-3">
            <DrawerLink
              href="/world-of-d-laven/house-of-dl-creation"
              onNavigate={onNavigate}
              className="block font-normal uppercase no-underline hover:no-underline"
            >
              HOUSE OF D’L CREATIONS
            </DrawerLink>

            <DrawerLink
              href="/world-of-d-laven/future-of-dlaven"
              onNavigate={onNavigate}
              className="block font-normal uppercase no-underline hover:no-underline"
            >
              FUTURE OF D’LAVÉN
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
  open: openProp,
  onOpenChange,
}: {
  trigger: React.ReactNode;
  side?: "left" | "right";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const { user } = useAuth();
  const router = useRouter();
  // Support both controlled (open prop) and uncontrolled usage.
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );
  const [showPersonalization, setShowPersonalization] = React.useState(false);
  const [activePanel, setActivePanel] = React.useState<string | null>(null);
  const navTimeout = React.useRef<number | null>(null);

  // Reset panel when drawer closes
  React.useEffect(() => {
    if (!open) setActivePanel(null);
  }, [open]);

  // Close with animation then navigate. We wait until the close animation
  // finishes so Radix's dialog/focus-trap and overlay are fully removed
  // before client navigation — this prevents the menu trigger from being
  // blocked after navigation.
  const navigateWithClose = React.useCallback(
    (href: string) => {
      // First reset the active panel immediately
      setActivePanel(null);
      // Then close the drawer
      setOpen(false);
      // clear any previous timeout
      if (navTimeout.current) {
        window.clearTimeout(navTimeout.current);
      }
      // Wait for close animation to complete before navigating
      navTimeout.current = window.setTimeout(() => {
        router.push(href);
        navTimeout.current = null;
      }, 450); // slightly longer than Sheet animationDuration to ensure full cleanup
    },
    [router, setOpen]
  );

  // cleanup any pending timeout when component unmounts
  React.useEffect(() => {
    return () => {
      if (navTimeout.current) {
        window.clearTimeout(navTimeout.current);
        navTimeout.current = null;
      }
    };
  }, []);

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{trigger}</SheetTrigger>
        {/* Removed padding from SheetContent to handle scroll layout better */}
        <SheetContent
          side={side}
          data-drawer={side}
          className={`w-[290px] sm:w-[320px] max-w-[calc(100vw-2rem)] flex flex-col p-0 top-28 md:top-32 bottom-auto h-fit max-h-[calc(100dvh-9rem)] overflow-hidden rounded-none border-none bg-[#e2ddd7] text-[#14161f] [font-family:var(--font-manrope)] backdrop-blur-md shadow-2xl ${
            side === "left" ? "left-4 md:left-6" : "right-4 md:right-6"
          }`}
        >
          {/* Navigation Area — height follows the nav content */}
          <div className="relative">
            {/* Both root nav and panels are rendered and animated between using
                translate + opacity transitions. This avoids unmount/mount
                jank and gives a smooth panel slide-in effect. */}
            <nav
              className={`relative pt-9 px-7 pb-7 sm:pt-10 sm:px-8 flex flex-col text-left text-[0.8rem] [font-family:var(--font-manrope)] transform transition-all duration-300 ease-out will-change-transform
                ${
                  activePanel
                    ? "opacity-0 -translate-x-4 pointer-events-none"
                    : "opacity-100 translate-x-0"
                }
              `}
            >
              {/* Main Links (Section 1) */}
              <div className="space-y-2.5 mt-0">
                <DrawerLink
                  href="/products"
                  onNavigate={navigateWithClose}
                  onOpenPanel={(id) => setActivePanel(id)}
                  panelId="new-in"
                  className="block font-normal uppercase tracking-[0.06em] text-[#14161f] no-underline hover:no-underline hover:text-[#000000] transition-colors duration-200"
                >
                  New In
                </DrawerLink>
                <DrawerLink
                  href="/womens-adornments"
                  onNavigate={navigateWithClose}
                  onOpenPanel={(id) => setActivePanel(id)}
                  panelId="women"
                  className="block font-normal uppercase tracking-[0.06em] text-[#14161f] no-underline hover:no-underline hover:text-[#000000] transition-colors duration-200"
                >
                  Women
                </DrawerLink>
                <DrawerLink
                  href="/mens-ready-to-wear"
                  onNavigate={navigateWithClose}
                  onOpenPanel={(id) => setActivePanel(id)}
                  panelId="men"
                  className="block font-normal uppercase tracking-[0.06em] text-[#14161f] no-underline hover:no-underline hover:text-[#000000] transition-colors duration-200"
                >
                  Men
                </DrawerLink>
                <DrawerLink
                  href="/heritage-jewelry"
                  onNavigate={navigateWithClose}
                  onOpenPanel={(id) => setActivePanel(id)}
                  panelId="heritage"
                  className="block font-normal uppercase tracking-[0.06em] text-[#14161f] no-underline hover:no-underline hover:text-[#000000] transition-colors duration-200"
                >
                  Heritage Jewelery
                </DrawerLink>
                <DrawerLink
                  href="/fragrances"
                  onNavigate={navigateWithClose}
                  onOpenPanel={(id) => setActivePanel(id)}
                  panelId="fragrances"
                  className="block font-normal uppercase tracking-[0.06em] text-[#14161f] no-underline hover:no-underline hover:text-[#000000] transition-colors duration-200"
                >
                  Fragrance
                </DrawerLink>
              </div>

              {/* Section 2 */}
              <div className="mt-6 space-y-2.5">
                {/* PERSONALIZATION SERVICES opens a centered modal */}
                <button
                  onClick={() => {
                    // close drawer then open modal after animation
                    setOpen(false);
                    setTimeout(() => setShowPersonalization(true), 380);
                  }}
                  className="text-left w-full font-normal uppercase tracking-[0.06em] text-[#14161f] no-underline hover:no-underline hover:text-[#000000] transition-colors duration-200 group flex items-center justify-between"
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
                  className="block font-normal uppercase tracking-[0.06em] text-[#14161f] no-underline hover:no-underline hover:text-[#000000] transition-colors duration-200"
                >
                  DL SERVICES
                </DrawerLink>
                <DrawerLink
                  href="/world-of-d-laven"
                  onNavigate={navigateWithClose}
                  onOpenPanel={(id) => setActivePanel(id)}
                  panelId="world"
                  className="block font-normal uppercase tracking-[0.06em] text-[#14161f] no-underline hover:no-underline hover:text-[#000000] transition-colors duration-200"
                >
                  WORLD OF D<Apostrophe /> L AVÉN
                </DrawerLink>
                <DrawerLink
                  href="/destinations"
                  onNavigate={navigateWithClose}
                  onOpenPanel={(id) => setActivePanel(id)}
                  panelId="destinations"
                  className="block font-normal uppercase tracking-[0.06em] text-[#14161f] no-underline hover:no-underline hover:text-[#000000] transition-colors duration-200"
                >
                  DL DESTINATIONS
                </DrawerLink>
              </div>

              {/* Bottom Links (Section 3) — equal top spacing */}
              <div className="space-y-1.5 mt-6 text-[0.7rem] tracking-[0.08em]">
                {/* Always show same options; route to login when unauthenticated */}
                <DrawerLink
                  href={user ? "/me" : "/login"}
                  onNavigate={navigateWithClose}
                  className="block uppercase hover:text-[#000000] transition-colors duration-200"
                >
                  MY ACCOUNT
                </DrawerLink>

                <DrawerLink
                  href={user ? "/purchases" : "/login"}
                  onNavigate={navigateWithClose}
                  className="block uppercase hover:text-[#000000] transition-colors duration-200"
                >
                  PURCHASES
                </DrawerLink>
                <DrawerLink
                  href="/contact"
                  onNavigate={navigateWithClose}
                  className="block uppercase hover:text-[#000000] transition-colors duration-200"
                >
                  CONTACT US
                </DrawerLink>
                <a
                  href="tel:+917488575159"
                  className="block pt-1.5 tracking-[0.05em] hover:text-[#000000] transition-colors duration-200"
                  aria-label="Call +91 7488-575159"
                >
                  +91 7488-575159
                </a>
              </div>
            </nav>

            {/* Panel area (placed after nav so it appears above when active) */}
            <div
              className={`absolute inset-0 overflow-hidden bg-[#e2ddd7] backdrop-blur-md transform transition-all duration-300 ease-out will-change-transform
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
          {/* In-sheet close button (visible, top-right, above all content) */}
          <SheetClose asChild>
            <button
              type="button"
              aria-label="Close menu"
              className="absolute right-4 top-4 h-8 w-8 grid place-items-center rounded-full border border-[#14161f]/20 bg-transparent text-[#14161f]/70 hover:text-[#000000] hover:border-[#14161f]/45 transition-colors duration-200 z-[60] pointer-events-auto"
            >
              <X className="h-4 w-4" />
            </button>
          </SheetClose>
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
