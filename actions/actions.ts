import type { ApiError } from "@/lib/types";
import { apiRequest, isApiError } from "@/lib/utils";

export async function fetchWithCache<T>(
  key: string | null,
  url: string
): Promise<T> {
  try {
    // Optional: Redis or in-memory cache
    // if (key) {
    //   const cached = await redis.get(key);
    //   if (cached) return JSON.parse(cached) as T;
    // }

    const data = await apiRequest(url, "GET");

    // if (key) {
    //   await redis.set(key, JSON.stringify(data), "EX", ttl);
    // }

    return data;
  } catch (e: any) {
    const error: ApiError =
      isApiError(e)
        ? e
        : {
            code: "UNKNOWN_ERROR",
            message: "Unexpected error occurred",
            status: 500,
            details: e,
          };

    console.error("[fetchWithCache] error:", error);
    throw error;
  }
}

