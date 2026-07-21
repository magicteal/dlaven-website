import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen" style={{ backgroundColor: "#F6F4E6" }} />
      }
    >
      <LoginClient />
    </Suspense>
  );
}
