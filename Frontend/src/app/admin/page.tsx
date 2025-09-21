"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminHome() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "admin") router.replace("/");
      else router.replace("/admin/profile");
    }
  }, [loading, user, router]);

  return null;
}
