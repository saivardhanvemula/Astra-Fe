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
  expiry_date: string;
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
  checkin_time: string;
  checkout_time?: string | null;
  /** Duration in minutes; null while session is still open */
  duration_minutes?: number | null;
}

export interface TodaySession {
  checkin_time: string | null;
  checkout_time: string | null;
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
