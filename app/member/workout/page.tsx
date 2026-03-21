"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getMyWorkout, completeWorkout } from "@/services/workoutService";
import { getStoredUser } from "@/utils/auth";
import type { MemberWorkout } from "@/types";

export default function MemberWorkoutPage() {
  const [workout, setWorkout] = useState<MemberWorkout | null>(null);
  const [memberId, setMemberId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [notAssigned, setNotAssigned] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [completeSuccess, setCompleteSuccess] = useState(false);
  const [nextDay, setNextDay] = useState<number | null>(null);
  const [completeError, setCompleteError] = useState<string | null>(null);

  useEffect(() => {
    const user = getStoredUser();
    const uid: string = user?.member_id ?? user?.id ?? "";
    setMemberId(uid);
    if (!uid) {
      setNotAssigned(true);
      setLoading(false);
      return;
    }
    getMyWorkout(uid)
      .then((data) => setWorkout(data))
      .catch(() => setNotAssigned(true))
      .finally(() => setLoading(false));
  }, []);

  async function handleComplete() {
    if (!memberId) return;
    setCompleting(true);
    setCompleteError(null);
    setCompleteSuccess(false);
    try {
      const result = await completeWorkout(memberId);
      setNextDay(result.next_day);
      setCompleteSuccess(true);
      // Refresh workout data
      const updated = await getMyWorkout(memberId);
      setWorkout(updated);
    } catch (err) {
      setCompleteError(
        err instanceof Error ? err.message : "Failed to mark complete."
      );
    } finally {
      setCompleting(false);
    }
  }

  return (
    <ProtectedRoute allowedRole="member">
      <div className="min-h-screen bg-[#0B0B0B] text-white px-4 py-10 sm:px-8 sm:py-14">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-10">
            <div>
              <p className="text-[#E50914] text-[10px] font-black tracking-[0.3em] uppercase mb-2">
                My Training
              </p>
              <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
                Workout Plan
              </h1>
            </div>
            <Link
              href="/member/dashboard"
              className="text-[#555] hover:text-white text-[9px] font-black tracking-[0.2em] uppercase mt-1 transition-colors duration-200"
            >
              ← Back
            </Link>
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-[#111111] border border-[#2A2A2A] animate-pulse"
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
                Ask your trainer or admin to assign a plan.
              </p>
              <Link
                href="/contact"
                className="text-[#E50914] hover:text-white text-[10px] font-black tracking-[0.2em] uppercase transition-colors duration-200"
              >
                Contact Us →
              </Link>
            </div>
          )}

          {/* Workout content */}
          {!loading && workout && (
            <>
              {/* Day header card */}
              <div className="bg-[#111111] border border-[#E50914] px-6 py-5 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#E50914] flex items-center justify-center text-white font-black text-xl shrink-0">
                    {workout.day}
                  </div>
                  <div>
                    <p className="text-[#E50914] text-[9px] font-black tracking-[0.2em] uppercase mb-0.5">
                      Day {workout.day}
                    </p>
                    <p className="text-white font-black text-2xl">{workout.title}</p>
                  </div>
                </div>
              </div>

              {/* Success / error banners */}
              {completeSuccess && (
                <div className="border border-[#22c55e]/30 bg-[#22c55e]/5 px-5 py-4 mb-6">
                  <p className="text-[#22c55e] text-[10px] font-black tracking-[0.2em] uppercase">
                    Workout done! Next up: Day {nextDay} 💪
                  </p>
                </div>
              )}
              {completeError && (
                <div className="border border-[#E50914] bg-[#E50914]/5 px-5 py-4 mb-6">
                  <p className="text-[#E50914] text-[9px] font-black tracking-[0.15em] uppercase">
                    {completeError}
                  </p>
                </div>
              )}

              {/* Exercises list */}
              <div className="bg-[#111111] border border-[#2A2A2A] mb-8">
                <div className="px-6 py-4 border-b border-[#1A1A1A]">
                  <p className="text-[#555] text-[9px] font-black tracking-[0.2em] uppercase">
                    {workout.exercises.length} Exercise{workout.exercises.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="divide-y divide-[#1A1A1A]">
                  {workout.exercises.map((ex, i) => (
                    <div key={i} className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <p className="text-white font-black">{ex.name}</p>
                        <p className="text-[#555] text-[9px] font-black tracking-[0.1em] uppercase mt-0.5">
                          {ex.muscle_group}
                        </p>
                      </div>
                      <div className="text-right shrink-0 ml-6">
                        <p className="text-white font-black text-sm">
                          {ex.sets} <span className="text-[#333]">×</span> {ex.reps}
                        </p>
                        <p className="text-[#333] text-[8px] font-black tracking-[0.15em] uppercase mt-0.5">
                          sets × reps
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Complete button */}
              <button
                onClick={handleComplete}
                disabled={completing}
                className="w-full sm:w-auto bg-[#E50914] hover:bg-[#C20812] text-white text-[10px] font-black tracking-[0.2em] uppercase px-10 py-4 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {completing ? "Saving…" : "Mark as Complete"}
              </button>

              {/* Log workout / history links — hidden until feature is ready
              <div className="flex flex-wrap gap-3 mt-4">
                <Link
                  href="/member/workout/log"
                  className="bg-[#111111] border border-[#2A2A2A] hover:border-[#E50914] text-[#888] hover:text-[#E50914] text-[9px] font-black tracking-[0.2em] uppercase px-5 py-3 transition-colors duration-200"
                >
                  Log Workout →
                </Link>
                <Link
                  href="/member/workout/history"
                  className="bg-[#111111] border border-[#2A2A2A] hover:border-[#E50914] text-[#888] hover:text-[#E50914] text-[9px] font-black tracking-[0.2em] uppercase px-5 py-3 transition-colors duration-200"
                >
                  View History →
                </Link>
              </div>
              */}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

