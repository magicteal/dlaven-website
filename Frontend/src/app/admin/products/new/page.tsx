import { connection } from "next/server";
import { Suspense } from "react";
import AdminNewProductPage from "./AdminNewProductsPage";

export default async function Page() {
  await connection();
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <AdminNewProductPage />
    </Suspense>
  );
}
