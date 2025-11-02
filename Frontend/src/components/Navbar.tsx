"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import MenuDrawer from "@/components/MenuDrawer";
import SearchOverlay from "@/components/SearchOverlay"; // Import the overlay
import {
  ShoppingBag,
  Search,
  Menu,
  Plus,
  User as UserIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Container from "@/components/Container";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/providers/CartProvider";

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
      <span className="uppercase">Contact Us</span>
    </Link>
  );
}

function RightControls({ onSearchClick }: { onSearchClick: () => void }) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const { count } = useCart();

  // initials removed — not needed when using the human icon trigger

  return (
    <>
      {/* Account menu: show human icon + dropdown for both logged-out and logged-in users.
          When logged in the menu will hide the "Access" item and provide Logout. */}
      {!loading && <AccountMenu user={user ?? undefined} logout={logout} />}

      <button
        aria-label="Cart"
        className="relative inline-flex items-center justify-center h-9 w-9 rounded-none hover:bg-accent"
        onClick={() => router.push("/cart")}
      >
        <ShoppingBag className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] leading-none px-1.5 py-1 rounded-full">
            {count}
          </span>
        )}
      </button>
      {/* Avatar and logout moved into dropdown for logged-in users. */}
      <IconButton
        aria-label="Search"
        className="hidden sm:inline-flex"
        onClick={onSearchClick}
      >
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
            <span className="hidden sm:inline text-sm whitespace-nowrap">
              MENU
            </span>
          </Button>
        }
      />
    </>
  );
}

// --- Organism: Navbar ---
export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
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
                  {/* Login/Register replaced by AccountMenu above */}
                  <RightControls onSearchClick={() => setIsSearchOpen(true)} />
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
