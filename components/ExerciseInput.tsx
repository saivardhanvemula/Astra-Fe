"use client";

import type { SetLog } from "@/services/workoutLog";

interface Props {
  name: string;
  muscle_group?: string;
  /** Number of sets prescribed by the plan. */
  sets: number;
  /** Reps prescribed by the plan, e.g. "10" or "8-12". */
  reps: string;
  values: SetLog[];
  onChange: (sets: SetLog[]) => void;
}

export default function ExerciseInput({
  name,
  muscle_group,
  sets,
  reps,
  values,
  onChange,
}: Props) {
  function handleChange(
    index: number,
    field: "weight" | "reps",
    raw: string
  ) {
    const parsed = raw === "" ? 0 : parseFloat(raw);
    const next = values.map((s, i) =>
      i === index ? { ...s, [field]: isNaN(parsed) ? 0 : parsed } : s
    );
    onChange(next);
  }

  /** Copy Set 1's weight down to every other set of this exercise. */
  function fillWeightToAll() {
    const weight = values[0]?.weight ?? 0;
    onChange(values.map((s) => ({ ...s, weight })));
  }

  return (
    <div className="bg-[#111111] border border-[#2A2A2A] overflow-hidden">
      {/* Exercise header */}
      <div className="px-5 py-4 border-b border-[#1A1A1A] flex items-center justify-between">
        <div>
          <p className="text-white font-black">{name}</p>
          {muscle_group && (
            <p className="text-[#555] text-[9px] font-black tracking-[0.15em] uppercase mt-0.5">
              {muscle_group}
            </p>
          )}
        </div>
        <div className="text-right shrink-0 ml-4">
          <p className="text-[#E50914] font-black text-sm">
            {sets} <span className="text-[#333]">×</span> {reps}
          </p>
          <p className="text-[#333] text-[8px] font-black tracking-[0.15em] uppercase mt-0.5">
            sets × reps
          </p>
        </div>
      </div>

      {/* Column headers */}
      <div className="px-5 pt-3 pb-1 flex items-center gap-3">
        <span className="w-8 shrink-0" />
        <span className="flex-1 text-[#333] text-[8px] font-black tracking-[0.2em] uppercase pl-3">
          Weight (KG)
        </span>
        <span className="w-[4.5rem] shrink-0 text-[#333] text-[8px] font-black tracking-[0.2em] uppercase pl-3">
          Reps
        </span>
        {/* spacer aligned with fill-all button column */}
        {values.length > 1 && <span className="w-[4.5rem] shrink-0" />}
      </div>

      {/* Set rows */}
      <div className="divide-y divide-[#1A1A1A]">
        {values.map((s, i) => (
          <div key={i} className="px-5 py-2.5 flex items-center gap-3">
            {/* Set label */}
            <span className="text-[#444] text-[9px] font-black tracking-[0.1em] uppercase w-8 shrink-0">
              S{s.set_number}
            </span>

            {/* Weight input */}
            <div className="flex-1 relative">
              <input
                type="number"
                step="0.5"
                min="0"
                placeholder="0"
                value={s.weight === 0 ? "" : s.weight}
                onChange={(e) => handleChange(i, "weight", e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] text-white placeholder-[#333]
                           px-3 py-2 pr-8 text-sm focus:outline-none focus:border-[#E50914]
                           transition-colors duration-200
                           [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                           [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#333] text-[9px] font-black pointer-events-none">
                KG
              </span>
            </div>

            {/* Reps input */}
            <div className="w-[4.5rem] relative shrink-0">
              <input
                type="number"
                step="1"
                min="0"
                placeholder="0"
                value={s.reps === 0 ? "" : s.reps}
                onChange={(e) => handleChange(i, "reps", e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] text-white placeholder-[#333]
                           px-3 py-2 pr-7 text-sm focus:outline-none focus:border-[#E50914]
                           transition-colors duration-200
                           [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                           [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#333] text-[8px] font-black pointer-events-none">
                RP
              </span>
            </div>

            {/* "Fill all" button — only on Set 1, only when >1 set */}
            {values.length > 1 && (
              <div className="w-[4.5rem] shrink-0 flex justify-end">
                {i === 0 ? (
                  <button
                    type="button"
                    onClick={fillWeightToAll}
                    title="Apply this weight to all sets"
                    className="flex items-center gap-1 text-[#444] hover:text-[#E50914] border border-[#2A2A2A]
                               hover:border-[#E50914] px-2 py-1.5 text-[8px] font-black tracking-[0.1em]
                               uppercase transition-colors duration-200 whitespace-nowrap"
                  >
                    ↓ All
                  </button>
                ) : (
                  <span />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
