"use client";

import type { ProgressSummary } from "@/services/progressService";

interface Props {
  summary: ProgressSummary | null;
  loading: boolean;
}

interface CardDef {
  label: string;
  getValue: (s: ProgressSummary) => string;
  getColor: (s: ProgressSummary) => string;
  icon: React.ReactNode;
}

function fmt(n: number | null | undefined, unit = " kg"): string {
  if (n == null) return "—";
  return `${n}${unit}`;
}

const CARDS: CardDef[] = [
  {
    label: "Current Weight",
    getValue: (s) => fmt(s.current_weight),
    getColor: () => "text-white",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M3 12h2m14 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 7a5 5 0 1 1 0 10A5 5 0 0 1 12 7z" />
      </svg>
    ),
  },
  {
    label: "Starting Weight",
    getValue: (s) => fmt(s.starting_weight),
    getColor: () => "text-[#999]",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 6h18M3 18h12" />
      </svg>
    ),
  },
  {
    label: "Weight Change",
    getValue: (s) => {
      if (s.weight_change == null) return "—";
      const sign = s.weight_change > 0 ? "+" : "";
      return `${sign}${s.weight_change} kg`;
    },
    getColor: (s) => {
      if (s.weight_change == null) return "text-white";
      return s.weight_change < 0 ? "text-[#22c55e]" : s.weight_change > 0 ? "text-[#E50914]" : "text-white";
    },
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-10" />
      </svg>
    ),
  },
  {
    label: "Total Entries",
    getValue: (s) => String(s.total_entries ?? 0),
    getColor: () => "text-white",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
      </svg>
    ),
  },
];

export default function SummaryCards({ summary, loading }: Props) {
  const EMPTY: ProgressSummary = {
    current_weight: null,
    starting_weight: null,
    weight_change: null,
    total_entries: 0,
  };

  const data = summary ?? EMPTY;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {CARDS.map((card) => (
        <div
          key={card.label}
          className="group bg-[#111111] border border-[#2A2A2A] hover:border-[#E50914]
                     p-5 transition-colors duration-200 cursor-default"
        >
          <div className="flex items-start justify-between mb-4">
            <p className="text-[10px] font-black tracking-[0.2em] uppercase text-[#555] leading-tight">
              {card.label}
            </p>
            <span className="text-[#333] group-hover:text-[#E50914] transition-colors duration-200">
              {card.icon}
            </span>
          </div>

          {loading ? (
            <div className="h-9 w-20 bg-[#1A1A1A] animate-pulse" />
          ) : (
            <p
              className={`text-3xl font-black tabular-nums ${card.getColor(data)}`}
            >
              {card.getValue(data)}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
