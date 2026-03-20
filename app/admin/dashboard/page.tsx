"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import StatCard from "@/components/StatCard";
import CheckinChart from "@/components/CheckinChart";
import ExpiringList from "@/components/ExpiringList";
import RecentMembers from "@/components/RecentMembers";
import {
  getDashboardSummary,
  getExpiringMembers,
  getRecentMembers,
  getWeeklyCheckins,
} from "@/services/adminService";
import type {
  DashboardSummary,
  ExpiringMember,
  RecentMember,
  WeeklyCheckin,
} from "@/types";

// ── Icon helpers ───────────────────────────────────────────────────────────────

function Icon({ d }: { d: string }) {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

const ICONS = {
  total: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0",
  active: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  expired: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
  checkin: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  gym: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
};

// ── Page ───────────────────────────────────────────────────────────────────────

function useAsync<T>(
  fn: () => Promise<T>
): { data: T | null; loading: boolean; error: string | null } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fn()
      .then(setData)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Failed to load.")
      )
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, error };
}

export default function AdminDashboard() {
  const summary = useAsync<DashboardSummary>(getDashboardSummary);
  const expiring = useAsync<ExpiringMember[]>(getExpiringMembers);
  const recent = useAsync<RecentMember[]>(getRecentMembers);
  const checkins = useAsync<WeeklyCheckin[]>(getWeeklyCheckins);

  const s = summary.data;

  return (
    <AdminShell>
      {/* ── Heading ── */}
      <div className="mb-8">
        <p className="text-[#E50914] text-[10px] font-black tracking-[0.3em] uppercase mb-2">
          Admin
        </p>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
          Dashboard
        </h1>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <StatCard
          label="Total Members"
          value={s?.total_members}
          loading={summary.loading}
          icon={<Icon d={ICONS.total} />}
        />
        <StatCard
          label="Active"
          value={s?.active_members}
          loading={summary.loading}
          valueColor="text-[#22c55e]"
          icon={<Icon d={ICONS.active} />}
        />
        <StatCard
          label="Expired"
          value={s?.expired_members}
          loading={summary.loading}
          valueColor="text-[#E50914]"
          icon={<Icon d={ICONS.expired} />}
        />
        <StatCard
          label="Today Check-Ins"
          value={s?.today_checkins}
          loading={summary.loading}
          valueColor="text-[#60a5fa]"
          icon={<Icon d={ICONS.checkin} />}
        />
        <StatCard
          label="In Gym Now"
          value={s?.currently_in_gym}
          loading={summary.loading}
          valueColor="text-[#a78bfa]"
          icon={<Icon d={ICONS.gym} />}
        />
      </div>

      {/* ── Chart ── */}
      <div className="mb-8">
        <CheckinChart
          data={checkins.data ?? []}
          loading={checkins.loading}
          error={checkins.error}
        />
      </div>

      {/* ── Bottom two panels ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpiringList
          data={expiring.data ?? []}
          loading={expiring.loading}
          error={expiring.error}
        />
        <RecentMembers
          data={recent.data ?? []}
          loading={recent.loading}
          error={recent.error}
        />
      </div>
    </AdminShell>
  );
}

