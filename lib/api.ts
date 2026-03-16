/**
 * lib/api.ts — re-exports from services/apiClient & services/memberService.
 *
 * Kept for backward compatibility. Prefer importing directly from
 * @/services/apiClient or the relevant service file.
 */

export { apiClient as default, apiClient, serverFetch } from "@/services/apiClient";
export { submitMemberForm } from "@/services/memberService";
