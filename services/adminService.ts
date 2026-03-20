/**
 * services/adminService.ts
 *
 * Client-side API functions for admin member management and member dashboard.
 */

import { apiClient } from "./apiClient";
import { getToken } from "@/utils/auth";
import type {
  AdminPlan,
  Member,
  MemberDashboardInfo,
  DashboardSummary,
  ExpiringMember,
  RecentMember,
  WeeklyCheckin,
} from "@/types";

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── Plans ──────────────────────────────────────────────────────────────────────

export async function getAdminPlans(): Promise<AdminPlan[]> {
  const res = await apiClient.get<{ success: boolean; data: AdminPlan[] }>(
    "/api/plans",
    { headers: authHeaders() }
  );
  return res.data.data;
}

export async function createPlan(data: {
  name: string;
  price: number;
  duration_days: number;
}): Promise<AdminPlan> {
  const res = await apiClient.post<{ success: boolean; data: AdminPlan }>(
    "/api/plans",
    data,
    { headers: authHeaders() }
  );
  return res.data.data;
}

// ── Members ────────────────────────────────────────────────────────────────────

export async function getMembers(): Promise<Member[]> {
  const res = await apiClient.get<{ success: boolean; data: Member[] }>(
    "/api/members",
    { headers: authHeaders() }
  );
  return res.data.data;
}

export async function createMember(data: {
  name: string;
  email: string;
  phone: string;
  plan_id: string;
  start_date: string;
}): Promise<Member> {
  const res = await apiClient.post<{ success: boolean; data: Member }>(
    "/api/members",
    data,
    { headers: authHeaders() }
  );
  return res.data.data;
}

// ── Member self ────────────────────────────────────────────────────────────────

export async function getMemberMembership(): Promise<MemberDashboardInfo> {
  const res = await apiClient.get<{
    success: boolean;
    data: MemberDashboardInfo;
  }>("/api/members/me", { headers: authHeaders() });
  return res.data.data;
}

// ── Admin Dashboard ────────────────────────────────────────────────────────────

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const res = await apiClient.get<DashboardSummary>(
    "/api/admin/dashboard/summary",
    { headers: authHeaders() }
  );
  return res.data;
}

export async function getExpiringMembers(): Promise<ExpiringMember[]> {
  const res = await apiClient.get<ExpiringMember[]>(
    "/api/admin/dashboard/expiring",
    { headers: authHeaders() }
  );
  return res.data;
}

export async function getRecentMembers(): Promise<RecentMember[]> {
  const res = await apiClient.get<RecentMember[]>(
    "/api/admin/dashboard/recent-members",
    { headers: authHeaders() }
  );
  return res.data;
}

export async function getWeeklyCheckins(): Promise<WeeklyCheckin[]> {
  const res = await apiClient.get<WeeklyCheckin[]>(
    "/api/admin/dashboard/weekly-checkins",
    { headers: authHeaders() }
  );
  return res.data;
}