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
