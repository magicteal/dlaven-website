"use client";

import React, { useState, useEffect } from "react";
import SearchOverlay from "@/components/SearchOverlay";
import MenuDrawer from "@/components/MenuDrawer";
import MegaMenu, { MegaMenuCategoryKey } from "@/components/MegaMenu";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  User as UserIcon,
  ShoppingBag,
  Menu as MenuIcon,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import { usePathname, useRouter } from "next/navigation";

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

function SearchTrigger({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-label="Search"
      onClick={onToggle}
      className="group inline-flex items-center gap-2 transition-colors duration-200 hover:text-black/60"
      data-state={isOpen ? "open" : "closed"}
    >
      <Search
        strokeWidth={1.25}
        className={`h-[17px] w-[17px] shrink-0 transition-transform duration-300 ${
          isOpen ? "rotate-90 scale-110" : "rotate-0 scale-100"
        }`}
      />
      <span className="text-sm tracking-wide leading-tight border-b border-black/40 group-hover:border-black/70 pb-0.5 font-normal">
        Search
      </span>
    </button>
  );
}

function MenuTrigger({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <MenuDrawer
      side="left"
      open={isOpen}
      onOpenChange={onOpenChange}
      trigger={
        <button
          type="button"
          aria-label="Menu"
          className="inline-flex h-7 items-center justify-center gap-2 transition-colors duration-200 hover:text-black/60"
          data-state={isOpen ? "open" : "closed"}
        >
          <MenuIcon
            strokeWidth={1.25}
            className={`h-[18px] w-[18px] transition-transform duration-300 ${
              isOpen ? "rotate-90" : "rotate-0"
            }`}
          />
          <span className="uppercase text-sm tracking-wide">
            Menu
          </span>
        </button>
      }
    />
  );
}

const CATEGORY_LINKS: { label: MegaMenuCategoryKey & string; href: string }[] = [
  { label: "WOMENS", href: "/womens-adornments" },
  { label: "MENS", href: "/mens-adornments" },
  { label: "JEWELLERY", href: "/heritage-jewelry" },
  { label: "DL PRIVE", href: "/dl-prive" },
  { label: "DL BERRY", href: "/dl-barry" },
  { label: "FRAGRANCE", href: "/fragrances" },
  { label: "NEW IN", href: "/products" },
];

