"use client";

import { useState } from "react";
import type { WorkoutDay, WorkoutExercise } from "@/types";

interface Props {
  onSubmit: (data: { name: string; days: WorkoutDay[] }) => Promise<void>;
  loading: boolean;
}

const emptyExercise = (): WorkoutExercise => ({ exercise_id: "", sets: 3, reps: "10" });
const emptyDay = (n: number): WorkoutDay => ({
  day_number: n,
  title: "",
  exercises: [emptyExercise()],
});

export default function WorkoutForm({ onSubmit, loading }: Props) {
  const [planName, setPlanName] = useState("");
  const [days, setDays] = useState<WorkoutDay[]>([emptyDay(1)]);
  const [error, setError] = useState<string | null>(null);

  // ── Day helpers ──────────────────────────────────────────────────────────────

  function addDay() {
    setDays((prev) => [...prev, emptyDay(prev.length + 1)]);
  }

  function removeDay(idx: number) {
    setDays((prev) =>
      prev
        .filter((_, i) => i !== idx)
        .map((d, i) => ({ ...d, day_number: i + 1 }))
    );
  }

  function updateDayTitle(idx: number, title: string) {
    setDays((prev) =>
      prev.map((d, i) => (i === idx ? { ...d, title } : d))
    );
  }

  // ── Exercise helpers ─────────────────────────────────────────────────────────

  function addExercise(dayIdx: number) {
    setDays((prev) =>
      prev.map((d, i) =>
        i === dayIdx
          ? { ...d, exercises: [...d.exercises, emptyExercise()] }
          : d
      )
    );
  }

  function removeExercise(dayIdx: number, exIdx: number) {
    setDays((prev) =>
      prev.map((d, i) =>
        i === dayIdx
          ? { ...d, exercises: d.exercises.filter((_, j) => j !== exIdx) }
          : d
      )
    );
  }

  function updateExercise(
    dayIdx: number,
    exIdx: number,
    field: keyof WorkoutExercise,
    value: string | number
  ) {
    setDays((prev) =>
      prev.map((d, i) =>
        i === dayIdx
          ? {
              ...d,
              exercises: d.exercises.map((ex, j) =>
                j === exIdx ? { ...ex, [field]: value } : ex
              ),
            }
          : d
      )
    );
  }

  // ── Submit ───────────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!planName.trim()) {
      setError("Plan name is required.");
      return;
    }
    for (const day of days) {
      if (!day.title.trim()) {
        setError(`Day ${day.day_number} needs a title.`);
        return;
      }
      for (const ex of day.exercises) {
        if (!ex.exercise_id.trim()) {
          setError(`Day ${day.day_number}: all exercises need an Exercise ID.`);
          return;
        }
      }
    }
    try {
      await onSubmit({ name: planName, days });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save plan.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Plan name */}
      <div>
        <label className="text-[#555] text-[10px] font-black tracking-[0.2em] uppercase block mb-2">
          Plan Name
        </label>
        <input
          type="text"
          value={planName}
          onChange={(e) => setPlanName(e.target.value)}
          placeholder="e.g. Beginner Split"
          className="w-full bg-[#0B0B0B] border border-[#2A2A2A] focus:border-[#E50914] text-white placeholder-[#333] text-sm font-black px-4 py-3 outline-none transition-colors duration-200"
        />
      </div>

      {/* Days */}
      <div className="space-y-6">
        {days.map((day, dayIdx) => (
          <div
            key={dayIdx}
            className="bg-[#111111] border border-[#2A2A2A] p-6"
          >
            {/* Day header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-[#E50914] flex items-center justify-center text-white text-[10px] font-black shrink-0">
                  {day.day_number}
                </div>
                <p className="text-[#E50914] text-[10px] font-black tracking-[0.2em] uppercase">
                  Day {day.day_number}
                </p>
              </div>
              {days.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDay(dayIdx)}
                  className="text-[#333] hover:text-[#E50914] text-[10px] font-black tracking-[0.15em] uppercase transition-colors duration-200"
                >
                  Remove
                </button>
              )}
            </div>

            {/* Day title */}
            <div className="mb-5">
              <label className="text-[#555] text-[9px] font-black tracking-[0.2em] uppercase block mb-2">
                Title (e.g. Chest, Back &amp; Biceps)
              </label>
              <input
                type="text"
                value={day.title}
                onChange={(e) => updateDayTitle(dayIdx, e.target.value)}
                placeholder="Chest"
                className="w-full bg-[#0B0B0B] border border-[#2A2A2A] focus:border-[#E50914] text-white placeholder-[#333] text-sm font-black px-4 py-3 outline-none transition-colors duration-200"
              />
            </div>

            {/* Exercises */}
            <div className="space-y-3 mb-4">
              <p className="text-[#555] text-[9px] font-black tracking-[0.2em] uppercase">
                Exercises
              </p>
              {day.exercises.map((ex, exIdx) => (
                <div key={exIdx} className="flex items-center gap-3">
                  {/* Exercise ID */}
                  <input
                    type="text"
                    value={ex.exercise_id}
                    onChange={(e) =>
                      updateExercise(dayIdx, exIdx, "exercise_id", e.target.value)
                    }
                    placeholder="Exercise UUID"
                    className="flex-1 bg-[#0B0B0B] border border-[#2A2A2A] focus:border-[#E50914] text-white placeholder-[#333] text-sm font-mono px-3 py-2 outline-none transition-colors duration-200"
                  />
                  {/* Sets */}
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <span className="text-[#333] text-[8px] font-black tracking-[0.15em] uppercase">
                      Sets
                    </span>
                    <input
                      type="number"
                      min={1}
                      value={ex.sets}
                      onChange={(e) =>
                        updateExercise(
                          dayIdx,
                          exIdx,
                          "sets",
                          Math.max(1, Number(e.target.value))
                        )
                      }
                      className="w-14 bg-[#0B0B0B] border border-[#2A2A2A] focus:border-[#E50914] text-white text-center text-sm px-2 py-2 outline-none transition-colors duration-200"
                    />
                  </div>
                  {/* Reps */}
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <span className="text-[#333] text-[8px] font-black tracking-[0.15em] uppercase">
                      Reps
                    </span>
                    <input
                      type="text"
                      value={ex.reps}
                      onChange={(e) =>
                        updateExercise(dayIdx, exIdx, "reps", e.target.value)
                      }
                      placeholder="10"
                      className="w-14 bg-[#0B0B0B] border border-[#2A2A2A] focus:border-[#E50914] text-white text-center text-sm px-2 py-2 outline-none transition-colors duration-200"
                    />
                  </div>
                  {/* Remove exercise */}
                  {day.exercises.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExercise(dayIdx, exIdx)}
                      className="text-[#333] hover:text-[#E50914] transition-colors duration-200 shrink-0"
                      aria-label="Remove exercise"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add exercise */}
            <button
              type="button"
              onClick={() => addExercise(dayIdx)}
              className="text-[#555] hover:text-[#E50914] text-[9px] font-black tracking-[0.2em] uppercase transition-colors duration-200 flex items-center gap-2"
            >
              <span className="text-base leading-none">+</span> Add Exercise
            </button>
          </div>
        ))}
      </div>

      {/* Add day */}
      <button
        type="button"
        onClick={addDay}
        className="w-full border border-dashed border-[#2A2A2A] hover:border-[#E50914] text-[#555] hover:text-[#E50914] text-[10px] font-black tracking-[0.2em] uppercase py-4 transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <span className="text-base leading-none">+</span> Add Day
      </button>

      {/* Error */}
      {error && (
        <div className="bg-[#1F0D0D] border border-[#E50914]/40 p-4">
          <p className="text-[#E50914] text-[10px] font-black tracking-[0.2em] uppercase">
            {error}
          </p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#E50914] hover:bg-[#C20812] text-white text-[10px] font-black tracking-[0.2em] uppercase py-4 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Saving…
          </span>
        ) : (
          "Save Plan"
        )}
      </button>
    </form>
  );
}
