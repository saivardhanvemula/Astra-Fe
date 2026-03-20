"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import WorkoutDay from "@/components/WorkoutDay";
import {
  getWorkoutPlans,
  assignWorkoutPlan,
} from "@/services/workoutService";
import { getMembers } from "@/services/adminService";
import type { WorkoutPlan, Member } from "@/types";

export default function AdminWorkoutsPage() {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Assign modal state
  const [assignPlanId, setAssignPlanId] = useState<string | null>(null);
  const [assignMemberId, setAssignMemberId] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [assignSuccess, setAssignSuccess] = useState<string | null>(null);
  const [assignError, setAssignError] = useState<string | null>(null);

  // Expanded plan
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getWorkoutPlans(), getMembers()])
      .then(([p, m]) => {
        setPlans(p);
        setMembers(m);
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load.")
      )
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    // eslint-disable-next-line no-console
    console.warn("Delete endpoint not available", id);
  }

  async function handleAssign() {
    if (!assignPlanId || !assignMemberId) return;
    setAssigning(true);
    setAssignError(null);
    setAssignSuccess(null);
    try {
      await assignWorkoutPlan({ plan_id: assignPlanId, member_id: assignMemberId });
      const plan = plans.find((p) => p.id === assignPlanId);
      const member = members.find((m) => m.id === assignMemberId);
      setAssignSuccess(
        `"${plan?.name}" assigned to ${member?.name ?? "member"}.`
      );
      setAssignMemberId("");
    } catch (err) {
      setAssignError(err instanceof Error ? err.message : "Failed to assign.");
    } finally {
      setAssigning(false);
    }
  }

  return (
    <AdminShell>
      {/* Heading */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[#E50914] text-[10px] font-black tracking-[0.3em] uppercase mb-2">
            Admin
          </p>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Workout Plans
          </h1>
        </div>
        <Link
          href="/admin/workouts/create"
          className="bg-[#E50914] hover:bg-[#C20812] text-white text-[10px] font-black tracking-[0.2em] uppercase px-5 py-3 transition-colors duration-200 whitespace-nowrap"
        >
          + Create Plan
        </Link>
      </div>

      {/* Plans */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-[#111111] border border-[#2A2A2A] animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-[#111111] border border-[#2A2A2A] p-8 text-center">
          <p className="text-[#E50914] text-[10px] font-black tracking-[0.2em] uppercase">{error}</p>
        </div>
      ) : plans.length === 0 ? (
        <div className="bg-[#111111] border border-[#2A2A2A] p-16 text-center">
          <p className="text-[#333] text-[10px] font-black tracking-[0.2em] uppercase mb-4">
            No workout plans yet
          </p>
          <Link
            href="/admin/workouts/create"
            className="text-[#E50914] hover:text-white text-[10px] font-black tracking-[0.2em] uppercase transition-colors duration-200"
          >
            Create Your First Plan →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {plans.map((plan) => {
            const expanded = expandedId === plan.id;
            return (
              <div key={plan.id} className="bg-[#111111] border border-[#2A2A2A]">
                {/* Plan row */}
                <div className="flex items-center justify-between px-6 py-5">
                  <div>
                    <p className="text-white font-black text-lg">{plan.name}</p>
                    <p className="text-[#555] text-[10px] font-black tracking-[0.15em] uppercase mt-0.5">
                      {plan.days.length} day{plan.days.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        setExpandedId(expanded ? null : plan.id)
                      }
                      className="border border-[#2A2A2A] hover:border-[#E50914] text-[#555] hover:text-[#E50914] text-[9px] font-black tracking-[0.15em] uppercase px-3 py-2 transition-colors duration-200"
                    >
                      {expanded ? "Collapse" : "View"}
                    </button>
                    <button
                      onClick={() => {
                        setAssignPlanId(plan.id);
                        setAssignSuccess(null);
                        setAssignError(null);
                      }}
                      className="border border-[#2A2A2A] hover:border-[#22c55e] text-[#555] hover:text-[#22c55e] text-[9px] font-black tracking-[0.15em] uppercase px-3 py-2 transition-colors duration-200"
                    >
                      Assign
                    </button>
                    <button
                      onClick={() => handleDelete(plan.id)}
                      className="border border-[#2A2A2A] hover:border-[#E50914] text-[#333] hover:text-[#E50914] text-[9px] font-black tracking-[0.15em] uppercase px-3 py-2 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Expanded days */}
                {expanded && (
                  <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-[#1A1A1A] pt-5">
                    {plan.days.map((day) => (
                      <WorkoutDay key={day.id ?? day.day_number} day={day} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Assign modal */}
      {assignPlanId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#111111] border border-[#2A2A2A] p-8 w-full max-w-sm">
            <p className="text-[#E50914] text-[10px] font-black tracking-[0.3em] uppercase mb-2">
              Assign Plan
            </p>
            <h2 className="text-white font-black text-xl mb-6">
              {plans.find((p) => p.id === assignPlanId)?.name}
            </h2>

            <label className="text-[#555] text-[9px] font-black tracking-[0.2em] uppercase block mb-2">
              Select Member
            </label>
            <select
              value={assignMemberId}
              onChange={(e) => setAssignMemberId(e.target.value)}
              className="w-full bg-[#0B0B0B] border border-[#2A2A2A] focus:border-[#E50914] text-white text-sm px-4 py-3 outline-none mb-6"
            >
              <option value="">— Choose member —</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>

            {assignSuccess && (
              <p className="text-[#22c55e] text-[9px] font-black tracking-[0.15em] uppercase mb-4">
                {assignSuccess}
              </p>
            )}
            {assignError && (
              <p className="text-[#E50914] text-[9px] font-black tracking-[0.15em] uppercase mb-4">
                {assignError}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleAssign}
                disabled={assigning || !assignMemberId}
                className="flex-1 bg-[#E50914] hover:bg-[#C20812] text-white text-[9px] font-black tracking-[0.2em] uppercase py-3 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {assigning ? "Assigning…" : "Assign"}
              </button>
              <button
                onClick={() => setAssignPlanId(null)}
                className="flex-1 border border-[#2A2A2A] hover:border-[#555] text-[#555] hover:text-white text-[9px] font-black tracking-[0.2em] uppercase py-3 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
