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
  const json = await serverFetch<ApiTrainersResponse>("/api/trainers", {
    revalidate: 3600,
    tags: ["trainers"],
  });
  return json.data;
}
