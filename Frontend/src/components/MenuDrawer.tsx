"use client";

import React from "react";
import Link from "next/link";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";
import { X, ChevronLeft } from "lucide-react";
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
  if (panelId && onOpenPanel) {
    return (
      <button
        type="button"
        onClick={() => onOpenPanel(panelId)}
        className={`${
          className ?? ""
        } group flex items-center justify-between text-left w-full transition-colors duration-200`}
      >
        <span className="flex items-center gap-2">
          <span>{children}</span>
        </span>
        <span
          className="text-xs text-[#14161f]/40 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#431717]"
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
      className={`${className ?? ""} group flex items-center justify-between transition-colors duration-200`}
    >
      <span className="flex items-center gap-2">
        <span>{children}</span>
      </span>
      <span
        className="text-xs opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[#431717]"
        aria-hidden
      >
        ›
      </span>
    </Link>
  );
}

function PanelWrapper({
  title,
  onBack,
  children,
}: {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-full animate-in fade-in-50 slide-in-from-right-4 duration-300 ease-out">
      {/* Panel header: Back button */}
      <div className="flex items-center gap-2 pt-6 px-6 pb-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-[#14161f]/75 hover:text-[#431717] transition-colors py-1 group font-medium"
          aria-label="Back to main menu"
        >
          <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back</span>
        </button>
      </div>

      <div className="px-6 pt-3 pb-8 space-y-4">
        {/* Title */}
        <h2 className="font-le-grand text-lg sm:text-xl uppercase tracking-[0.14em] text-[#431717] font-normal border-b border-[#14161f]/10 pb-2.5">
          {title}
        </h2>

        {/* Links */}
        <div className="space-y-2.5 pt-0.5">{children}</div>
      </div>
    </div>
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
  const linkClass =
    "block font-normal uppercase tracking-[0.06em] text-[0.8rem] text-[#14161f]/90 hover:text-[#000000] no-underline hover:no-underline py-0.5";

  if (id === "new-in") {
    return (
      <PanelWrapper title="New In" onBack={onBack}>
        <DrawerLink href="/products" onNavigate={onNavigate} className={linkClass}>
          View All New Arrivals
        </DrawerLink>
        <DrawerLink href="/dlaven-limited" onNavigate={onNavigate} className={linkClass}>
          DL Limited Editions
        </DrawerLink>
        <DrawerLink href="/dl-prive" onNavigate={onNavigate} className={linkClass}>
          DL Privé Exclusives
        </DrawerLink>
        <DrawerLink href="/dl-barry" onNavigate={onNavigate} className={linkClass}>
          DL Bérry Creations
        </DrawerLink>
      </PanelWrapper>
    );
  }

  if (id === "men") {
    return (
      <PanelWrapper title="Mens Collection" onBack={onBack}>
        <DrawerLink href="/dlaven-limited" onNavigate={onNavigate} className={linkClass}>
          DL Limited
        </DrawerLink>
        <DrawerLink href="/dl-prive" onNavigate={onNavigate} className={linkClass}>
          DL Privé
        </DrawerLink>
        <DrawerLink href="/dl-barry" onNavigate={onNavigate} className={linkClass}>
          DL Bérry
        </DrawerLink>
        <DrawerLink href="/mens-ready-to-wear" onNavigate={onNavigate} className={linkClass}>
          Ready to Wear
        </DrawerLink>
        <DrawerLink href="/prive-mens-adornments" onNavigate={onNavigate} className={linkClass}>
          DL Privé Adornments
        </DrawerLink>
        <DrawerLink href="/adornments-prive" onNavigate={onNavigate} className={linkClass}>
          DL Bérry Adornments
        </DrawerLink>
        <DrawerLink href="/fragrances?collection=prive&gender=men" onNavigate={onNavigate} className={linkClass}>
          DL Privé Fragrance
        </DrawerLink>
        <DrawerLink href="/fragrances?collection=berry&gender=men" onNavigate={onNavigate} className={linkClass}>
          DL Bérry Fragrance
        </DrawerLink>
      </PanelWrapper>
    );
  }

  if (id === "women") {
    return (
      <PanelWrapper title="Womens Collection" onBack={onBack}>
        <DrawerLink href="/dlaven-limited" onNavigate={onNavigate} className={linkClass}>
          DL Limited
        </DrawerLink>
        <DrawerLink href="/dl-prive" onNavigate={onNavigate} className={linkClass}>
          DL Privé
        </DrawerLink>
        <DrawerLink href="/dl-barry" onNavigate={onNavigate} className={linkClass}>
          DL Bérry
        </DrawerLink>
        <DrawerLink href="/womens-ready-to-wear" onNavigate={onNavigate} className={linkClass}>
          Ready to Wear
        </DrawerLink>
        <DrawerLink href="/prive-womens-adornments" onNavigate={onNavigate} className={linkClass}>
          DL Privé Adornments
        </DrawerLink>
        <DrawerLink href="/adornments-prive" onNavigate={onNavigate} className={linkClass}>
          DL Bérry Adornments
        </DrawerLink>
        <DrawerLink href="/fragrances?collection=prive&gender=women" onNavigate={onNavigate} className={linkClass}>
          DL Privé Fragrance
        </DrawerLink>
        <DrawerLink href="/fragrances?collection=berry&gender=women" onNavigate={onNavigate} className={linkClass}>
          DL Bérry Fragrance
        </DrawerLink>
      </PanelWrapper>
    );
  }

  if (id === "heritage") {
    return (
      <PanelWrapper title="Heritage Jewellery" onBack={onBack}>
        <DrawerLink href="/heritage-jewelry?type=prive-heritage-womens" onNavigate={onNavigate} className={linkClass}>
          Privé Heritage Womens Jewellery
        </DrawerLink>
        <DrawerLink href="/heritage-jewelry?type=prive-heritage-mens" onNavigate={onNavigate} className={linkClass}>
          Privé Heritage Mens Jewellery
        </DrawerLink>
        <DrawerLink href="/heritage-prive?type=prive-international-womens" onNavigate={onNavigate} className={linkClass}>
          Privé International Womens Jewellery
        </DrawerLink>
        <DrawerLink href="/heritage-prive?type=prive-international-mens" onNavigate={onNavigate} className={linkClass}>
          Privé International Mens Jewellery
        </DrawerLink>
        <DrawerLink href="/heritage-jewelry?type=berry-heritage-womens" onNavigate={onNavigate} className={linkClass}>
          Bérry Heritage Womens Jewellery
        </DrawerLink>
        <DrawerLink href="/heritage-jewelry?type=berry-heritage-mens" onNavigate={onNavigate} className={linkClass}>
          Bérry Heritage Mens Jewellery
        </DrawerLink>
        <DrawerLink href="/prive-jewellery?type=berry-international-womens" onNavigate={onNavigate} className={linkClass}>
          Bérry International Womens Jewellery
        </DrawerLink>
        <DrawerLink href="/prive-jewellery?type=berry-international-mens" onNavigate={onNavigate} className={linkClass}>
          Bérry International Mens Jewellery
        </DrawerLink>
      </PanelWrapper>
    );
  }

  if (id === "fragrances") {
    return (
      <PanelWrapper title="Haute Parfumerie" onBack={onBack}>
        <DrawerLink href="/fragrances?gender=women" onNavigate={onNavigate} className={linkClass}>
          Womens Fragrance
        </DrawerLink>
        <DrawerLink href="/fragrances?gender=men" onNavigate={onNavigate} className={linkClass}>
          Mens Fragrance
        </DrawerLink>
        <DrawerLink href="/fragrances?collection=prive&gender=women" onNavigate={onNavigate} className={linkClass}>
          DL Privé Womens Fragrance
        </DrawerLink>
        <DrawerLink href="/fragrances?collection=prive&gender=men" onNavigate={onNavigate} className={linkClass}>
          DL Privé Mens Fragrance
        </DrawerLink>
        <DrawerLink href="/fragrances?collection=berry&gender=women" onNavigate={onNavigate} className={linkClass}>
          DL Bérry Womens Fragrance
        </DrawerLink>
        <DrawerLink href="/fragrances?collection=berry&gender=men" onNavigate={onNavigate} className={linkClass}>
          DL Bérry Mens Fragrance
        </DrawerLink>
      </PanelWrapper>
    );
  }

  if (id === "men-ready") {
    return (
      <PanelWrapper title="Ready to Wear" onBack={onBack}>
        <DrawerLink href="/mens-ready-to-wear/t-shirts-polo" onNavigate={onNavigate} className={linkClass}>
          T-Shirts & Polo
        </DrawerLink>
        <DrawerLink href="/mens-ready-to-wear/shirts" onNavigate={onNavigate} className={linkClass}>
          Shirts
        </DrawerLink>
        <DrawerLink href="/mens-ready-to-wear/pants-shorts" onNavigate={onNavigate} className={linkClass}>
          Pants & Shorts
        </DrawerLink>
        <DrawerLink href="/mens-ready-to-wear/knitwear" onNavigate={onNavigate} className={linkClass}>
          Knitwear
        </DrawerLink>
        <DrawerLink href="/mens-ready-to-wear/jackets" onNavigate={onNavigate} className={linkClass}>
          Jackets
        </DrawerLink>
      </PanelWrapper>
    );
  }

  if (id === "services") {
    return (
      <PanelWrapper title="DL Services" onBack={onBack}>
        <DrawerLink href="/world-of-d-laven/sealed-in-heritage" onNavigate={onNavigate} className={linkClass}>
          Sealed in Heritage & Luxury Packaging
        </DrawerLink>
        <DrawerLink href="/world-of-d-laven/packaging" onNavigate={onNavigate} className={linkClass}>
          Packaging Craftsmanship
        </DrawerLink>
        <DrawerLink href="/me" onNavigate={onNavigate} className={linkClass}>
          My D’Lavén Account
        </DrawerLink>
      </PanelWrapper>
    );
  }

  if (id === "world") {
    return (
      <PanelWrapper title="World of D’ Lavén" onBack={onBack}>
        <DrawerLink href="/world-of-d-laven/house-of-dl-creation" onNavigate={onNavigate} className={linkClass}>
          House of D’L Creations
        </DrawerLink>
        <DrawerLink href="/world-of-d-laven/future-of-dlaven" onNavigate={onNavigate} className={linkClass}>
          Future of D’Lavén
        </DrawerLink>
      </PanelWrapper>
    );
  }

  if (id === "destinations") {
    return (
      <PanelWrapper title="DL Destinations" onBack={onBack}>
        <DrawerLink href="/destinations" onNavigate={onNavigate} className={linkClass}>
          Explore Destinations
        </DrawerLink>
      </PanelWrapper>
    );
  }

  // Fallback
  return (
    <PanelWrapper title="Section" onBack={onBack}>
      <p className="text-xs text-[#14161f]/70">Section coming soon.</p>
    </PanelWrapper>
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

  // Close drawer and navigate immediately
  const navigateWithClose = React.useCallback(
    (href: string) => {
      setActivePanel(null);
      setOpen(false);
      if (navTimeout.current) {
        window.clearTimeout(navTimeout.current);
        navTimeout.current = null;
      }
      router.push(href);
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
        <SheetContent
          side={side}
          data-drawer={side}
          className={`w-[290px] sm:w-[320px] max-w-[calc(100vw-2rem)] flex flex-col p-0 top-24 sm:top-28 md:top-32 bottom-auto h-fit max-h-[calc(100dvh-7rem)] sm:max-h-[calc(100dvh-8.5rem)] rounded-none border border-black/10 bg-[#F6F4E6] text-[#14161f] [font-family:var(--font-manrope)] backdrop-blur-md shadow-2xl overflow-y-auto overflow-x-hidden ${
            side === "left" ? "left-4 md:left-6" : "right-4 md:right-6"
          }`}
        >
          {/* Navigation Area — scrollable and fits all screen heights */}
          <div className="relative w-full min-h-full">
            {/* Both root nav and panels are rendered and animated between using
                translate + opacity transitions. This avoids unmount/mount
                jank and gives a smooth panel slide-in effect. */}
            <nav
              className={`relative pt-9 px-7 pb-7 sm:pt-10 sm:px-8 flex flex-col text-left text-[0.8rem] [font-family:var(--font-manrope)] transform transition-all duration-300 ease-out will-change-transform
                ${
                  activePanel
                    ? "opacity-0 -translate-x-4 pointer-events-none hidden"
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

            {/* Panel area (rendered when activePanel is set) */}
            {activePanel && (
              <div
                className="w-full bg-[#F6F4E6] backdrop-blur-md transform transition-all duration-300 ease-out will-change-transform opacity-100 translate-x-0"
              >
                <PanelView
                  id={activePanel}
                  onBack={() => setActivePanel(null)}
                  onNavigate={navigateWithClose}
                  onOpenPanel={(id) => setActivePanel(id)}
                />
              </div>
            )}
          </div>
          {/* In-sheet close button (visible, top-right, above all content) */}
          <SheetClose asChild>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setActivePanel(null)}
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
