import * as React from "react";
import { cn } from "@/lib/utils";

type ContainerProps = {
  id?: string;
  className?: string;
  children: React.ReactNode;
};

export default function Container({ id, className, children }: ContainerProps) {
  return (
    <div id={id} className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}
