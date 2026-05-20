import { RETRY, ERROR_MESSAGES } from "@/constants";
import type { ApiResponse } from "@/types";

class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string,
    public retryable: boolean
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  attempt = 1
): Promise<Response> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    return res;
  } catch (err) {
    if (attempt >= RETRY.MAX_ATTEMPTS) throw err;
    const backoff = Math.min(
      RETRY.BASE_DELAY_MS * Math.pow(2, attempt - 1),
      RETRY.MAX_DELAY_MS
    );
    await delay(backoff);
    return fetchWithRetry(url, options, attempt + 1);
  }
}

async function handleResponse<T>(res: Response): Promise<ApiResponse<T>> {
  if (res.status === 429) {
    throw new ApiClientError(
      ERROR_MESSAGES.RATE_LIMIT,
      429,
      "RATE_LIMITED",
      true
    );
  }
  if (res.status === 401) {
    throw new ApiClientError(
      ERROR_MESSAGES.UNAUTHORIZED,
      401,
      "UNAUTHORIZED",
      false
    );
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiClientError(
      body.error || ERROR_MESSAGES.SERVER,
      res.status,
      body.code || "SERVER_ERROR",
      res.status >= 500
    );
  }
  const json = await res.json();
  return {
    data: json.data ?? json,
    error: null,
    meta: {
      timestamp: json.meta?.timestamp ?? new Date().toISOString(),
      version: json.meta?.version ?? "",
      cached: json.meta?.cached ?? false,
    },
  };
}

const cache = new Map<string, { data: unknown; expiry: number }>();

function getCached<T>(key: string, ttl: number): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() < entry.expiry) return entry.data as T;
  cache.delete(key);
  return null;
}

function setCache<T>(key: string, data: T, ttl: number): void {
  cache.set(key, { data, expiry: Date.now() + ttl });
  if (cache.size > 100) {
    const first = cache.keys().next().value;
    if (first) cache.delete(first);
  }
}

export const api = {
  async get<T>(path: string, opts?: { ttl?: number; token?: string }): Promise<ApiResponse<T>> {
    const cached = opts?.ttl ? getCached<T>(path, opts.ttl) : null;
    if (cached) return { data: cached, error: null, meta: { timestamp: new Date().toISOString(), version: "", cached: true } };

    const headers: Record<string, string> = {};
    if (opts?.token) headers["Authorization"] = `Bearer ${opts.token}`;

    const res = await fetchWithRetry(path, { headers });
    const result = await handleResponse<T>(res);
    if (opts?.ttl && result.data) setCache(path, result.data, opts.ttl);
    return result;
  },

  async post<T>(path: string, body: unknown, token?: string): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetchWithRetry(path, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    return handleResponse<T>(res);
  },

  invalidate(path: string): void {
    cache.delete(path);
  },

  ApiClientError,
};

export { ApiClientError };
