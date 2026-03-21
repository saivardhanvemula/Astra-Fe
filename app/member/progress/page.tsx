"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import WeightForm from "@/components/WeightForm";
import WeightChart from "@/components/WeightChart";
import SummaryCards from "@/components/SummaryCards";
import {
  getWeightHistory,
  getProgressSummary,
} from "@/services/progressService";
import type { WeightEntry, ProgressSummary } from "@/services/progressService";

export default function MemberProgressPage() {
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loggedDates = entries.map((e) => e.recorded_at);

  const refreshAll = useCallback(async () => {
    setHistoryLoading(true);
    setSummaryLoading(true);
    setError(null);
    try {
      const [hist, sum] = await Promise.all([
        getWeightHistory(),
        getProgressSummary(),
      ]);
      setEntries(hist);
      setSummary(sum);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load progress data."
      );
    } finally {
      setHistoryLoading(false);
      setSummaryLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  /** Called by WeightForm after a successful POST — append optimistic entry
   *  then re-fetch summary so the cards reflect the real server values. */
  function handleWeightAdded(entry: WeightEntry) {
    setEntries((prev) => [entry, ...prev]);
    // Re-fetch summary in background for accurate card values
    getProgressSummary()
      .then(setSummary)
      .catch(() => {/* non-critical */});
  }

  return (
    <ProtectedRoute allowedRole="member">
      <div className="min-h-screen bg-[#0A0A0A] text-white">
        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="border-b border-[#1A1A1A]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black tracking-[0.25em] uppercase text-[#555] mb-1">
                Member
              </p>
              <h1 className="text-2xl font-black uppercase tracking-tight">
                Progress
              </h1>
            </div>
            <Link
              href="/member/dashboard"
              className="text-[10px] font-black tracking-[0.15em] uppercase text-[#555]
                         hover:text-white transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Dashboard
            </Link>
          </div>
        </div>

        {/* ── Body ────────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

          {/* Global error banner */}
          {error && (
            <div className="border border-[#E50914] bg-[#1f0a0a] px-5 py-4 flex items-center justify-between gap-4">
              <p className="text-[#E50914] text-sm font-semibold">{error}</p>
              <button
                onClick={refreshAll}
                className="text-[10px] font-black tracking-[0.15em] uppercase text-[#E50914]
                           hover:text-white transition-colors duration-200 whitespace-nowrap"
              >
                Retry
              </button>
            </div>
          )}

          {/* 1 ── Add Weight */}
          <WeightForm onSuccess={handleWeightAdded} loggedDates={loggedDates} />

          {/* 2 ── Summary Cards */}
          <SummaryCards summary={summary} loading={summaryLoading} />

          {/* 3 ── Weight Chart */}
          <WeightChart entries={entries} loading={historyLoading} />

        </div>
      </div>
    </ProtectedRoute>
  );
}
