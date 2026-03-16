/**
 * services/trainerService.ts
 *
 * API functions for the Trainers resource.
 * Uses serverFetch for Next.js ISR caching (server-side only).
 */

import { serverFetch } from "./apiClient";
import type { Trainer } from "@/types";

interface ApiTrainersResponse {
  success: boolean;
  count: number;
  data: Trainer[];
}

/**
 * Fetch all trainers.
 * Cached by Next.js ISR — revalidates once per hour.
 */
export async function getTrainers(): Promise<Trainer[]> {
  try {
    const json = await serverFetch<ApiTrainersResponse>("/api/trainers", {
      revalidate: 3600,
      tags: ["trainers"],
    });
    return json.data;
  } catch (err) {
    // Fail safe for build-time: log and return empty array when API is unreachable
    // eslint-disable-next-line no-console
    console.error("getTrainers failed:", err);
    return [];
  }
}
