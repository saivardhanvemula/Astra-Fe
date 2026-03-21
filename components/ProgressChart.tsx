"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getExerciseProgress } from "@/services/workoutLog";
import type { ExerciseProgressPoint } from "@/services/workoutLog";

interface Props {
  /** exercise_id or URL-encodable exercise name */
  exerciseId: string;
  exerciseName: string;
}

function fmtDate(raw: string): string {
  try {
    return new Date(raw).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  } catch {
    return raw;
  }
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#111111] border border-[#2A2A2A] px-4 py-3 shadow-xl">
      <p className="text-[10px] text-[#555] uppercase tracking-widest mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-black text-white">
          {p.dataKey === "max_weight" ? "Max" : "Avg"}: {p.value} kg
        </p>
      ))}
    </div>
  );
}

export default function ProgressChart({ exerciseId, exerciseName }: Props) {
  const [data, setData] = useState<ExerciseProgressPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    getExerciseProgress(exerciseId)
      .then((d) =>
        setData(d.map((p) => ({ ...p, date: fmtDate(p.date) })))
      )
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [exerciseId]);

  const hasAvg = data.length > 0 && data[0].avg_weight !== undefined;

  return (
    <div className="bg-[#0A0A0A] border border-[#2A2A2A] p-5">
      <div className="flex items-center justify-between mb-5">
        <p className="text-[10px] font-black tracking-[0.2em] uppercase text-[#555]">
          Strength Progress
        </p>
        <p className="text-[10px] text-[#333] font-black uppercase tracking-widest">
          {exerciseName}
        </p>
      </div>

      {loading ? (
        <div className="h-48 bg-[#111111] animate-pulse" />
      ) : error ? (
        <div className="h-48 flex items-center justify-center border border-dashed border-[#2A2A2A]">
          <p className="text-[#444] text-sm">Could not load progress data.</p>
        </div>
      ) : data.length === 0 ? (
        <div className="h-48 flex flex-col items-center justify-center gap-2 border border-dashed border-[#2A2A2A]">
          <p className="text-[#444] text-sm">No data yet.</p>
          <p className="text-[#333] text-xs">Log this exercise to start tracking.</p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={data}
              margin={{ top: 4, right: 12, left: -10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1E1E1E"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fill: "#555", fontSize: 10, fontWeight: 700 }}
                tickLine={false}
                axisLine={{ stroke: "#2A2A2A" }}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: "#555", fontSize: 10, fontWeight: 700 }}
                tickLine={false}
                axisLine={false}
                width={34}
                tickFormatter={(v) => `${v}`}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "#2A2A2A" }}
              />
              <Line
                type="monotone"
                dataKey="max_weight"
                stroke="#E50914"
                strokeWidth={2}
                dot={{ fill: "#E50914", r: 3, strokeWidth: 0 }}
                activeDot={{ fill: "#E50914", r: 5, strokeWidth: 2, stroke: "#fff" }}
              />
              {hasAvg && (
                <Line
                  type="monotone"
                  dataKey="avg_weight"
                  stroke="#555"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#E50914] inline-block" />
              <span className="text-[9px] text-[#555] font-black uppercase tracking-widest">
                Max
              </span>
            </div>
            {hasAvg && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#555] inline-block" style={{ borderTop: "1.5px dashed #555", background: "transparent" }} />
                <span className="text-[9px] text-[#555] font-black uppercase tracking-widest">
                  Avg
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
