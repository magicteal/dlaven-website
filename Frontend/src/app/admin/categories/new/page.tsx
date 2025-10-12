"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminNewCategoryPage() {
  const router = useRouter();
  useEffect(() => {
    // Redirect to the fixed categories page
    router.replace("/admin/categories");
  }, [router]);
  return null;
}
