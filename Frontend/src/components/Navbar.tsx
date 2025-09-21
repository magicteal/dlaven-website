"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import MenuDrawer from "@/components/MenuDrawer";
import { ShoppingBag, Search, Menu, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import Container from "@/components/Container";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";

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

function Avatar({ label, title }: { label: string; title?: string }) {
  return (
    <div
      className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-medium uppercase"
      aria-label={title || "Account"}
      title={title}
    >
      {label}
    </div>
  );
}

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
      <span>Contact Us</span>
    </Link>
  );
}

function RightControls() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const initials = React.useMemo(() => {
    const n = user?.name?.trim();
    if (n) {
      const parts = n.split(/\s+/).filter(Boolean);
      const first = parts[0]?.[0] || "";
      const second = parts[1]?.[0] || "";
      return (first + second).toUpperCase() || first.toUpperCase();
    }
    const email = user?.email || "";
    const local = email.split("@")[0] || "";
    return (local.slice(0, 2) || "U").toUpperCase();
  }, [user]);
  return (
    <>
      <IconButton aria-label="Cart">
        <ShoppingBag className="h-5 w-5" />
      </IconButton>
      {user && (
        <>
          <Link href={user.role === "admin" ? "/admin" : "/auth/me"} className="hidden sm:inline-flex items-center gap-2 px-2 text-sm text-black/80 hover:text-black">
            <Avatar label={initials} title={user.name || user.email} />
          </Link>
          <Button
            variant="ghost"
            className="rounded-none h-9 px-2 sm:px-3 text-sm"
            aria-label="Logout"
            onClick={async () => {
              try { await logout(); } catch {}
              router.push("/");
            }}
            disabled={loading}
          >
            Logout
          </Button>
        </>
      )}
      <IconButton aria-label="Search" className="hidden sm:inline-flex">
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
            <span className="hidden sm:inline text-sm whitespace-nowrap">MENU</span>
          </Button>
        }
      />
    </>
  );
}

// --- Organism: Navbar ---
export default function Navbar() {
  const { user, loading } = useAuth();
  return (
    // This is the key change: fixed, top-0, z-50, w-full, and background styles
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
              
              {/* Show Login/Register only when logged out */}
              {!user && !loading && (
                <>
                  <Link href="/auth/login" className="hidden sm:inline text-xs uppercase tracking-wider text-black/70 hover:text-black">Login</Link>
                  <Link href="/auth/register" className="hidden sm:inline text-xs uppercase tracking-wider text-black/70 hover:text-black">Register</Link>
                </>
              )}
              
              <RightControls />
            </div>
          </div>
        </div>
        </nav>
      </Container>
    </header>
  );
}
