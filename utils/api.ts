import { apiClient } from "@/services/apiClient";
import { getToken } from "@/utils/auth";
import type { AuthUser } from "@/context/AuthContext";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: AuthUser;
}

export async function loginRequest(payload: LoginPayload): Promise<LoginResponse> {
  const res = await apiClient.post<LoginResponse>("/api/auth/login", payload);
  return res.data;
}

// ── Password management ────────────────────────────────────────────────────────

export async function changePassword(
  current_password: string,
  new_password: string
): Promise<void> {
  const token = getToken();
  await apiClient.post(
    "/api/auth/change-password",
    { current_password, new_password },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
}

export async function forgotPassword(email: string): Promise<void> {
  await apiClient.post("/api/auth/forgot-password", { email });
}

export async function resetPassword(
  token: string,
  new_password: string
): Promise<void> {
  await apiClient.post("/api/auth/reset-password", { token, new_password });
}
