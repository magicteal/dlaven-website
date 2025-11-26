"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import MenuDrawer from "@/components/MenuDrawer";
import SearchOverlay from "@/components/SearchOverlay"; // Import the overlay
import {
  Heart,
  Search,
  Menu as MenuIcon,
  User as UserIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Container from "@/components/Container";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
// wishlist navigates to saved items; no cart provider needed here

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

// (Avatar removed — we use the human icon for the dropdown trigger)

// Brand removed from center per requirement

// --- Molecules ---
function LeftMenuTrigger({ onMenuOpenChange }: { onMenuOpenChange: (open: boolean) => void }) {
  return (
    <MenuDrawer
      side="left"
      onOpenChange={onMenuOpenChange}
      trigger={
        <button
          type="button"
          aria-label="Open menu"
          className="inline-flex h-8 items-center justify-center hover:bg-accent w-8 md:w-auto md:px-2"
        >
          <MenuIcon className="h-4 w-4" />
          <span className="uppercase text-sm hidden md:ml-2 md:inline">Menu</span>
        </button>
      }
    />
  );
}

function RightControls() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  // initials removed — not needed when using the human icon trigger

  return (
    <>
      {/* Account menu: show human icon + dropdown for both logged-out and logged-in users.
          When logged in the menu will hide the "Access" item and provide Logout. */}
      {!loading && <AccountMenu user={user ?? undefined} logout={logout} />}

      <button
        aria-label="Wishlist"
        className="relative inline-flex items-center justify-center h-8 w-8 rounded-none hover:bg-accent"
        onClick={() => router.push("/me#saved")}
      >
        <Heart className="h-4 w-4" />
      </button>
      {/* Avatar and logout moved into dropdown for logged-in users. */}
    </>
  );
}

// --- Organism: Navbar ---
export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 w-full transition-colors duration-200 font-['Lovato-Regular']",
          scrolled ? "bg-white shadow-sm text-black" : "bg-transparent text-white"
        )}
      >
        <div className="px-4 md:px-8">
          <nav aria-label="Primary">
              <div className="grid grid-cols-3 items-center h-16">
              <div className="justify-self-start">
                <div className="flex items-center gap-0 sm:gap-2">
                  <LeftMenuTrigger onMenuOpenChange={setIsMenuOpen} />
                  <button
                    type="button"
                    aria-label="Search"
                    onClick={() => setIsSearchOpen(true)}
                    className={`inline-flex h-8 items-center justify-center hover:bg-accent w-8 sm:w-auto sm:px-2 transition-opacity duration-200 ${
                      isMenuOpen ? 'inline-flex' : 'hidden min-[425px]:inline-flex'
                    }`}
                  >
                      <Search className="h-4 w-4" />
                    <span className="uppercase text-sm hidden sm:ml-2 sm:inline">Search</span>
                  </button>
                </div>
              </div>

              {/* Center: invisible target for hero logo to dock into */}
              <div className="justify-self-center">
                <div
                  id="navbar-logo-target"
                  aria-hidden
                  className="h-7 w-[140px] md:w-[180px]"
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

// --- Account Menu (for logged-out users) ---
function AccountMenu({
  user,
  logout,
}: {
  user?: { name?: string; email?: string; role?: string };
  logout?: () => Promise<void>;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="inline-flex items-center justify-center h-8 w-8 rounded-none hover:bg-accent"
        onClick={() => setOpen((v) => !v)}
      >
        <UserIcon className="h-4 w-4" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-3 w-64 bg-white shadow-lg border border-black/10 z-[60] origin-top-right dropdown-enter"
        >
          <ul className="py-3 text-sm capitalize px-2 space-y-1">
            {/* Top: My Account (visible when logged in) */}
            {user && (
              <li>
                <button
                  className="w-full text-left px-4 py-3 text-base font-normal no-underline hover:no-underline transition-transform duration-200 will-change-transform hover:scale-105"
                  onClick={() => go("/me")}
                >
                  My Account
                </button>
              </li>
            )}

            {/* Show Access only for logged-out users */}
            {!user && (
              <li>
                <button
                  className="w-full text-left px-4 py-3 text-base font-normal no-underline hover:no-underline transition-transform duration-200 will-change-transform hover:scale-105"
                  onClick={() => go("/login")}
                >
                  Access
                </button>
              </li>
            )}

            <li>
              <button
                className="w-full text-left px-4 py-3 text-base font-normal no-underline hover:no-underline transition-transform duration-200 will-change-transform hover:scale-105"
                onClick={() => go("/me")}
              >
                Purchases
              </button>
            </li>
            <li>
              <button
                className="w-full text-left px-4 py-3 text-base font-normal no-underline hover:no-underline transition-transform duration-200 will-change-transform hover:scale-105"
                onClick={() => go("/destinations")}
              >
                Destinations
              </button>
            </li>
            <li>
              <button
                className="w-full text-left px-4 py-3 text-base font-normal no-underline hover:no-underline transition-transform duration-200 will-change-transform hover:scale-105"
                onClick={() => go("/profile")}
              >
                Account Setting
              </button>
            </li>
            <li>
              <button
                className="w-full text-left px-4 py-3 text-base font-normal no-underline hover:no-underline transition-transform duration-200 will-change-transform hover:scale-105"
                onClick={() => go("/prive")}
              >
                DL Privé
              </button>
            </li>
            <li>
              <button
                className="w-full text-left px-4 py-3 text-base font-normal no-underline hover:no-underline transition-transform duration-200 will-change-transform hover:scale-105"
                onClick={() => go("/me#saved")}
              >
                Saved Items
              </button>
            </li>

            {/* If user is logged-in, show Logout inside the dropdown */}
            {user && (
              <li>
                <button
                  className="w-full text-left px-4 py-3 text-base font-normal no-underline hover:no-underline transition-transform duration-200 will-change-transform hover:scale-105"
                  onClick={async () => {
                    setOpen(false);
                    try {
                      await logout?.();
                    } catch {}
                    router.push("/");
                  }}
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
