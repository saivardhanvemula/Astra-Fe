"use client";

import Link from "next/link";
import type { MemberWorkout } from "@/types";

interface Props {
  workout: MemberWorkout | null;
  loading: boolean;
  error?: boolean;
}

const MUSCLE_COLOR: Record<string, string> = {
  chest: "text-[#E50914]",
  back: "text-[#3b82f6]",
  legs: "text-[#22c55e]",
  shoulders: "text-[#f59e0b]",
  arms: "text-[#a855f7]",
  biceps: "text-[#a855f7]",
  triceps: "text-[#ec4899]",
  abs: "text-[#f97316]",
  core: "text-[#f97316]",
  cardio: "text-[#06b6d4]",
};

function muscleColor(group: string): string {
  return MUSCLE_COLOR[group?.toLowerCase()] ?? "text-[#555]";
}

export default function TodayWorkout({ workout, loading, error }: Props) {
  const MAX_VISIBLE = 4;

  return (
    <div className="bg-[#111111] border border-[#2A2A2A] p-6 flex flex-col h-full">
      {/* Label */}
      <p className="text-[10px] font-black tracking-[0.2em] uppercase text-[#555] mb-4">
        Today&apos;s Workout
      </p>

      {loading && (
        <div className="flex-1 space-y-3 animate-pulse">
          <div className="h-6 w-32 bg-[#1A1A1A]" />
          <div className="h-4 w-48 bg-[#1A1A1A]" />
          <div className="space-y-2 mt-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 bg-[#1A1A1A]" />
            ))}
          </div>
        </div>
      )}

      {!loading && (error || !workout) && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 border border-dashed border-[#2A2A2A] py-8">
          <p className="text-[#333] text-[10px] font-black tracking-[0.2em] uppercase">
            No workout assigned
          </p>
          <p className="text-[#444] text-xs text-center">
            Ask your trainer to assign a plan.
          </p>
        </div>
      )}

      {!loading && workout && (
        <>
          {/* Day header */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#E50914] text-[9px] font-black tracking-[0.2em] uppercase">
                Day {workout.day}
              </span>
              <span className="text-[#333] text-[9px]">—</span>
            </div>
            <p className="text-white font-black text-xl uppercase tracking-tight">
              {workout.title}
            </p>
          </div>

          {/* Exercise list */}
          <div className="flex-1 space-y-2 mb-5">
            {workout.exercises.slice(0, MAX_VISIBLE).map((ex, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-[#0D0D0D] border border-[#1A1A1A] px-3 py-2.5"
              >
                <div>
                  <p className="text-white text-sm font-bold leading-tight">
                    {ex.name}
                  </p>
                  <p
                    className={`text-[9px] font-black tracking-[0.1em] uppercase mt-0.5 ${muscleColor(
                      ex.muscle_group
                    )}`}
                  >
                    {ex.muscle_group}
                  </p>
                </div>
                <span className="text-[#E50914] font-black text-sm shrink-0 ml-3">
                  {ex.sets}
                  <span className="text-[#333]"> × </span>
                  {ex.reps}
                </span>
              </div>
            ))}

            {workout.exercises.length > MAX_VISIBLE && (
              <p className="text-[#444] text-[9px] font-black tracking-[0.15em] uppercase px-1">
                +{workout.exercises.length - MAX_VISIBLE} more exercise
                {workout.exercises.length - MAX_VISIBLE !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* CTA */}
          <Link
            href="/member/workout"
            className="block text-center bg-[#E50914] hover:bg-[#C20812] text-white text-[10px] font-black tracking-[0.25em] uppercase px-6 py-3 transition-colors duration-200"
          >
            Start Workout →
          </Link>
        </>
      )}
    </div>
  );
}
