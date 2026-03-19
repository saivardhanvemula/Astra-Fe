/**
 * services/adminService.ts
 *
 * Client-side API functions for admin member management and member dashboard.
 */

import { apiClient } from "./apiClient";
import { getToken } from "@/utils/auth";
import type { AdminPlan, Member, MemberDashboardInfo } from "@/types";

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