import { apiClient } from "@/services/apiClient";
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
