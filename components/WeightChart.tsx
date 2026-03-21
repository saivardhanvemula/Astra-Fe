"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { WeightEntry } from "@/services/progressService";

interface Props {
  entries: WeightEntry[];
  loading: boolean;
}

interface ChartPoint {
  date: string;
  weight: number;
  full: string;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  } catch {
    return iso;
  }
}

function buildChartData(entries: WeightEntry[]): ChartPoint[] {
  // Sort oldest → newest for the chart
  return [...entries]
    .sort(
      (a, b) =>
        new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
    )
    .map((e) => ({
      date: formatDate(e.recorded_at),
      full: new Date(e.recorded_at).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      weight: e.weight,
    }));
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: ChartPoint }>;
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const { full, weight } = payload[0].payload;
  return (
    <div className="bg-[#111111] border border-[#2A2A2A] px-4 py-3 shadow-xl">
      <p className="text-[10px] text-[#555] uppercase tracking-widest mb-1">{full}</p>
      <p className="text-xl font-black text-white tabular-nums">
        {weight}
        <span className="text-[#555] text-xs font-normal ml-1">kg</span>
      </p>
    </div>
  );
}

export default function WeightChart({ entries, loading }: Props) {
  const data = buildChartData(entries);
  const weights = data.map((d) => d.weight);
  const avg =
    weights.length > 0
      ? Math.round((weights.reduce((a, b) => a + b, 0) / weights.length) * 10) / 10
      : null;

  return (
    <div className="bg-[#111111] border border-[#2A2A2A] p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[10px] font-black tracking-[0.2em] uppercase text-[#555]">
          Weight History
        </h2>
        {avg !== null && (
          <p className="text-[10px] text-[#555] tracking-widest uppercase">
            Avg{" "}
            <span className="text-white font-black">{avg} kg</span>
          </p>
        )}
      </div>

      {loading ? (
        <div className="h-64 bg-[#0A0A0A] animate-pulse" />
      ) : data.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3 border border-dashed border-[#2A2A2A]">
          <svg
            className="w-10 h-10 text-[#333]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 13.5l4-4 4 4 4-6 4 2"
            />
          </svg>
          <p className="text-[#444] text-sm">No weight entries yet.</p>
          <p className="text-[#333] text-xs">Log your first weight above.</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart
            data={data}
            margin={{ top: 8, right: 16, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: "#555", fontSize: 10, fontWeight: 700 }}
              tickLine={false}
              axisLine={{ stroke: "#2A2A2A" }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fill: "#555", fontSize: 10, fontWeight: 700 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}`}
              width={36}
            />
            {avg !== null && (
              <ReferenceLine
                y={avg}
                stroke="#2A2A2A"
                strokeDasharray="4 4"
                label={{
                  value: `avg ${avg}`,
                  fill: "#333",
                  fontSize: 9,
                  position: "insideTopRight",
                }}
              />
            )}
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#2A2A2A" }} />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#E50914"
              strokeWidth={2}
              dot={{ fill: "#E50914", r: 3, strokeWidth: 0 }}
              activeDot={{ fill: "#E50914", r: 5, strokeWidth: 2, stroke: "#fff" }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
