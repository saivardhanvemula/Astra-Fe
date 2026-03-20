"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { WeeklyCheckin } from "@/types";

interface Props {
  data: WeeklyCheckin[];
  loading?: boolean;
  error?: string | null;
}
    
function fmtLabel(raw: string): string {
  // Accept ISO date like "2026-03-18" → "Wed 18" or short labels like "Mon" → pass through
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const d = new Date(raw);
    return d.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
    });
  }
  return raw;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] px-4 py-3">
      <p className="text-[#888] text-[10px] font-black tracking-[0.2em] uppercase mb-1">
        {label}
      </p>
      <p className="text-white text-xl font-black">{payload[0].value}</p>
      <p className="text-[#555] text-[9px] font-black tracking-[0.15em] uppercase">
        check-ins
      </p>
    </div>
  );
}

export default function CheckinChart({ data, loading, error }: Props) {
  const maxVal = data.length ? Math.max(...data.map((d) => d.count), 1) : 1;

  return (
    <div className="bg-[#111111] border border-[#2A2A2A] p-6">
      <p className="text-[#555] text-[10px] font-black tracking-[0.2em] uppercase mb-6">
        Weekly Check-Ins
      </p>

      {loading ? (
        <div className="h-56 flex items-end gap-2 px-2">
          {[60, 80, 45, 90, 70, 55, 75].map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-[#1A1A1A] animate-pulse"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      ) : error ? (
        <div className="h-56 flex items-center justify-center">
          <p className="text-[#E50914] text-[10px] font-black tracking-[0.2em] uppercase text-center">
            {error}
          </p>
        </div>
      ) : data.length === 0 ? (
        <div className="h-56 flex items-center justify-center">
          <p className="text-[#333] text-[10px] font-black tracking-[0.2em] uppercase">
            No data available
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={224}>
          <BarChart
            data={data.map((d) => ({ ...d, label: fmtLabel(d.date) }))}
            barCategoryGap="30%"
          >
            <CartesianGrid
              vertical={false}
              stroke="#1A1A1A"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="label"
              tick={{
                fill: "#555",
                fontSize: 10,
                fontWeight: 900,
                letterSpacing: "0.1em",
              }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{
                fill: "#555",
                fontSize: 10,
                fontWeight: 900,
              }}
              axisLine={false}
              tickLine={false}
              width={28}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
            />
            <Bar dataKey="count" radius={[2, 2, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    entry.count === maxVal
                      ? "#E50914"
                      : "rgba(229,9,20,0.35)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
