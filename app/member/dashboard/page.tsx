"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMembership } from "@/store/membershipSlice";
import { getTodaySession, checkout } from "@/services/attendanceService";
import {
  getStreak,
  getProgressSummary,
  getWeightHistory,
} from "@/services/progressService";
import { getMyWorkout } from "@/services/workoutService";
import TodayWorkout from "@/components/TodayWorkout";
import ProgressCards from "@/components/ProgressCards";
import WeightChart from "@/components/WeightChart";
import QuickActions from "@/components/QuickActions";
import StreakCard from "@/components/StreakCard";
import type { MemberStatus, TodaySession, MemberWorkout } from "@/types";
import type { ProgressSummary, WeightEntry } from "@/services/progressService";

const STATUS_STYLE: Record<MemberStatus, { text: string; label: string }> = {
  active: { text: "text-[#22c55e]", label: "Active" },
  expired: { text: "text-[#E50914]", label: "Expired" },
  expiring_soon: { text: "text-[#f59e0b]", label: "Expiring Soon" },
};

function smartMessage(streak: number): string {
  if (streak === 0) return "Start your journey 💪";
  if (streak < 5) return "Keep going 🔥";
  return "You're on fire 🔥";
}

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
  const { data: info, loading: membershipLoading } = useAppSelector((s) => s.membership);

  // Session
  const [todaySession, setTodaySession] = useState<TodaySession | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Streak
  const [streak, setStreak] = useState<number>(0);
  const [streakLoading, setStreakLoading] = useState(true);

  // Today's workout
  const [workout, setWorkout] = useState<MemberWorkout | null>(null);
  const [workoutLoading, setWorkoutLoading] = useState(true);
  const [workoutError, setWorkoutError] = useState(false);

  // Progress summary
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  // Weight history
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [weightLoading, setWeightLoading] = useState(true);

  async function handleCheckout() {
    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      const result = await checkout();
      setTodaySession((prev) =>
        prev
          ? {
              ...prev,
              check_out_time: result.check_out_time ?? null,
              duration_minutes: result.duration_minutes ?? null,
            }
          : prev
      );
    } catch (err) {
      setCheckoutError(
        err instanceof Error ? err.message : "Checkout failed. Try again."
      );
    } finally {
      setCheckoutLoading(false);
    }
  }

  useEffect(() => {
    if (!info) dispatch(fetchMembership());
  }, [dispatch, info]);

  useEffect(() => {
    getTodaySession()
      .then(setTodaySession)
      .catch(() => setTodaySession(null))
      .finally(() => setSessionLoading(false));
  }, []);

  useEffect(() => {
    getStreak()
      .then((data) => setStreak(data.current_streak))
      .catch(() => setStreak(0))
      .finally(() => setStreakLoading(false));
  }, []);

  useEffect(() => {
    const uid = user?.member_id ?? user?.id;
    if (!uid) return;
    getMyWorkout(uid)
      .then(setWorkout)
      .catch(() => setWorkoutError(true))
      .finally(() => setWorkoutLoading(false));
  }, [user?.member_id, user?.id]);

  useEffect(() => {
    getProgressSummary()
      .then(setSummary)
      .catch(() => setSummary(null))
      .finally(() => setSummaryLoading(false));
  }, []);

  useEffect(() => {
    getWeightHistory()
      .then(setWeightEntries)
      .catch(() => setWeightEntries([]))
      .finally(() => setWeightLoading(false));
  }, []);

  const statusCfg = info ? STATUS_STYLE[info.status] : null;
  const checkedIn = Boolean(
    todaySession?.check_in_time && !todaySession?.check_out_time
  );

  return (
    <ProtectedRoute allowedRole="member">
      <div className="min-h-screen bg-[#0B0B0B] text-white">

        {/* ── Top bar ── */}
        <header className="border-b border-[#2A2A2A] bg-[#111111] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[#E50914] text-[10px] font-black tracking-[0.3em] uppercase">
              Astra
            </span>
            <span className="text-[#333]">/</span>
            <span className="text-[#666] text-[10px] font-black tracking-[0.2em] uppercase">
              Dashboard
            </span>
          </div>
          <div className="flex items-center gap-2">
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

        {/* ── Main ── */}
        <main className="max-w-4xl mx-auto px-6 py-12 space-y-6">

          {/* ── Hero greeting ── */}
          <div>
            <p className="text-[#E50914] text-[10px] font-black tracking-[0.3em] uppercase mb-2">
              Member Dashboard
            </p>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1">
              <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white">
                Hey,{" "}
                <span className="text-[#E50914]">
                  {user?.name?.split(" ")[0] ?? "Champ"}
                </span>
              </h1>
              <p
                className={`text-sm font-semibold pb-1 transition-all duration-500 ${
                  streak >= 5
                    ? "text-[#f59e0b]"
                    : streak > 0
                    ? "text-[#E50914]"
                    : "text-[#555]"
                }`}
              >
                {streakLoading ? "\u00a0" : smartMessage(streak)}
              </p>
            </div>
          </div>

          {/* ── Row 1: Streak | Today's Workout ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StreakCard current_streak={streak} loading={streakLoading} />
            <TodayWorkout
              workout={workout}
              loading={workoutLoading}
              error={workoutError}
            />
          </div>

          {/* ── Row 2: Progress cards ── */}
          <ProgressCards summary={summary} loading={summaryLoading} />

          {/* ── Row 3: Weight chart ── */}
          <WeightChart entries={weightEntries} loading={weightLoading} />

          {/* ── Row 4: Quick actions ── */}
          <QuickActions />

          {/* ── Row 5: Membership info ── */}
          <div className="bg-[#111111] border border-[#2A2A2A] p-6">
            <p className="text-[10px] font-black tracking-[0.2em] uppercase text-[#555] mb-4">
              Membership
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              <div>
                <p className="text-[#555] text-[9px] font-black tracking-[0.2em] uppercase mb-2">Plan</p>
                <p className="text-white font-black truncate">
                  {membershipLoading ? <span className="text-[#333] animate-pulse">—</span> : info?.plan_name ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-[#555] text-[9px] font-black tracking-[0.2em] uppercase mb-2">Start Date</p>
                <p className="text-white font-black text-sm">
                  {membershipLoading ? <span className="text-[#333] animate-pulse">—</span> : fmt(info?.start_date)}
                </p>
              </div>
              <div>
                <p className="text-[#555] text-[9px] font-black tracking-[0.2em] uppercase mb-2">Expires</p>
                <p className="text-white font-black text-sm">
                  {membershipLoading ? <span className="text-[#333] animate-pulse">—</span> : fmt(info?.end_date)}
                </p>
              </div>
              <div>
                <p className="text-[#555] text-[9px] font-black tracking-[0.2em] uppercase mb-2">Status</p>
                {membershipLoading ? (
                  <span className="text-[#333] font-black animate-pulse">—</span>
                ) : statusCfg ? (
                  <p className={`font-black text-sm uppercase tracking-wider ${statusCfg.text}`}>
                    {statusCfg.label}
                  </p>
                ) : (
                  <p className="text-[#555] font-black">—</p>
                )}
              </div>
            </div>

            {info && info.status !== "expired" && (
              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[#555] text-[9px] font-black tracking-[0.2em] uppercase">
                    Days Remaining
                  </p>
                  <p className={`font-black text-sm ${info.status === "expiring_soon" ? "text-[#f59e0b]" : "text-[#E50914]"}`}>
                    {info.days_remaining} days
                  </p>
                </div>
                <div className="h-1 bg-[#1A1A1A]">
                  <div
                    className={`h-full transition-all duration-700 ${info.status === "expiring_soon" ? "bg-[#f59e0b]" : "bg-[#E50914]"}`}
                    style={{ width: `${Math.min(100, (info.days_remaining / 30) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* ── Row 6: Today's session ── */}
          <div className="bg-[#111111] border border-[#2A2A2A] p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="text-[10px] font-black tracking-[0.2em] uppercase text-[#555]">
                Today&apos;s Session
              </p>
              {!sessionLoading && (
                checkedIn ? (
                  <button
                    onClick={handleCheckout}
                    disabled={checkoutLoading}
                    className="bg-[#E50914] hover:bg-[#C20812] text-white text-[9px] font-black tracking-[0.2em] uppercase px-3 py-1.5 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {checkoutLoading ? (
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Ending…
                      </span>
                    ) : (
                      "End Session"
                    )}
                  </button>
                ) : !todaySession?.check_in_time ? (
                  <Link
                    href="/member/scan"
                    className="bg-[#E50914] hover:bg-[#C20812] text-white text-[9px] font-black tracking-[0.2em] uppercase px-3 py-1.5 transition-colors duration-200"
                  >
                    Scan QR
                  </Link>
                ) : null
              )}
            </div>

            {checkoutError && (
              <p className="text-[#E50914] text-[9px] font-black tracking-[0.15em] uppercase mb-4">
                {checkoutError}
              </p>
            )}

            <div className="grid grid-cols-3 gap-4">
              {["Check-In", "Check-Out", "Duration"].map((label, i) => {
                const values: string[] = sessionLoading
                  ? ["—", "—", "—"]
                  : [
                      fmtTime(todaySession?.check_in_time),
                      fmtTime(todaySession?.check_out_time),
                      todaySession?.check_in_time
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
                          : i === 0 && todaySession?.check_in_time
                          ? "text-[#22c55e]"
                          : i === 2 && !todaySession?.check_out_time && todaySession?.check_in_time
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

        </main>
      </div>
    </ProtectedRoute>
  );
}
