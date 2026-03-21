"use client";

interface Props {
  /** Current check-in streak in days. */
  current_streak: number;
  loading?: boolean;
}

function getMessage(streak: number): string | null {
  if (streak === 0) return "Start your streak today 💪";
  if (streak >= 5) return "You're on fire 🔥";
  return null;
}

export default function StreakCard({ current_streak, loading = false }: Props) {
  const message = loading ? null : getMessage(current_streak);
  const isHot = current_streak >= 5;

  return (
    <div
      className={`group bg-[#111111] border p-6 transition-colors duration-200 cursor-default
        ${isHot ? "border-[#f59e0b]/40 hover:border-[#f59e0b]" : "border-[#2A2A2A] hover:border-[#E50914]"}`}
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-[10px] font-black tracking-[0.2em] uppercase text-[#555]">
          Current Streak
        </p>
        <span
          className={`text-xl transition-transform duration-200 group-hover:scale-125 ${
            loading ? "opacity-30" : ""
          }`}
          aria-hidden="true"
        >
          🔥
        </span>
      </div>

      {loading ? (
        <div className="h-12 w-24 bg-[#1A1A1A] animate-pulse mb-2" />
      ) : (
        <div className="flex items-end gap-2 mb-2">
          <p
            className={`text-5xl font-black tabular-nums transition-all duration-500 ${
              isHot ? "text-[#f59e0b]" : "text-white"
            }`}
          >
            {current_streak}
          </p>
          <p className="text-[#555] text-sm font-black uppercase tracking-widest pb-2">
            {current_streak === 1 ? "day" : "days"}
          </p>
        </div>
      )}

      {!loading && message && (
        <p
          className={`text-[11px] font-semibold mt-1 ${
            current_streak === 0 ? "text-[#555]" : "text-[#f59e0b]"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
