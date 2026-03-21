"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import WorkoutLogger from "@/components/WorkoutLogger";
import { getMyWorkout } from "@/services/workoutService";
import { getStoredUser } from "@/utils/auth";
import type { MemberWorkout } from "@/types";

export default function WorkoutLogPage() {
  const router = useRouter();
  const [workout, setWorkout] = useState<MemberWorkout | null>(null);
  const [loading, setLoading] = useState(true);
  const [notAssigned, setNotAssigned] = useState(false);
  const [loggedSuccess, setLoggedSuccess] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    const uid: string = user?.member_id ?? user?.id ?? "";
    if (!uid) {
      setNotAssigned(true);
      setLoading(false);
      return;
    }
    getMyWorkout(uid)
      .then(setWorkout)
      .catch(() => setNotAssigned(true))
      .finally(() => setLoading(false));
  }, []);

  function handleSuccess() {
    setLoggedSuccess(true);
    setTimeout(() => router.push("/member/workout/history"), 1800);
  }

  return (
    <ProtectedRoute allowedRole="member">
      <div className="min-h-screen bg-[#0B0B0B] text-white px-4 py-10 sm:px-8 sm:py-14">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="flex items-start justify-between mb-10">
            <div>
              <p className="text-[#E50914] text-[10px] font-black tracking-[0.3em] uppercase mb-2">
                My Training
              </p>
              <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
                Log Workout
              </h1>
            </div>
            <div className="flex flex-col items-end gap-2 mt-1">
              <Link
                href="/member/workout"
                className="text-[#555] hover:text-white text-[9px] font-black tracking-[0.2em] uppercase transition-colors duration-200"
              >
                ← Plan
              </Link>
              <Link
                href="/member/workout/history"
                className="text-[#555] hover:text-white text-[9px] font-black tracking-[0.2em] uppercase transition-colors duration-200"
              >
                History →
              </Link>
            </div>
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-40 bg-[#111111] border border-[#2A2A2A] animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Not assigned */}
          {!loading && notAssigned && (
            <div className="bg-[#111111] border border-[#2A2A2A] p-16 text-center">
              <p className="text-[#333] text-[10px] font-black tracking-[0.2em] uppercase mb-3">
                No workout plan assigned
              </p>
              <p className="text-[#555] text-xs mb-6">
                Ask your trainer or admin to assign a plan before logging.
              </p>
              <Link
                href="/member/workout"
                className="text-[#E50914] hover:text-white text-[10px] font-black tracking-[0.2em] uppercase transition-colors duration-200"
              >
                View Plan →
              </Link>
            </div>
          )}

          {/* Redirect success banner */}
          {loggedSuccess && (
            <div className="mb-6 border border-[#22c55e]/30 bg-[#22c55e]/5 px-5 py-4">
              <p className="text-[#22c55e] text-[10px] font-black tracking-[0.2em] uppercase">
                Workout Logged 💪 — Redirecting to history…
              </p>
            </div>
          )}

          {/* Day header + logger */}
          {!loading && workout && !loggedSuccess && (
            <>
              {/* Day context card */}
              <div className="bg-[#111111] border border-[#E50914] px-6 py-5 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#E50914] flex items-center justify-center text-white font-black text-xl shrink-0">
                    {workout.day}
                  </div>
                  <div>
                    <p className="text-[#E50914] text-[9px] font-black tracking-[0.2em] uppercase mb-0.5">
                      Day {workout.day}
                    </p>
                    <p className="text-white font-black text-xl">{workout.title}</p>
                  </div>
                </div>
              </div>

              {/* Helper copy */}
              <p className="text-[#444] text-xs mb-6">
                Enter the weight you lifted for each set. Reps are pre-filled from your plan — adjust if needed.
              </p>

              <WorkoutLogger workout={workout} onSuccess={handleSuccess} />
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
