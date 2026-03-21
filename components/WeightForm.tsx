"use client";

import { useState } from "react";
import { addWeight } from "@/services/progressService";
import type { WeightEntry } from "@/services/progressService";

interface Props {
  /** Called after a successful log so parent can refresh chart + summary. */
  onSuccess: (entry: WeightEntry) => void;
  /** ISO date strings already logged (used to detect today's duplicate). */
  loggedDates?: string[];
}

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

export default function WeightForm({ onSuccess, loggedDates = [] }: Props) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const alreadyLoggedToday = loggedDates.some((d) =>
    typeof d === "string" && d.split("T")[0] === todayISO()
  );

  function showToast(msg: string, type: "success" | "error") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const num = parseFloat(value);
    if (isNaN(num) || num <= 0 || num > 500) {
      showToast("Enter a valid weight between 1 – 500 kg.", "error");
      return;
    }

    if (alreadyLoggedToday) {
      showToast("You've already logged your weight today.", "error");
      return;
    }

    setLoading(true);
    try {
      await addWeight(num);
      setValue("");
      // Optimistically create a temporary entry so the parent can update state
      const tempEntry: WeightEntry = {
        id: crypto.randomUUID(),
        weight: num,
        recorded_at: new Date().toISOString(),
      };
      onSuccess(tempEntry);
      showToast("Weight logged!", "success");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to log weight. Try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#111111] border border-[#2A2A2A] p-6">
      <h2 className="text-[10px] font-black tracking-[0.2em] uppercase text-[#555] mb-5">
        Log Weight
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="number"
            step="0.1"
            min="1"
            max="500"
            placeholder="Enter weight (kg)"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={loading || alreadyLoggedToday}
            className="w-full bg-[#0A0A0A] border border-[#2A2A2A] text-white placeholder-[#444]
                       px-4 py-3 text-sm focus:outline-none focus:border-[#E50914]
                       transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                       [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                       [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#444] text-xs font-bold pointer-events-none">
            KG
          </span>
        </div>

        <button
          type="submit"
          disabled={loading || alreadyLoggedToday || !value}
          className="bg-[#E50914] hover:bg-[#cc0812] text-white text-[11px] font-black
                     tracking-[0.15em] uppercase px-6 py-3 transition-colors duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Logging…
            </span>
          ) : (
            "Add Weight"
          )}
        </button>
      </form>

      {alreadyLoggedToday && (
        <p className="mt-3 text-[11px] text-[#f59e0b] font-semibold">
          ✓ Weight already logged for today.
        </p>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`mt-4 px-4 py-3 text-sm font-semibold border-l-4 ${
            toast.type === "success"
              ? "bg-[#0a1f0a] border-[#22c55e] text-[#22c55e]"
              : "bg-[#1f0a0a] border-[#E50914] text-[#E50914]"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
