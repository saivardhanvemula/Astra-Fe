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
