"use client";

import React, { useState } from "react";
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

function Brand() {
  return (
    <Link href="/" className="select-none leading-none inline-block">
      <Image
        src="/logos/logoBlack.svg"
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
function LeftMenuTrigger() {
  return (
    <MenuDrawer
      side="left"
      trigger={
        <button
          type="button"
          aria-label="Open menu"
          className="inline-flex h-10 items-center justify-center hover:bg-accent w-10 md:w-auto md:px-2"
        >
          <MenuIcon className="h-5 w-5" />
          <span className="uppercase hidden md:ml-2 md:inline">Menu</span>
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
        className="relative inline-flex items-center justify-center h-9 w-9 rounded-none hover:bg-accent"
        onClick={() => router.push("/me#saved")}
      >
        <Heart className="h-5 w-5" />
      </button>
      {/* Avatar and logout moved into dropdown for logged-in users. */}
    </>
  );
}

// --- Organism: Navbar ---
export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50  w-full bg-white/90 backdrop-blur-md shadow-sm font-['Lovato-Regular']">
        <Container>
          <nav aria-label="Primary">
            <div className="grid grid-cols-3 items-center h-20">
              <div className="justify-self-start">
                <div className="flex items-center gap-0 sm:gap-2">
                  <LeftMenuTrigger />
                  <button
                    type="button"
                    aria-label="Search"
                    onClick={() => setIsSearchOpen(true)}
                    className="inline-flex h-10 items-center justify-center hover:bg-accent w-10 md:w-auto md:px-2"
                  >
                    <Search className="h-5 w-5" />
                    <span className="uppercase hidden md:ml-2 md:inline">Search</span>
                  </button>
                </div>
              </div>

              <div className="justify-self-center">
                <div className="scale-95 md:scale-100">
                  <Brand />
                </div>
              </div>

              <div className="justify-self-end">
                <div className="flex items-center gap-1 sm:gap-2">
                  {/* Login/Register replaced by AccountMenu above */}
                  <RightControls />
                </div>
              </div>
            </div>
          </nav>
        </Container>
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
        className="inline-flex items-center justify-center h-9 w-9 rounded-none hover:bg-accent"
        onClick={() => setOpen((v) => !v)}
      >
        <UserIcon className="h-5 w-5" />
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
