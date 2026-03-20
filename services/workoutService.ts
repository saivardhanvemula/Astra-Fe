import { apiClient } from "./apiClient";
import { getToken } from "@/utils/auth";
import type {
  WorkoutPlan,
  WorkoutDay,
  MemberWorkout,
  AssignWorkoutPayload,
} from "@/types";

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── Admin ──────────────────────────────────────────────────────────────────────

export async function getWorkoutPlans(): Promise<WorkoutPlan[]> {
  const res = await apiClient.get<{ success: boolean; data: WorkoutPlan[] }>(
    "/api/workouts/plans",
    { headers: authHeaders() }
  );
  return res.data.data;
}

export async function createWorkoutPlan(data: {
  name: string;
  days: WorkoutDay[];
}): Promise<WorkoutPlan> {
  const res = await apiClient.post<{ success: boolean; data: WorkoutPlan }>(
    "/api/workouts/plans",
    data,
    { headers: authHeaders() }
  );
  return res.data.data;
}

export async function assignWorkoutPlan(
  payload: AssignWorkoutPayload
): Promise<void> {
  await apiClient.post("/api/workouts/assign", payload, {
    headers: authHeaders(),
  });
}

// ── Member ─────────────────────────────────────────────────────────────────────

export async function getMyWorkout(memberId: string): Promise<MemberWorkout> {
  const res = await apiClient.get<{ success: boolean; data: MemberWorkout }>(
    `/api/workouts/member/${memberId}`,
    { headers: authHeaders() }
  );
  return res.data.data;
}

export async function completeWorkout(memberId: string): Promise<{ next_day: number }> {
  const res = await apiClient.post<{ success: boolean; data: { next_day: number } }>(
    "/api/workouts/complete",
    { member_id: memberId },
    { headers: authHeaders() }
  );
  return res.data.data;
}
