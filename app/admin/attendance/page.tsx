"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/AdminShell";
import QRDisplay from "@/components/QRDisplay";
import { getAttendanceLogs, adminCheckout } from "@/services/attendanceService";
import type { AttendanceSession } from "@/types";

function fmtTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return iso;
  }
}

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function fmtDuration(mins: number | null | undefined): string {
  if (mins == null) return "Active";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function AdminAttendancePage() {
  const [logs, setLogs] = useState<AttendanceSession[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [logsError, setLogsError] = useState<string | null>(null);
  const [checkingOut, setCheckingOut] = useState<string | null>(null);

  async function handleAdminCheckout(sessionId: string) {
    setCheckingOut(sessionId);
    try {
      const updated = await adminCheckout(sessionId);
      setLogs((prev) =>
        prev.map((row) => (row.id === sessionId ? updated : row))
      );
    } catch {
      // silently ignore — user can refresh
    } finally {
      setCheckingOut(null);
    }
  }

  useEffect(() => {
    getAttendanceLogs()
      .then(setLogs)
      .catch((err: unknown) =>
        setLogsError(
          err instanceof Error ? err.message : "Failed to load attendance logs."
        )
      )
      .finally(() => setLogsLoading(false));
  }, []);

  return (
    <AdminShell>
      {/* Page heading */}
      <div className="mb-10">
        <p className="text-[#E50914] text-[10px] font-black tracking-[0.3em] uppercase mb-2">
          Admin
        </p>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
          Attendance
        </h1>
        <p className="text-[#555] text-sm tracking-wide mt-2">
          Display the QR on screen — members scan to check in.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* ── Left: QR Display ─────────────────────────────────────────── */}
        <section>
          <p className="text-[#555] text-[10px] font-black tracking-[0.2em] uppercase mb-6">
            Live QR Code
          </p>
          <QRDisplay />
        </section>

        {/* ── Right: Attendance Log ─────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <p className="text-[#555] text-[10px] font-black tracking-[0.2em] uppercase">
              Today&apos;s Log
            </p>
            <button
              onClick={() => {
                setLogsLoading(true);
                setLogsError(null);
                getAttendanceLogs()
                  .then(setLogs)
                  .catch((err: unknown) =>
                    setLogsError(
                      err instanceof Error
                        ? err.message
                        : "Failed to load attendance logs."
                    )
                  )
                  .finally(() => setLogsLoading(false));
              }}
              className="border border-[#2A2A2A] hover:border-[#E50914] text-[#555] hover:text-[#E50914] text-[10px] font-black tracking-[0.2em] uppercase px-4 py-2 transition-colors duration-200"
            >
              Refresh
            </button>
          </div>

          {logsLoading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-[#111111] border border-[#2A2A2A] animate-pulse"
                />
              ))}
            </div>
          ) : logsError ? (
            <div className="bg-[#111111] border border-[#2A2A2A] p-6 text-center">
              <p className="text-[#E50914] text-[10px] font-black tracking-[0.2em] uppercase">
                {logsError}
              </p>
            </div>
          ) : logs.length === 0 ? (
            <div className="bg-[#111111] border border-[#2A2A2A] p-10 text-center">
              <p className="text-[#444] text-[10px] font-black tracking-[0.2em] uppercase">
                No check-ins recorded today
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-[#2A2A2A]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2A2A2A] bg-[#111111]">
                    {["Member", "Date", "Check-In", "Check-Out", "Duration", ""].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left text-[#555] text-[9px] font-black tracking-[0.2em] uppercase px-4 py-3"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {logs.map((row, idx) => (
                    <tr
                      key={row.id}
                      className={`border-b border-[#1A1A1A] transition-colors duration-150 hover:bg-[#111111] ${
                        idx % 2 === 0 ? "bg-[#0B0B0B]" : "bg-[#0E0E0E]"
                      }`}
                    >
                      <td className="px-4 py-3 font-black text-white whitespace-nowrap">
                        {row.member_name ?? row.member_id}
                      </td>
                      <td className="px-4 py-3 text-[#888] whitespace-nowrap">
                        {fmtDate(row.check_in_time)}
                      </td>
                      <td className="px-4 py-3 text-[#888] whitespace-nowrap">
                        {fmtTime(row.check_in_time)}
                      </td>
                      <td className="px-4 py-3 text-[#888] whitespace-nowrap">
                        {fmtTime(row.check_out_time)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {row.check_out_time ? (
                          <span className="text-[#888]">
                            {fmtDuration(row.duration_minutes)}
                          </span>
                        ) : (
                          <span className="text-[#22c55e] text-[9px] font-black tracking-[0.15em] uppercase">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {!row.check_out_time && (
                          <button
                            onClick={() => handleAdminCheckout(row.id)}
                            disabled={checkingOut === row.id}
                            className="border border-[#2A2A2A] hover:border-[#E50914] text-[#555] hover:text-[#E50914] text-[9px] font-black tracking-[0.15em] uppercase px-3 py-1.5 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {checkingOut === row.id ? (
                              <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                Wait…
                              </span>
                            ) : (
                              "Check-Out"
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
