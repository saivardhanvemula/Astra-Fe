/**
 * services/apiClient.ts
 *
 * Central API client for the Astra frontend.
 *
 * Two transports are exported:
 *  - `apiClient`    — Axios instance for client-side calls (mutations, form
 *                     submissions). Safe to use inside Client Components and
 *                     Route Handlers.
 *  - `serverFetch`  — Thin wrapper around the native `fetch` for Server
 *                     Components. Supports Next.js ISR (revalidate) and
 *                     on-demand cache tags out of the box.
 *
 * All service files in this folder should import from here rather than
 * creating their own HTTP client instances.
 */

import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ─── Axios client ─────────────────────────────────────────────────────────────
// Use for client-side POST / PATCH / DELETE requests (forms, mutations).

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    // 401 Unauthorized → token expired or invalid; clear session and redirect to login
    if (err.response?.status === 401) {
      localStorage.removeItem("astra_token");
      localStorage.removeItem("astra_user");
      window.location.replace("/login");
      return Promise.reject(new Error("Session expired. Please log in again."));
    }
    const message: string =
      err.response?.data?.message || "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);

// ─── Server fetch ─────────────────────────────────────────────────────────────
// Use inside async Server Components for GET requests.
// Leverages Next.js extended `fetch` options (ISR + cache tags).

interface ServerFetchOptions {
  /**
   * How long (in seconds) the response should be cached by Next.js ISR.
   * Pass `false` to disable caching entirely (`cache: "no-store"`).
   * Defaults to 3600 (1 hour).
   */
  revalidate?: number | false;
  /** Cache tags for on-demand revalidation via `revalidateTag()`. */
  tags?: string[];
}

type NextFetch = RequestInit & {
  next?: { revalidate?: number | false; tags?: string[] };
};

export async function serverFetch<T>(
  path: string,
  { revalidate = 3600, tags }: ServerFetchOptions = {}
): Promise<T> {
  const options: NextFetch =
    revalidate === false
      ? { cache: "no-store" }
      : { next: { revalidate, ...(tags?.length ? { tags } : {}) } };

  // Add an AbortController-based timeout so builds don't hang when the
  // upstream API is unreachable (e.g. localhost during Vercel builds).
  const timeoutMs = Number(process.env.SERVER_FETCH_TIMEOUT_MS) || 10000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${BASE_URL}${path}`, { ...options, signal: controller.signal });
    clearTimeout(timer);

    if (!res.ok) {
      throw new Error(`API error ${res.status} — ${path}`);
    }

    return res.json() as Promise<T>;
  } catch (err: any) {
    clearTimeout(timer);
    if (err?.name === "AbortError") {
      throw new Error(`Request timed out after ${timeoutMs}ms — ${path}`);
    }
    throw err;
  }
}