export default function AnimatedNavbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMegaCategory, setActiveMegaCategory] = useState<MegaMenuCategoryKey>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const closeTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Clear timer when unmounting
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  // Track window scroll position to trigger sticky slim navbar
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 40;
      setIsScrolled(scrolled);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check on mount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close drop-down mega menu, drawer, and search overlay when page route changes
  useEffect(() => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setActiveMegaCategory(null);
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  // Close drop-down mega menu automatically when user scrolls down
  useEffect(() => {
    if (!activeMegaCategory) return;

    const handleScroll = () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      setActiveMegaCategory(null);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeMegaCategory]);

  // Menu, search, and mega-menu are mutually exclusive — opening one closes others.
  const handleMenuOpenChange = (open: boolean) => {
    setIsMenuOpen(open);
    if (open) {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      setIsSearchOpen(false);
      setActiveMegaCategory(null);
    }
  };

  const handleSearchToggle = () => {
    setIsSearchOpen((prev) => {
      const next = !prev;
      if (next) {
        if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
        setIsMenuOpen(false);
        setActiveMegaCategory(null);
      }
      return next;
    });
  };

  const handleCategoryMouseEnter = (cat: MegaMenuCategoryKey) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setActiveMegaCategory(cat);
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  };

  const handleHeaderMouseEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handleHeaderMouseLeave = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = setTimeout(() => {
      setActiveMegaCategory(null);
    }, 200);
  };

  const toggleMegaCategory = (cat: MegaMenuCategoryKey) => {
    setActiveMegaCategory((prev) => {
      const next = prev === cat ? null : cat;
      if (next) {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
      }
      return next;
    });
  };

  return (
    <>
      <header
        onMouseEnter={handleHeaderMouseEnter}
        onMouseLeave={handleHeaderMouseLeave}
        className={`fixed z-[40] rounded-none backdrop-blur-md text-black [font-family:var(--font-manrope)] shadow-sm transition-all duration-300 ease-in-out ${
          isScrolled
            ? "top-2 left-3 right-3 md:top-3 md:left-6 md:right-6 bg-[#F6F4E6] shadow-md border border-black/10"
            : isMenuOpen || isSearchOpen || activeMegaCategory
            ? "top-4 left-4 right-4 md:top-6 md:left-6 md:right-6 bg-[#F6F4E6] shadow-md border border-black/10"
            : "top-4 left-4 right-4 md:top-6 md:left-6 md:right-6 bg-[#F6F4E6]/30 backdrop-blur-md border border-transparent hover:bg-[#F6F4E6]/50"
        }`}
      >
        <div className={`transition-all duration-300 ${isScrolled ? "px-4 py-2 md:px-7 md:py-2.5" : "px-5 py-3 md:px-8 md:py-3.5"}`}>
          {!isScrolled ? (
            /* Unscrolled 2-row layout with center logo */
            <nav aria-label="Primary" className="flex flex-col gap-2.5 transition-all duration-300">
              {/* Top Row */}
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                <div className="flex items-center justify-start gap-5 sm:gap-7">
                  <MenuTrigger
                    isOpen={isMenuOpen}
                    onOpenChange={handleMenuOpenChange}
                  />
                  <div className="hidden sm:block">
                    <SearchTrigger
                      isOpen={isSearchOpen}
                      onToggle={handleSearchToggle}
                    />
                  </div>
                </div>

                <div className="flex justify-center">
                  <Link href="/" className="block" onClick={() => setActiveMegaCategory(null)}>
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

              {/* Bottom Row - Hermès-style Menu Categories */}
              <div className="hidden md:flex items-center justify-center gap-6 lg:gap-10">
                {CATEGORY_LINKS.map((link) => {
                  const isActive = activeMegaCategory === link.label;
                  return (
                    <button
                      key={link.label}
                      type="button"
                      onMouseEnter={() => handleCategoryMouseEnter(link.label)}
                      onClick={() => toggleMegaCategory(link.label)}
                      className={`inline-flex items-center gap-1 text-xs uppercase tracking-[0.15em] transition-all duration-300 py-1 border-b ${
                        isActive
                          ? "text-[#431717] border-[#431717] font-semibold"
                          : "text-black/80 border-transparent hover:text-black hover:border-black/40 font-normal"
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={`w-3 h-3 transition-transform duration-300 ${
                          isActive ? "rotate-180 text-[#431717]" : "rotate-0 text-black/50"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </nav>
          ) : (
            /* Scrolled Slim Single-Row Compact Bar (Hidden Logo, All Controls Inline) */
            <nav aria-label="Primary" className="flex items-center justify-between gap-4 transition-all duration-300">
              {/* Left: Menu & Search */}
              <div className="flex items-center justify-start gap-4 sm:gap-6 shrink-0">
                <MenuTrigger
                  isOpen={isMenuOpen}
                  onOpenChange={handleMenuOpenChange}
                />
                <div className="hidden sm:block">
                  <SearchTrigger
                    isOpen={isSearchOpen}
                    onToggle={handleSearchToggle}
                  />
                </div>
              </div>

              {/* Center: Inline Nav Category Links */}
              <div className="hidden md:flex items-center justify-center gap-4 lg:gap-8 flex-1">
                {CATEGORY_LINKS.map((link) => {
                  const isActive = activeMegaCategory === link.label;
                  return (
                    <button
                      key={link.label}
                      type="button"
                      onMouseEnter={() => handleCategoryMouseEnter(link.label)}
                      onClick={() => toggleMegaCategory(link.label)}
                      className={`inline-flex items-center gap-1 text-[11px] lg:text-xs uppercase tracking-[0.12em] lg:tracking-[0.15em] transition-all duration-200 py-0.5 border-b ${
                        isActive
                          ? "text-[#431717] border-[#431717] font-semibold"
                          : "text-black/80 border-transparent hover:text-black hover:border-black/40 font-normal"
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={`w-3 h-3 transition-transform duration-300 ${
                          isActive ? "rotate-180 text-[#431717]" : "rotate-0 text-black/50"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Right: Account & Cart */}
              <div className="flex items-center justify-end gap-4 sm:gap-6 shrink-0">
                <RightControls />
              </div>
            </nav>
          )}
        </div>

        {/* Hermès Dropdown Mega Menu */}
        <MegaMenu
          activeCategory={activeMegaCategory}
          onClose={() => setActiveMegaCategory(null)}
        />
      </header>

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
