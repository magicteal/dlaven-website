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
        className="inline-flex items-center justify-center gap-1.5 h-7 rounded-none transition-colors duration-200 hover:text-black/60"
        onClick={goAccount}
      >
        <UserIcon strokeWidth={1.25} className="h-[18px] w-[18px]" />
        <span className="uppercase text-xs tracking-wide hidden md:inline">Account</span>
      </button>
      <button
        aria-label={count > 0 ? `Cart (${count} items)` : "Cart"}
        className="relative inline-flex items-center justify-center gap-1.5 h-7 rounded-none transition-colors duration-200 hover:text-black/60"
        onClick={() => router.push("/cart")}
      >
        <ShoppingBag strokeWidth={1.25} className="h-[18px] w-[18px]" />
        <span className="uppercase text-xs tracking-wide hidden md:inline">Cart</span>
        {count > 0 ? (
          <span
            className="absolute -top-1.5 -right-1.5 min-w-[15px] h-[15px] px-1 rounded-full bg-black text-white text-[9px] leading-[15px] text-center"
            aria-hidden
          >
            {count > 99 ? "99+" : count}
          </span>
        ) : null}
      </button>
    </>
  );
}

function SearchTrigger({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      aria-label="Search"
      onClick={onOpen}
      className="group inline-flex h-7 items-center justify-center gap-2 transition-colors duration-200 hover:text-black/60"
    >
      <Search strokeWidth={1.25} className="h-[18px] w-[18px]" />
      <span className="flex min-w-[110px] flex-col items-start text-left">
        <span className="text-sm tracking-wide leading-5">Search</span>
        <span className="mt-0.5 h-px w-full bg-black/70 transition-colors duration-200 group-hover:bg-black/40" />
      </span>
    </button>
  );
}

function MenuTrigger() {
  return (
    <MenuDrawer
      side="left"
      trigger={
        <button
          type="button"
          aria-label="Menu"
          className="inline-flex h-7 items-center justify-center gap-2 transition-colors duration-200 hover:text-black/60"
        >
          <MenuIcon strokeWidth={1.25} className="h-[18px] w-[18px]" />
          <span className="uppercase text-sm tracking-wide">Menu</span>
        </button>
      }
    />
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
        className="absolute top-1 left-1 right-1 z-[40] rounded-none bg-[#e2ddd7]/80 backdrop-blur-md text-black font-sans shadow-sm md:left-2 md:right-2"
      >
        <div className="px-5 py-3 md:px-8">
          <nav aria-label="Primary" className="flex flex-col gap-2.5">
            {/* Top Row */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
              <div className="flex items-center justify-start gap-5 sm:gap-7">
                <MenuTrigger />
                <div className="hidden sm:block">
                  <SearchTrigger onOpen={() => setIsSearchOpen(true)} />
                </div>
              </div>

              <div className="flex justify-center">
                <Link href="/" className="block">
                  <Image
                    src="/logos/logo.svg"
                    alt="D' LAVÉN"
                    width={180}
                    height={44}
                    priority
                    className="h-8 w-auto sm:h-9 md:h-10"
                  />
                </Link>
              </div>

              <div className="flex justify-end gap-5 sm:gap-7">
                <RightControls />
              </div>
            </div>

            {/* Bottom Row - Links */}
            <div className="hidden md:flex items-center justify-center gap-8 lg:gap-12">
              {CATEGORY_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-xs uppercase tracking-[0.15em] text-black/80 hover:text-black/50 transition-colors"
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
