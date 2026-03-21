/**
 * services/workoutLog.ts
 *
 * Client-side API functions for the Workout Logging resource.
 */

import { apiClient } from "./apiClient";
import { getToken } from "@/utils/auth";

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SetLog {
  set_number: number;
  weight: number;
  reps: number;
}

export interface ExerciseLog {
  exercise_id?: string;
  exercise_name: string;
  muscle_group?: string;
  sets: SetLog[];
}

export interface WorkoutLogPayload {
  workout_day: number;
  day_title: string;
  exercises: ExerciseLog[];
}

export interface WorkoutLogEntry {
  id: string;
  logged_at: string;
  workout_day: number;
  day_title: string;
  exercises: ExerciseLog[];
}

export interface ExerciseProgressPoint {
  date: string;
  max_weight: number;
  avg_weight?: number;
}

// ── API calls ─────────────────────────────────────────────────────────────────

/** POST a new workout log entry for the authenticated member. */
export async function logWorkout(
  payload: WorkoutLogPayload
): Promise<{ success: boolean; message: string }> {
  const res = await apiClient.post<{ success: boolean; message: string }>(
    "/api/workout-logs",
    payload,
    { headers: authHeaders() }
  );
  return res.data;
}

/** Fetch all workout log entries for the authenticated member, newest first. */
export async function getWorkoutHistory(): Promise<WorkoutLogEntry[]> {
  const res = await apiClient.get<{
    success: boolean;
    data: WorkoutLogEntry[];
  }>("/api/workout-logs", { headers: authHeaders() });
  return res.data.data ?? [];
}

/**
 * Fetch weight progression for a specific exercise.
 * exerciseId may be a UUID or URL-encoded exercise name depending on the backend.
 */
export async function getExerciseProgress(
  exerciseId: string
): Promise<ExerciseProgressPoint[]> {
  const res = await apiClient.get<{
    success: boolean;
    data: ExerciseProgressPoint[];
  }>(`/api/workout-logs/exercise/${encodeURIComponent(exerciseId)}`, {
    headers: authHeaders(),
  });
  return res.data.data ?? [];
}
