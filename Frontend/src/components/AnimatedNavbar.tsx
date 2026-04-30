"use client";

import React, { useState } from "react";
import SearchOverlay from "@/components/SearchOverlay";
import MenuDrawer from "@/components/MenuDrawer";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  User as UserIcon,
  ShoppingBag,
  Menu as MenuIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import { useRouter } from "next/navigation";

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

  return (
    <>
      <button
        aria-label="Account"
        className="inline-flex items-center justify-center gap-2 h-8 rounded-none transition-transform duration-200 hover:scale-105"
        onClick={goAccount}
      >
        <UserIcon strokeWidth={1.5} className="h-5 w-5" />
        <span className="uppercase text-sm hidden md:inline">Account</span>
      </button>
      <button
        aria-label={count > 0 ? `Cart (${count} items)` : "Cart"}
        className="relative inline-flex items-center justify-center gap-2 h-8 rounded-none transition-transform duration-200 hover:scale-105"
        onClick={() => router.push("/cart")}
      >
        <ShoppingBag strokeWidth={1.5} className="h-5 w-5" />
        <span className="uppercase text-sm hidden md:inline">Cart</span>
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

const CATEGORY_LINKS = [
  { label: "WOMENS", href: "/womens" },
  { label: "MENS", href: "/mens" },
  { label: "JEWELLERY", href: "/jewellery" },
  { label: "DL PRIVE", href: "/dl-prive" },
  { label: "DL BERRY", href: "/dl-berry" },
  { label: "FRAGRANCE", href: "/fragrance" },
  { label: "NEW IN", href: "/new-in" },
];

export default function AnimatedNavbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header
        className="absolute top-4 left-[5%] right-[5%] z-[40] w-[90%] rounded-full bg-[#d9d9d9]/80 backdrop-blur-md text-black font-sans shadow-sm"
      >
        <div className="px-6 md:px-10 py-3 md:py-4">
          <nav aria-label="Primary" className="flex flex-col gap-4">
            {/* Top Row */}
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-start gap-4 sm:gap-6">
                <MenuDrawer
                  side="left"
                  trigger={
                    <button
                      type="button"
                      aria-label="Menu"
                      className="inline-flex h-8 items-center justify-center gap-2 transition-transform duration-200 hover:scale-105"
                    >
                      <MenuIcon strokeWidth={1.5} className="h-5 w-5" />
                      <span className="uppercase text-sm hidden sm:inline">Menu</span>
                    </button>
                  }
                />
                <button
                  type="button"
                  aria-label="Search"
                  onClick={() => setIsSearchOpen(true)}
                  className="inline-flex h-8 items-center justify-center gap-2 transition-transform duration-200 hover:scale-105"
                >
                  <Search strokeWidth={1.5} className="h-5 w-5" />
                  <span className="uppercase text-sm hidden sm:inline">Search</span>
                </button>
              </div>

              <div className="flex-1 flex justify-center">
                <Link href="/" className="block">
                  <Image
                    src="/logos/logo.svg"
                    alt="D' LAVÉN"
                    width={180}
                    height={44}
                    priority
                    className="h-10 sm:h-12 md:h-14 w-auto brightness-0"
                  />
                </Link>
              </div>

              <div className="flex-1 flex justify-end gap-4 sm:gap-6">
                <RightControls />
              </div>
            </div>

            {/* Bottom Row - Links */}
            <div className="hidden md:flex items-center justify-center gap-6 lg:gap-10">
              {CATEGORY_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm uppercase tracking-widest hover:text-gray-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
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
