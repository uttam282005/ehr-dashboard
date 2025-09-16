import { accessToken, baseUrl, api_key, firmUrlPrefix } from "@/config";
import type { ApiError } from "./types";

export const isApiError = (response: any) => {
  return "code" in response;
} 

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export const apiRequest = 
async function request<T = any>(
  url: string,
  method: HttpMethod,
  body?: Record<string, any>
): Promise<T> {
  try {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "x-api-key": api_key,
      },
      cache: "no-store",
      body: method !== "GET" && body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      let errorBody: any;
      try {
        errorBody = await res.json();
      } catch {
        errorBody = await res.text();
      }

      if (errorBody?.resourceType === "OperationOutcome") {
        const diagnostics = errorBody.issue
          ?.map((i: any) => i.diagnostics || i.code)
          .join(", ");
        throw {
          code: "API_ERROR",
          message: diagnostics || `Failed to ${method} data`,
          status: res.status,
          details: errorBody,
        } as ApiError;
      }

      throw {
        code: "API_ERROR",
        message: `Failed to ${method} data`,
        status: res.status,
        details: errorBody,
      } as ApiError;
    }

    if (res.status === 204) return {} as T; // no content
    const data: T = await res.json();
    return data;
  } catch (err: any) {
    if (isApiError(err)) throw err;

    throw {
      code: "NETWORK_ERROR",
      message:
        err?.name === "AbortError"
          ? "Request was aborted"
          : "Unable to connect to EHR API",
      status: 0,
      details: err,
    } as ApiError;
  }
};

export function handleError(error: any) {
    if (isApiError(error)) {
      return {
        success: false,
        error
      };
    }

    return {
      success: false,
      error: {
        code: "SERVER_ACTION_ERROR",
        message: "Internal server error",
        status: 500,
        details: error,
      },
    };
}

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
