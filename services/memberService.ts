/**
 * services/memberService.ts
 *
 * API functions for the Members resource.
 * Intended for use inside Client Components (form submissions).
 */

import { apiClient } from "./apiClient";
import type { MemberFormData } from "@/types";

export async function submitMemberForm(data: MemberFormData) {
  const response = await apiClient.post<{ success: boolean; message: string }>(
    "/api/members",
    data
  );
  return response.data;
}
