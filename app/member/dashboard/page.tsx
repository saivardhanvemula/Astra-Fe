"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMembership } from "@/store/membershipSlice";
import { getTodaySession } from "@/services/attendanceService";
import type { MemberStatus, TodaySession } from "@/types";

const STATUS_STYLE: Record<MemberStatus, { text: string; label: string }> = {
  active: { text: "text-[#22c55e]", label: "Active" },
  expired: { text: "text-[#E50914]", label: "Expired" },
  expiring_soon: { text: "text-[#f59e0b]", label: "Expiring Soon" },
};

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

function fmtDuration(mins: number | null | undefined): string {
  if (mins == null) return "Active";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function fmt(dateStr: string | undefined | null): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function MemberDashboard() {
  const { user, logout } = useAuth();
  const dispatch = useAppDispatch();
  const { data: info, loading } = useAppSelector((s) => s.membership);
  const [todaySession, setTodaySession] = useState<TodaySession | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    // Only fetch if we don't already have the data in the store
    if (!info) {
      dispatch(fetchMembership());
    }
  }, [dispatch, info]);

  useEffect(() => {
    getTodaySession()
      .then(setTodaySession)
      .catch(() => setTodaySession(null))
      .finally(() => setSessionLoading(false));
  }, []);

  const statusCfg = info ? STATUS_STYLE[info.status] : null;

  return (
    <ProtectedRoute allowedRole="member">
      <div className="min-h-screen bg-[#0B0B0B] text-white">
        {/* Top bar */}
        <header className="border-b border-[#2A2A2A] bg-[#111111] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[#E50914] text-[10px] font-black tracking-[0.3em] uppercase">
              Astra
            </span>
            <span className="text-[#333]">/</span>
            <span className="text-[#666] text-[10px] font-black tracking-[0.2em] uppercase">
              Member
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/member/scan"
              className="bg-[#E50914] hover:bg-[#C20812] text-white text-[10px] font-black tracking-[0.2em] uppercase px-4 py-2 transition-colors duration-200"
            >
              Check In
            </Link>
            <Link
              href="/member/profile"
              className="border border-[#2A2A2A] hover:border-[#E50914] text-[#888] hover:text-[#E50914] text-[10px] font-black tracking-[0.2em] uppercase px-4 py-2 transition-colors duration-200"
            >
              Profile
            </Link>
            <button
              onClick={logout}
              className="border border-[#2A2A2A] hover:border-[#E50914] text-[#888] hover:text-[#E50914] text-[10px] font-black tracking-[0.2em] uppercase px-4 py-2 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-4xl mx-auto px-6 py-16">
          <p className="text-[#E50914] text-[10px] font-black tracking-[0.3em] uppercase mb-4">
            Member Dashboard
          </p>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white mb-3">
            Welcome,{" "}
            <span className="text-[#E50914]">{user?.name ?? "Member"}</span>
          </h1>
          <p className="text-[#555] text-sm tracking-wide mb-12">
            {user?.email}
          </p>

          {/* Membership cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Plan */}
            <div className="bg-[#111111] border border-[#2A2A2A] p-6">
              <p className="text-[#555] text-[10px] font-black tracking-[0.2em] uppercase mb-3">
                Plan
              </p>
              <p className="text-xl font-black text-white truncate">
                {loading ? (
                  <span className="text-[#333] animate-pulse">—</span>
                ) : (
                  info?.plan_name ?? "—"
                )}
              </p>
            </div>

            {/* Start Date */}
            <div className="bg-[#111111] border border-[#2A2A2A] p-6">
              <p className="text-[#555] text-[10px] font-black tracking-[0.2em] uppercase mb-3">
                Start Date
              </p>
              <p className="text-lg font-black text-white">
                {loading ? (
                  <span className="text-[#333] animate-pulse">—</span>
                ) : (
                  fmt(info?.start_date)
                )}
              </p>
            </div>

            {/* End Date */}
            <div className="bg-[#111111] border border-[#2A2A2A] p-6">
              <p className="text-[#555] text-[10px] font-black tracking-[0.2em] uppercase mb-3">
                Expires
              </p>
              <p className="text-lg font-black text-white">
                {loading ? (
                  <span className="text-[#333] animate-pulse">—</span>
                ) : (
                  fmt(info?.end_date)
                )}
              </p>
            </div>

            {/* Status */}
            <div className="bg-[#111111] border border-[#2A2A2A] p-6">
              <p className="text-[#555] text-[10px] font-black tracking-[0.2em] uppercase mb-3">
                Status
              </p>
              {loading ? (
                <span className="text-[#333] font-black animate-pulse">—</span>
              ) : statusCfg ? (
                <p
                  className={`text-sm font-black uppercase tracking-wider ${statusCfg.text}`}
                >
                  {statusCfg.label}
                </p>
              ) : (
                <p className="text-[#555] font-black">—</p>
              )}
            </div>
          </div>

          {/* Today's Session */}
          <div className="bg-[#111111] border border-[#2A2A2A] p-6 mb-4">
            <div className="flex items-center justify-between mb-5">
              <p className="text-[#555] text-[10px] font-black tracking-[0.2em] uppercase">
                Today&apos;s Session
              </p>
              {!todaySession?.checkin_time && !sessionLoading && (
                <Link
                  href="/member/scan"
                  className="bg-[#E50914] hover:bg-[#C20812] text-white text-[9px] font-black tracking-[0.2em] uppercase px-3 py-1.5 transition-colors duration-200"
                >
                  Scan QR
                </Link>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4">
              {["Check-In", "Check-Out", "Duration"].map((label, i) => {
                const values = sessionLoading
                  ? ["—", "—", "—"]
                  : [
                      fmtTime(todaySession?.checkin_time),
                      fmtTime(todaySession?.checkout_time),
                      todaySession?.checkin_time
                        ? fmtDuration(todaySession.duration_minutes)
                        : "—",
                    ];
                return (
                  <div key={label}>
                    <p className="text-[#555] text-[9px] font-black tracking-[0.2em] uppercase mb-2">
                      {label}
                    </p>
                    <p
                      className={`font-black text-sm ${
                        sessionLoading
                          ? "text-[#333] animate-pulse"
                          : i === 0 && todaySession?.checkin_time
                          ? "text-[#22c55e]"
                          : i === 2 && !todaySession?.checkout_time && todaySession?.checkin_time
                          ? "text-[#f59e0b]"
                          : "text-white"
                      }`}
                    >
                      {values[i]}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Days remaining progress bar */}
          {info && info.status !== "expired" && (
            <div className="bg-[#111111] border border-[#2A2A2A] p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[#555] text-[10px] font-black tracking-[0.2em] uppercase">
                  Days Remaining
                </p>
                <p
                  className={`font-black text-sm ${
                    info.status === "expiring_soon"
                      ? "text-[#f59e0b]"
                      : "text-[#E50914]"
                  }`}
                >
                  {info.days_remaining} days
                </p>
              </div>
              <div className="h-1 bg-[#1A1A1A]">
                <div
                  className={`h-full transition-all duration-700 ${
                    info.status === "expiring_soon"
                      ? "bg-[#f59e0b]"
                      : "bg-[#E50914]"
                  }`}
                  style={{
                    width: `${Math.min(100, (info.days_remaining / 30) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
