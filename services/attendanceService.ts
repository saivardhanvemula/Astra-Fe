/**
 * services/attendanceService.ts
 *
 * Client-side API functions for QR-based attendance (check-in / check-out).
 */

import { apiClient } from "./apiClient";
import { getToken } from "@/utils/auth";
import type {
  QRTokenResponse,
  AttendanceSession,
  TodaySession,
} from "@/types";

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── Admin ──────────────────────────────────────────────────────────────────────

/** Fetch a fresh QR token for the check-in display screen. */
export async function getCheckinQR(): Promise<QRTokenResponse> {
  const res = await apiClient.get<QRTokenResponse>(
    "/api/sessions/qr/checkin",
    { headers: authHeaders() }
  );
  return res.data;
}

/** Fetch all attendance records (admin view). */
export async function getAttendanceLogs(): Promise<AttendanceSession[]> {
  const res = await apiClient.get<{
    success: boolean;
    data: AttendanceSession[];
  }>("/api/sessions", { headers: authHeaders() });
  return res.data.data;
}

/** Manually check out a specific session (admin action). */
export async function adminCheckout(sessionId: string): Promise<AttendanceSession> {
  const res = await apiClient.post<{
    success: boolean;
    data: AttendanceSession;
  }>(`/api/sessions/${sessionId}/checkout`, {}, { headers: authHeaders() });
  return res.data.data;
}

// ── Member ─────────────────────────────────────────────────────────────────────

/** Submit a scanned QR token to record a check-in. */
export async function checkin(token: string): Promise<AttendanceSession> {
  const res = await apiClient.post<{
    success: boolean;
    data: AttendanceSession;
  }>("/api/sessions/checkin", { token }, { headers: authHeaders() });
  return res.data.data;
}

/** Record a check-out for the currently active session. */
export async function checkout(): Promise<AttendanceSession> {
  const res = await apiClient.post<{
    success: boolean;
    data: AttendanceSession;
  }>("/api/sessions/checkout", {}, { headers: authHeaders() });
  return res.data.data;
}

/** Fetch the member's session information for today. */
export async function getTodaySession(): Promise<TodaySession> {
  const res = await apiClient.get<{ success: boolean; data: TodaySession }>(
    "/api/sessions/today",
    { headers: authHeaders() }
  );
  return res.data.data;
}
