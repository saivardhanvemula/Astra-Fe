"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Props {
  children: React.ReactNode;
  allowedRole?: "admin" | "member";
}

export default function ProtectedRoute({ children, allowedRole }: Props) {
  const { token, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // wait until localStorage has been checked
    if (!token) {
      router.replace("/login");
      return;
    }
    if (allowedRole && user?.role !== allowedRole) {
      router.replace(
        user?.role === "admin" ? "/admin/dashboard" : "/member/dashboard"
      );
    }
  }, [isLoading, token, user, allowedRole, router]);

  // Still reading localStorage — render nothing, don't redirect yet
  if (isLoading) return null;
  if (!token) return null;
  if (allowedRole && user?.role !== allowedRole) return null;

  return <>{children}</>;
}
