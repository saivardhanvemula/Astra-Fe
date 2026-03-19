"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import MemberForm, { type MemberFormValues } from "@/components/MemberForm";
import { getAdminPlans, createMember } from "@/services/adminService";
import type { AdminPlan } from "@/types";

export default function AddMemberPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<AdminPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    getAdminPlans()
      .then(setPlans)
      .catch(() => setError("Failed to load plans. Please refresh."))
      .finally(() => setPlansLoading(false));
  }, []);

  async function handleSubmit(data: MemberFormValues) {
    setSubmitting(true);
    setError(null);
    try {
      await createMember(data);
      setToast("Member added successfully!");
      setTimeout(() => router.push("/admin/members"), 1200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add member.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AdminShell>
      {/* Success toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#052e16] border border-[#22c55e]/40 text-[#22c55e] text-[11px] font-black tracking-[0.2em] uppercase px-5 py-3 shadow-lg">
          {toast}
        </div>
      )}

      {/* Breadcrumb + heading */}
      <div className="mb-8">
        <p className="text-[#555] text-[10px] font-black tracking-[0.2em] uppercase mb-2">
          <Link
            href="/admin/members"
            className="hover:text-[#888] transition-colors"
          >
            Members
          </Link>{" "}
          / Add
        </p>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
          Add Member
        </h1>
      </div>

      <div className="max-w-lg">
        <div className="bg-[#111111] border border-[#2A2A2A] p-6">
          {error && (
            <div className="bg-[#E50914]/10 border border-[#E50914]/40 text-[#E50914] text-xs px-4 py-3 tracking-wide mb-5">
              {error}
            </div>
          )}
          {plansLoading ? (
            <p className="text-[#444] text-sm animate-pulse text-center py-10">
              Loading plans...
            </p>
          ) : (
            <MemberForm
              plans={plans}
              onSubmit={handleSubmit}
              loading={submitting}
            />
          )}
        </div>
      </div>
    </AdminShell>
  );
}
