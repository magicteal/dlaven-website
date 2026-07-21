import { Suspense } from "react";
import RegisterClient from "./RegisterClient";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen" style={{ backgroundColor: "#F6F4E6" }} />
      }
    >
      <RegisterClient />
    </Suspense>
  );
}
