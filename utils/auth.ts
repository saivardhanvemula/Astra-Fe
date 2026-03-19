export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("astra_token");
}

export function getStoredUser() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("astra_user");
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function clearAuth() {
  localStorage.removeItem("astra_token");
  localStorage.removeItem("astra_user");
}
