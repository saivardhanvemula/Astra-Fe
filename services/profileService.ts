/**
 * services/profileService.ts
 *
 * Client-side API functions for user profile management.
 */

import { apiClient } from "./apiClient";
import { getToken } from "@/utils/auth";
import type { UserProfile } from "@/types";

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getProfile(): Promise<UserProfile> {
  const res = await apiClient.get<{ success: boolean; data: UserProfile }>(
    "/api/profile",
    { headers: authHeaders() }
  );
  return res.data.data;
}

export async function updateProfile(
  data: Partial<UserProfile>
): Promise<UserProfile> {
  const res = await apiClient.put<{ success: boolean; data: UserProfile }>(
    "/api/profile",
    data,
    { headers: authHeaders() }
  );
  return res.data.data;
}

export async function uploadProfilePicture(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);
  const res = await apiClient.post<{ success: boolean; url: string }>(
    "/api/profile/upload",
    formData,
    {
      headers: {
        ...authHeaders(),
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data.url;
}
