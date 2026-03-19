"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Props {
  children: React.ReactNode;
  allowedRole?: "admin" | "member";
}

export default function ProtectedRoute({ children, allowedRole }: Props) {
  const { token, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.replace("/login");
      return;
    }
    if (allowedRole && user?.role !== allowedRole) {
      router.replace(
        user?.role === "admin" ? "/admin/dashboard" : "/member/dashboard"
      );
    }
  }, [token, user, allowedRole, router]);

  if (!token) return null;
  if (allowedRole && user?.role !== allowedRole) return null;

  return <>{children}</>;
}
