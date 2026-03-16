/**
 * services/planService.ts
 *
 * API functions for the Plans resource.
 * Uses serverFetch for Next.js ISR caching (server-side only).
 */

import { serverFetch } from "./apiClient";
import type { Plan } from "@/types";

/** Shape returned by GET /api/plans */
interface ApiPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
}

interface ApiPlansResponse {
  success: boolean;
  count: number;
  data: ApiPlan[];
}

/**
 * The plan name to highlight as "Most Popular".
 * Derived client-side since the API doesn't return this field.
 */
const POPULAR_PLAN_NAME = "Quarterly";

/**
 * Fetch all membership plans.
 * Cached by Next.js ISR — revalidates once per hour.
 */
export async function getPlans(): Promise<Plan[]> {
  try {
    const json = await serverFetch<ApiPlansResponse>("/api/plans", {
      revalidate: 3600,
      tags: ["plans"],
    });

    return json.data.map((plan) => ({
      ...plan,
      popular: plan.name === POPULAR_PLAN_NAME,
    }));
  } catch (err) {
    // Fail safe: log and return empty array so page generation doesn't fail
    // during builds when the API is unreachable.
    // eslint-disable-next-line no-console
    console.error("getPlans failed:", err);
    return [];
  }
}
