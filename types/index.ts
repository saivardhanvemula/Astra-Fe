export interface Plan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  popular?: boolean;
}

export interface Trainer {
  id: string;
  name: string;
  specialization: string;
  /** Number of years of experience (as returned by the API) */
  experience: number;
  bio: string;
  image?: string;
}

export interface Transformation {
  id: string;
  memberName: string;
  description: string;
  duration: string;
  weightLost?: string;
  beforeImage?: string;
  afterImage?: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface MemberFormData {
  name: string;
  phone: string;
  email: string;
  age: string;
  gender: string;
  fitness_goal: string;
  selected_plan: string;
}

// ── Admin: Dashboard ──────────────────────────────────────────────────────────

export interface DashboardSummary {
  total_members: number;
  active_members: number;
  expired_members: number;
  today_checkins: number;
  currently_in_gym: number;
}

export interface ExpiringMember {
  id: string;
  name: string;
  expiry_date: string;
  days_remaining: number;
}

export interface RecentMember {
  name: string;
  created_at: string;
}

export interface WeeklyCheckin {
  date: string;   // "Mon", "Tue" or "2026-03-18" — whatever the API returns
  count: number;
}

// ── Admin: Membership Plans ────────────────────────────────────────────────────

export interface AdminPlan {
  id: string;
  name: string;
  price: number;
  duration_days: number;
}

// ── Admin: Members ─────────────────────────────────────────────────────────────

export type MemberStatus = "active" | "expired" | "expiring_soon";

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan_id: string;
  plan_name: string;
  start_date: string;
  end_date: string;
  status: MemberStatus;
}

export interface MemberDashboardInfo {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  gender: string | null;
  join_date: string;
  plan_name: string;
  start_date: string;
  end_date: string;
  days_remaining: number;
  status: MemberStatus;
}

// ── Attendance / Sessions ──────────────────────────────────────────────────────

export interface QRTokenResponse {
  /** The signed token embedded in the QR code */
  token: string;
  /** Seconds until this token expires (used for countdown timer) */
  expires_in: number;
}

export interface AttendanceSession {
  id: string;
  member_id: string;
  member_name?: string;
  check_in_time: string;
  check_out_time?: string | null;
  /** Duration in minutes; null while session is still open */
  duration_minutes?: number | null;
}

export interface TodaySession {
  check_in_time: string | null;
  check_out_time: string | null;
  duration_minutes: number | null;
}

// ── User Profile ───────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  role?: string;
  age: number | null;
  gender: string;
  height: number | null;
  weight: number | null;
  fitness_goal: string;
  profile_picture: string | null;
  created_at?: string;
}

// ── Workouts ───────────────────────────────────────────────────────────────────

/** Shape used when creating a plan (sent to POST /workouts/plans) */
export interface WorkoutExercise {
  exercise_id: string;
  sets: number;
  reps: string; // API uses string e.g. "10"
  /** Populated by the API when fetching plans */
  exercise?: {
    id: string;
    name: string;
    muscle_group: string;
  };
}

export interface WorkoutDay {
  id?: string;
  day_number: number;
  title: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutPlan {
  id: string;
  name: string;
  days: WorkoutDay[];
  created_at?: string;
}

/** Shape returned by GET /workouts/member/:id */
export interface WorkoutExerciseDisplay {
  name: string;
  muscle_group: string;
  sets: number;
  reps: string;
}

export interface MemberWorkout {
  day: number;
  title: string;
  exercises: WorkoutExerciseDisplay[];
}

export interface AssignWorkoutPayload {
  member_id: string;
  plan_id: string;
}
