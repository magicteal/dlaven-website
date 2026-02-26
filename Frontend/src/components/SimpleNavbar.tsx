"use client";

import React, { useState } from "react";
import MenuDrawer from "@/components/MenuDrawer";
import SearchOverlay from "@/components/SearchOverlay";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Search,
  Menu as MenuIcon,
  User as UserIcon,
  ShoppingBag,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import { useRouter } from "next/navigation";

function LeftMenuTrigger({ onMenuOpenChange }: { onMenuOpenChange: (open: boolean) => void }) {
  return (
    <MenuDrawer
      side="left"
      onOpenChange={onMenuOpenChange}
      trigger={
        <button
          type="button"
          aria-label="Open menu"
          className="inline-flex h-8 items-center justify-center hover: w-8 md:w-auto md:px-2"
        >
          <MenuIcon className="h-4 w-4" />
          <span className="uppercase text-sm hidden md:ml-2 md:inline">Menu</span>
        </button>
      }
    />
  );
}

function RightControls() {
  const { user, loading } = useAuth();
  const { count } = useCart();
  const router = useRouter();

  return (
    <>
      {/* Profile/Account icon - redirects to account page or login */}
      <button
        aria-label="Account"
        className="inline-flex items-center justify-center h-8 w-8 rounded-none bg-transparent"
        onClick={() => router.push(user ? "/account" : "/login")}
      >
        <UserIcon className="h-4 w-4" />
      </button>
      <button
        aria-label="Wishlist"
        className="relative inline-flex items-center justify-center h-8 w-8 rounded-none bg-transparent"
        onClick={() => router.push("/me#saved")}
      >
        <Heart className="h-4 w-4" />
      </button>
      {(!loading && user) && (
        <button
          aria-label={count > 0 ? `Cart (${count} items)` : "Cart"}
          className="relative inline-flex items-center justify-center h-8 w-8 rounded-none bg-transparent"
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
      )}
    </>
  );
}

export default function SimpleNavbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[40] w-full bg-white shadow-sm text-black font-sans">
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
                    className={`inline-flex h-8 items-center justify-center hover:bg-accent w-8 sm:w-auto sm:px-2 ${
                      isMenuOpen ? 'inline-flex' : 'hidden min-[425px]:inline-flex'
                    }`}
                  >
                    <Search className="h-4 w-4" />
                    <span className="uppercase text-sm hidden sm:ml-2 sm:inline">Search</span>
                  </button>
                </div>
              </div>

              <div className="justify-self-center">
                <Link href="/" className="block">
                  <Image
                    src="/logos/logoText.svg"
                    alt="D' LAVÉN"
                    width={180}
                    height={44}
                    priority
                    className="h-6 sm:h-7 md:h-8 w-auto brightness-0"
                  />
                </Link>
              </div>

              <div className="justify-self-end">
                <div className="flex items-center gap-1 sm:gap-2">
                  <RightControls />
                </div>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
