import { Suspense } from "react";
import RegisterClient from "./RegisterClient";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-160px)] pt-32 pb-12 sm:pt-36 sm:pb-16" />
      }
    >
      <RegisterClient />
    </Suspense>
  );
}
