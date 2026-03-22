"use client";

import type { ProgressSummary } from "@/services/progressService";

interface Props {
  summary: ProgressSummary | null;
  loading: boolean;
}

interface CardDef {
  label: string;
  value: string;
  sub?: string;
  color?: string;
}

function fmt(n: number | null | undefined, suffix = ""): string {
  if (n == null) return "—";
  return `${n}${suffix}`;
}

function changeColor(change: number | null): string {
  if (change == null) return "text-white";
  if (change < 0) return "text-[#22c55e]";
  if (change > 0) return "text-[#E50914]";
  return "text-[#f59e0b]";
}

function changePrefix(change: number | null): string {
  if (change == null || change === 0) return "";
  return change > 0 ? "+" : "";
}

export default function ProgressCards({ summary, loading }: Props) {
  const cards: CardDef[] = [
    {
      label: "Current Weight",
      value: loading ? "—" : fmt(summary?.current_weight, " kg"),
      sub: "last recorded",
      color: "text-white",
    },
    {
      label: "Weight Change",
      value: loading
        ? "—"
        : summary?.weight_change != null
        ? `${changePrefix(summary.weight_change)}${summary.weight_change} kg`
        : "—",
      sub: "since start",
      color: loading ? "text-white" : changeColor(summary?.weight_change ?? null),
    },
    {
      label: "Weigh-ins",
      value: loading ? "—" : fmt(summary?.total_entries),
      sub: "total entries",
      color: "text-[#E50914]",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-[#111111] border border-[#2A2A2A] p-5 hover:border-[#3A3A3A] transition-colors duration-200"
        >
          <p className="text-[9px] font-black tracking-[0.2em] uppercase text-[#555] mb-3">
            {card.label}
          </p>
          {loading ? (
            <div className="h-8 w-20 bg-[#1A1A1A] animate-pulse mb-1" />
          ) : (
            <p className={`text-2xl font-black tabular-nums ${card.color}`}>
              {card.value}
            </p>
          )}
          {card.sub && (
            <p className="text-[#333] text-[8px] font-black tracking-[0.15em] uppercase mt-1">
              {card.sub}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
