"use client";

import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
import MenuDrawer from "@/components/MenuDrawer";
import SearchOverlay from "@/components/SearchOverlay"; // Import the overlay
import {
  Heart,
  Search,
  Menu as MenuIcon,
  User as UserIcon,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import { useRouter } from "next/navigation";
// wishlist navigates to saved items; no cart provider needed here

function safeNextPath(next: string) {
  if (!next.startsWith("/")) return "/account";
  if (next.startsWith("//")) return "/account";
  return next;
}

// --- Atoms ---
// function IconButton({
//   children,
//   className,
//   ...props
// }: React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) {
//   return (
//     <Button
//       variant="ghost"
//       size="icon"
//       className={cn("rounded-none", className)}
//       {...props}
//     >
//       {children}
//     </Button>
//   );
// }

// (Avatar removed — we use the human icon for the dropdown trigger)

// Brand removed from center per requirement

// --- Molecules ---
function LeftMenuTrigger({
  onMenuOpenChange,
}: {
  onMenuOpenChange: (open: boolean) => void;
}) {
  return (
    <MenuDrawer
      side="left"
      onOpenChange={onMenuOpenChange}
      trigger={
        <button
          type="button"
          aria-label="Open menu"
          className="inline-flex h-8 items-center justify-center w-8 md:w-auto md:px-2 transition-transform duration-200 hover:scale-110"
        >
          <MenuIcon className="h-4 w-4" />
          <span className="cursor-pointer text-sm hidden md:ml-2 md:inline">
            Menu
          </span>
        </button>
      }
    />
  );
}

function RightControls() {
  const { user, loading } = useAuth();
  const { count } = useCart();
  const router = useRouter();

  const goAccount = () => {
    if (loading) return;
    if (user) {
      router.push("/account");
      return;
    }
    router.push(`/login?next=${encodeURIComponent("/account")}`);
  };

  const goSaved = () => {
    if (loading) return;
    const next = "/account?tab=saved";
    if (user) {
      router.push(safeNextPath(next));
      return;
    }
    router.push(`/login?next=${encodeURIComponent(next)}`);
  };

  return (
    <>
      <button
        aria-label="Account"
        className="inline-flex items-center justify-center h-8 w-8 rounded-none transition-transform duration-200 hover:scale-110"
        onClick={goAccount}
      >
        <UserIcon className="h-4 w-4" />
      </button>
      <button
        aria-label="Wishlist"
        className="relative inline-flex items-center justify-center h-8 w-8 rounded-none transition-transform duration-200 hover:scale-110"
        onClick={goSaved}
      >
        <Heart className="h-4 w-4" />
      </button>
      <button
        aria-label={count > 0 ? `Cart (${count} items)` : "Cart"}
        className="relative inline-flex items-center justify-center h-8 w-8 rounded-none transition-transform duration-200 hover:scale-110"
        onClick={() => router.push("/cart")}
      >
        <ShoppingBag className="h-4 w-4" />
        {count > 0 ? (
          <span
            className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-black text-white text-[10px] leading-4 text-center"
            aria-hidden
          >
            {count > 99 ? "99+" : count}
          </span>
        ) : null}
      </button>
    </>
  );
}

// --- Organism: Navbar ---
export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Make navbar background change after a small scroll distance
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[40] w-full transition-colors duration-200 font-sans",
          scrolled
            ? "bg-white shadow-sm text-black"
            : "bg-transparent text-white"
        )}
      >
        <div className="px-4 md:px-8">
          <nav aria-label="Primary">
            <div className="grid grid-cols-3 items-center h-20">
              <div className="justify-self-start">
                <div className="flex items-center gap-0 sm:gap-2">
                  <LeftMenuTrigger onMenuOpenChange={setIsMenuOpen} />
                  <button
                    type="button"
                    aria-label="Search"
                    onClick={() => setIsSearchOpen(true)}
                    className={`inline-flex h-8 items-center justify-center w-8 sm:w-auto sm:px-2 transition-all duration-200 hover:scale-110 ${isMenuOpen
                      ? "inline-flex"
                      : "hidden min-[425px]:inline-flex"
                      }`}
                  >
                    <Search className="h-4 w-4" />
                    <span className="uppercase text-sm hidden sm:ml-2 sm:inline">
                      Search
                    </span>
                  </button>
                </div>
              </div>

              <div className="justify-self-center">
                <div
                  id="navbar-logo-target"
                  aria-hidden
                  className="h-6 sm:h-7 md:h-8 w-[100px] sm:w-[120px] md:w-[140px] lg:w-[160px]"
                />
              </div>

              <div className="justify-self-end">
                <div className="flex items-center gap-1 sm:gap-2">
                  {/* Login/Register replaced by AccountMenu above */}
                  <RightControls />
                </div>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Search Overlay Component */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
