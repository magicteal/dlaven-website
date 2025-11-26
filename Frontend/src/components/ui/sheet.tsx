"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

const Sheet = Dialog.Root;
const SheetTrigger = Dialog.Trigger;
const SheetClose = Dialog.Close;

function SheetPortal({ className, children, ...props }: Dialog.DialogPortalProps & { className?: string }) {
  return (
    <Dialog.Portal {...props}>
      <div className={cn("fixed inset-0 z-40 flex", className)}>{children}</div>
    </Dialog.Portal>
  );
}

function SheetOverlay({ className, ...props }: React.ComponentPropsWithoutRef<typeof Dialog.Overlay>) {
  return (
    <Dialog.Overlay
      className={cn(
        "fixed inset-0 z-40 bg-black/20 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  );
}

function SheetContent({ className, side = "right", children, ...props }: React.ComponentPropsWithoutRef<typeof Dialog.Content> & { side?: "right" | "left" | "top" | "bottom" }) {
  const sideClasses = {
    right:
      "inset-y-0 right-0 h-full w-80 border-l border-gray-200 bg-white text-black data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
    left:
      "inset-y-0 left-0 h-full w-80 border-r border-gray-200 bg-white text-black data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
    top:
      "inset-x-0 top-0 h-1/3 w-full border-b border-gray-200 bg-white text-black data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
    bottom:
      "inset-x-0 bottom-0 h-1/3 w-full border-t border-gray-200 bg-white text-black data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
  } as const;

  return (
    <SheetPortal>
      <SheetOverlay />
      <Dialog.Content
        className={cn(
          "fixed z-50 grid gap-4 p-6 shadow-lg outline-none",
          sideClasses[side],
          className
        )}
        {...props}
      >
        {/* Accessible title for screen readers */}
        <Dialog.Title className="sr-only">Panel</Dialog.Title>
        {children}
      </Dialog.Content>
    </SheetPortal>
  );
}

export { Sheet, SheetTrigger, SheetClose, SheetContent };
