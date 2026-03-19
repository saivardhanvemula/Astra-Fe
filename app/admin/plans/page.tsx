"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/AdminShell";
import PlanForm from "@/components/PlanForm";
import { getAdminPlans } from "@/services/adminService";
import type { AdminPlan } from "@/types";

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<AdminPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    getAdminPlans()
      .then(setPlans)
      .catch(() => setError("Failed to load plans."))
      .finally(() => setLoading(false));
  }, []);

  function handlePlanCreated(plan: AdminPlan) {
    setPlans((prev) => [plan, ...prev]);
    setToast(`Plan "${plan.name}" created!`);
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <AdminShell>
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#052e16] border border-[#22c55e]/40 text-[#22c55e] text-[11px] font-black tracking-[0.2em] uppercase px-5 py-3 shadow-lg">
          {toast}
        </div>
      )}

      <div className="mb-8">
        <p className="text-[#E50914] text-[10px] font-black tracking-[0.3em] uppercase mb-2">
          Admin
        </p>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
          Membership Plans
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Create Plan form */}
        <div className="lg:col-span-2">
          <div className="bg-[#111111] border border-[#2A2A2A] p-6">
            <p className="text-[#555] text-[10px] font-black tracking-[0.2em] uppercase mb-5">
              New Plan
            </p>
            <PlanForm onCreated={handlePlanCreated} />
          </div>
        </div>

        {/* Plans list */}
        <div className="lg:col-span-3">
          <div className="bg-[#111111] border border-[#2A2A2A]">
            <div className="border-b border-[#2A2A2A] px-5 py-3 flex items-center justify-between">
              <p className="text-[#555] text-[10px] font-black tracking-[0.2em] uppercase">
                All Plans
              </p>
              <span className="text-[#444] text-[10px] font-black">
                {loading ? "…" : `${plans.length} total`}
              </span>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <p className="text-[#444] text-sm animate-pulse">
                  Loading plans...
                </p>
              </div>
            ) : error ? (
              <div className="p-6">
                <p className="text-[#E50914] text-sm">{error}</p>
              </div>
            ) : plans.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-[#444] text-sm">
                  No plans yet. Create one.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#1A1A1A]">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className="px-5 py-4 flex items-center justify-between hover:bg-[#0e0e0e] transition-colors duration-150"
                  >
                    <div>
                      <p className="font-black text-white text-sm uppercase tracking-wide">
                        {plan.name}
                      </p>
                      <p className="text-[#555] text-[11px] mt-0.5">
                        {plan.duration_days} days
                      </p>
                    </div>
                    <p className="text-[#E50914] font-black text-lg">
                      ₹{plan.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
