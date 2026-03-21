"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProgressChart from "@/components/ProgressChart";
import { getWorkoutHistory } from "@/services/workoutLog";
import type { WorkoutLogEntry } from "@/services/workoutLog";

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function fmtTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "";
  }
}

export default function WorkoutHistoryPage() {
  const [logs, setLogs] = useState<WorkoutLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Track which exercise is expanded (sets + chart): key = `${logId}-${exerciseIndex}`
  const [openExercise, setOpenExercise] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    getWorkoutHistory()
      .then(setLogs)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load history.")
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function toggleExercise(key: string) {
    setOpenExercise((prev) => (prev === key ? null : key));
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
                Workout History
              </h1>
            </div>
            <div className="flex flex-col items-end gap-2 mt-1">
              <Link
                href="/member/workout/log"
                className="bg-[#E50914] hover:bg-[#C20812] text-white text-[9px] font-black tracking-[0.2em] uppercase px-4 py-2 transition-colors duration-200"
              >
                + Log Workout
              </Link>
              <Link
                href="/member/workout"
                className="text-[#555] hover:text-white text-[9px] font-black tracking-[0.2em] uppercase transition-colors duration-200"
              >
                ← Plan
              </Link>
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <div className="border border-[#E50914] bg-[#1f0a0a] px-5 py-4 flex items-center justify-between gap-4 mb-6">
              <p className="text-[#E50914] text-sm font-semibold">{error}</p>
              <button
                onClick={load}
                className="text-[10px] font-black tracking-[0.15em] uppercase text-[#E50914] hover:text-white transition-colors duration-200 whitespace-nowrap"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-36 bg-[#111111] border border-[#2A2A2A] animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && logs.length === 0 && (
            <div className="bg-[#111111] border border-[#2A2A2A] p-16 text-center">
              <p className="text-[#333] text-[10px] font-black tracking-[0.2em] uppercase mb-3">
                No workouts logged yet
              </p>
              <p className="text-[#555] text-xs mb-6">
                Start logging to build your history.
              </p>
              <Link
                href="/member/workout/log"
                className="text-[#E50914] hover:text-white text-[10px] font-black tracking-[0.2em] uppercase transition-colors duration-200"
              >
                Log First Workout →
              </Link>
            </div>
          )}

          {/* Log entries */}
          {!loading && logs.length > 0 && (
            <div className="space-y-6">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="bg-[#111111] border border-[#2A2A2A] overflow-hidden"
                >
                  {/* Log header */}
                  <div className="px-5 py-4 border-b border-[#1A1A1A] flex items-center justify-between">
                    <div>
                      <p className="text-white font-black text-sm">
                        Day {log.workout_day} — {log.day_title}
                      </p>
                      <p className="text-[#555] text-[9px] font-black tracking-[0.15em] uppercase mt-0.5">
                        {fmtDate(log.logged_at)} · {fmtTime(log.logged_at)}
                      </p>
                    </div>
                    <span className="text-[#333] text-[9px] font-black tracking-[0.15em] uppercase shrink-0 ml-4">
                      {(log.exercises ?? []).length} exercise{(log.exercises ?? []).length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Exercises */}
                  <div className="divide-y divide-[#1A1A1A]">
                    {(log.exercises ?? []).map((ex, ei) => {
                      const exKey = `${log.id}-${ei}`;
                      const chartId = ex.exercise_id ?? ex.exercise_name;
                      const isOpen = openExercise === exKey;
                      const loggedSets = ex.sets ?? [];
                      const setCount = loggedSets.length;
                      const repRef = loggedSets[0]?.reps ?? "—";

                      return (
                        <div key={ei}>
                          {/* Clickable exercise header — collapsed by default */}
                          <button
                            type="button"
                            onClick={() => toggleExercise(exKey)}
                            className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-[#161616] transition-colors duration-150"
                          >
                            {/* Left: name + muscle */}
                            <div>
                              <p className="text-white font-black text-sm">{ex.exercise_name}</p>
                              {ex.muscle_group && (
                                <p className="text-[#555] text-[9px] font-black tracking-[0.1em] uppercase mt-0.5">
                                  {ex.muscle_group}
                                </p>
                              )}
                            </div>

                            {/* Right: sets×reps + chevron */}
                            <div className="flex items-center gap-4 ml-4 shrink-0">
                              <div className="text-right">
                                <p className="text-[#E50914] font-black text-sm">
                                  {setCount} <span className="text-[#333]">×</span> {repRef}
                                </p>
                                <p className="text-[#333] text-[8px] font-black tracking-[0.15em] uppercase mt-0.5">
                                  sets × reps
                                </p>
                              </div>
                              <span
                                className={`text-[#444] text-xs transition-transform duration-200 ${
                                  isOpen ? "rotate-180" : ""
                                }`}
                              >
                                ▾
                              </span>
                            </div>
                          </button>

                          {/* Expanded: set badges + progress chart */}
                          {isOpen && (
                            <div className="border-t border-[#1A1A1A] bg-[#0D0D0D]">
                              {/* Set badges */}
                              <div className="px-5 pt-3 pb-3 flex flex-wrap gap-2">
                                {loggedSets.map((s) => (
                                  <span
                                    key={s.set_number}
                                    className="bg-[#1A1A1A] border border-[#2A2A2A] px-3 py-1.5 text-[9px] font-black tracking-[0.1em] text-[#aaa]"
                                  >
                                    <span className="text-[#555] mr-1">S{s.set_number}</span>
                                    {s.weight}kg × {s.reps}
                                  </span>
                                ))}
                              </div>
                              {/* Progress chart */}
                              <div className="px-4 pb-4">
                                <ProgressChart
                                  exerciseId={chartId}
                                  exerciseName={ex.exercise_name}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
