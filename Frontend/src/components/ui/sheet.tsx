"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

const SheetTrigger = Dialog.Trigger;
const SheetClose = Dialog.Close;

// Animation duration in ms - should match CSS
const ANIMATION_DURATION = 400;

// Custom Sheet component that keeps content mounted during exit animation
function Sheet({ children, open, onOpenChange, ...props }: Dialog.DialogProps) {
  // Track whether we should keep the portal mounted
  const [mounted, setMounted] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    if (open) {
      // Opening: mount immediately
      setMounted(true);
      setIsClosing(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    } else if (mounted) {
      // Closing: set closing state and delay unmount
      setIsClosing(true);
      timeoutRef.current = setTimeout(() => {
        setMounted(false);
        setIsClosing(false);
        timeoutRef.current = null;
      }, ANIMATION_DURATION);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [open, mounted]);

  return (
    <SheetContext.Provider value={{ isOpen: open ?? false, isClosing }}>
      <Dialog.Root open={mounted} onOpenChange={onOpenChange} {...props}>
        {children}
      </Dialog.Root>
    </SheetContext.Provider>
  );
}

// Context to pass animation state to children
const SheetContext = React.createContext<{
  isOpen: boolean;
  isClosing: boolean;
}>({
  isOpen: false,
  isClosing: false,
});

function SheetPortal({
  className,
  children,
  ...props
}: Dialog.DialogPortalProps & { className?: string }) {
  return (
    <Dialog.Portal {...props}>
      <div className={cn("fixed inset-0 z-[1000] flex", className)}>
        {children}
      </div>
    </Dialog.Portal>
  );
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Dialog.Overlay>) {
  const { isOpen, isClosing } = React.useContext(SheetContext);
  const state = isClosing ? "closed" : isOpen ? "open" : "closed";

  return (
    <Dialog.Overlay
      data-state={state}
      className={cn(
        "fixed inset-0 z-[1000] bg-black/20 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      style={{ animationDuration: `${ANIMATION_DURATION}ms` }}
      {...props}
    />
  );
}

function SheetContent({
  className,
  side = "right",
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Dialog.Content> & {
  side?: "right" | "left" | "top" | "bottom";
}) {
  const { isOpen, isClosing } = React.useContext(SheetContext);
  const state = isClosing ? "closed" : isOpen ? "open" : "closed";

  const sideClasses = {
    right:
      "inset-y-0 right-0 h-full w-80 border-l border-gray-200 bg-white text-black data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
    left: "inset-y-0 left-0 h-full w-80 border-r border-gray-200 bg-white text-black data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
    top: "inset-x-0 top-0 h-1/3 w-full border-b border-gray-200 bg-white text-black data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
    bottom:
      "inset-x-0 bottom-0 h-1/3 w-full border-t border-gray-200 bg-white text-black data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
  } as const;

  return (
    <SheetPortal>
      <SheetOverlay />
      <Dialog.Content
        data-state={state}
        className={cn(
          "fixed z-[1001] grid gap-4 p-6 shadow-lg outline-none",
          sideClasses[side],
          className
        )}
        style={{ animationDuration: `${ANIMATION_DURATION}ms` }}
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
