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

  const res = await fetch(`${BASE_URL}${path}`, options);

  if (!res.ok) {
    throw new Error(`API error ${res.status} — ${path}`);
  }

  return res.json() as Promise<T>;
}
