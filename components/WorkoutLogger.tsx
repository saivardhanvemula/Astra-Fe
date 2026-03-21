"use client";

import { useState, useEffect } from "react";
import ExerciseInput from "@/components/ExerciseInput";
import { logWorkout } from "@/services/workoutLog";
import type { WorkoutLogPayload, SetLog } from "@/services/workoutLog";
import type { MemberWorkout } from "@/types";

interface Props {
  workout: MemberWorkout;
  /** Called after a successful log so the parent can react (e.g. redirect). */
  onSuccess: () => void;
}

function buildInitialSets(sets: number, defaultReps: string): SetLog[] {
  const repCount = parseInt(defaultReps, 10);
  return Array.from({ length: sets }, (_, i) => ({
    set_number: i + 1,
    weight: 0,
    reps: isNaN(repCount) ? 0 : repCount,
  }));
}

export default function WorkoutLogger({ workout, onSuccess }: Props) {
  const [exerciseSets, setExerciseSets] = useState<SetLog[][]>(() =>
    workout.exercises.map((ex) => buildInitialSets(ex.sets, ex.reps))
  );
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  // Re-initialise when the workout prop changes
  useEffect(() => {
    setExerciseSets(
      workout.exercises.map((ex) => buildInitialSets(ex.sets, ex.reps))
    );
  }, [workout]);

  function showToast(msg: string, type: "success" | "error") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload: WorkoutLogPayload = {
      workout_day: workout.day,
      day_title: workout.title,
      exercises: workout.exercises.map((ex, i) => ({
        exercise_name: ex.name,
        muscle_group: ex.muscle_group,
        sets: exerciseSets[i] ?? [],
      })),
    };

    setSubmitting(true);
    try {
      await logWorkout(payload);
      showToast("Workout Logged 💪", "success");
      onSuccess();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to save workout.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Exercise cards */}
      {workout.exercises.map((ex, i) => (
        <ExerciseInput
          key={`${ex.name}-${i}`}
          name={ex.name}
          muscle_group={ex.muscle_group}
          sets={ex.sets}
          reps={ex.reps}
          values={exerciseSets[i] ?? []}
          onChange={(next) =>
            setExerciseSets((prev) =>
              prev.map((s, idx) => (idx === i ? next : s))
            )
          }
        />
      ))}

      {/* Toast */}
      {toast && (
        <div
          className={`px-5 py-4 border-l-4 text-sm font-semibold ${
            toast.type === "success"
              ? "bg-[#0a1f0a] border-[#22c55e] text-[#22c55e]"
              : "bg-[#1f0a0a] border-[#E50914] text-[#E50914]"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto bg-[#E50914] hover:bg-[#C20812] text-white text-[10px]
                   font-black tracking-[0.2em] uppercase px-10 py-4 transition-colors
                   duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Saving…
          </span>
        ) : (
          "Save Workout"
        )}
      </button>
    </form>
  );
}
