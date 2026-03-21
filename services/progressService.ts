/**
 * services/progressService.ts
 *
 * Client-side API functions for the Weight Tracking / Progress resource.
 */

import { apiClient } from "./apiClient";
import { getToken } from "@/utils/auth";

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface WeightEntry {
  id: string;
  weight: number;
  /** ISO date string, e.g. "2026-03-22T10:30:00.000Z" */
  recorded_at: string;
}

export interface ProgressSummary {
  current_weight: number | null;
  starting_weight: number | null;
  weight_change: number | null;
  total_entries: number;
}

// ── API calls ─────────────────────────────────────────────────────────────────

/** POST a new weight entry for the authenticated member. */
export async function addWeight(
  weight: number
): Promise<{ success: boolean; message: string }> {
  const res = await apiClient.post<{ success: boolean; message: string }>(
    "/api/progress/weight",
    { weight },
    { headers: authHeaders() }
  );
  return res.data;
}

/** Fetch all weight entries for the authenticated member, newest first. */
export async function getWeightHistory(): Promise<WeightEntry[]> {
  const res = await apiClient.get<{
    success: boolean;
    data: WeightEntry[];
  }>("/api/progress/weight", { headers: authHeaders() });
  return res.data.data ?? [];
}

/** Fetch the progress summary card data for the authenticated member. */
export async function getProgressSummary(): Promise<ProgressSummary> {
  const res = await apiClient.get<{
    success: boolean;
    data: ProgressSummary;
  }>("/api/progress/summary", { headers: authHeaders() });
  return res.data.data;
}

export interface StreakData {
  current_streak: number;
}

/** Fetch the current check-in streak for the authenticated member. */
export async function getStreak(): Promise<StreakData> {
  const res = await apiClient.get<{
    success: boolean;
    data: StreakData;
  }>("/api/progress/streak", { headers: authHeaders() });
  return res.data.data;
}
