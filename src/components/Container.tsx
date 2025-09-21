import * as React from "react";
import { cn } from "@/lib/utils";

type ContainerProps = {
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
};

export default function Container({ as: Comp = "div", className, children }: ContainerProps) {
  return (
    <Comp className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </Comp>
  );
}
