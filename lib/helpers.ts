import { getRedisClient } from "./redis";
import type { ApiError } from "./types";

export const isApiError = (response: any) => {
  return "code" in response;
}

type UserCreds = {
  apiKey?: string;
  accessToken?: string;
  refreshToken?: string;
};

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export const apiRequest = async <T = any>(
  url: string,
  method: HttpMethod,
  body?: Record<string, any>
): Promise<T> => {
  try {
    const redis = await getRedisClient();
    const creds = await redis.hGetAll(`ehr`) as UserCreds;

    if (!creds || !creds.apiKey || !creds.accessToken) {
      throw {
        code: "NOT_AUTHORIZED",
        message: "Api key not provided" ,
        status: 401,
      } as ApiError
    }

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${creds.accessToken}`,
        "Content-Type": "application/json",
        "x-api-key": creds.apiKey,
      },
      cache: "no-store",
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      let errorBody: any;
      try {
        errorBody = await res.json();
      } catch {
        errorBody = await res.text();
      }
      throw {
        code: "API_ERROR",
        message: errorBody.issue[0].diagnostics,
        status: res.status,
        details: errorBody,
      } as ApiError;
    }

    const data: T = await res.json();
    return data;
  } catch (err: any) {
    console.error(err.details);
    if (isApiError(err)) throw err;
    throw {
      code: "NETWORK_ERROR",
      message: "Unable to connect to EHR API",
      status: 0,
      details: err,
    } as ApiError;
  }
};

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

export function handleError(error: any) {
  const err =
    isApiError(error)
      ? error
      : {
        code: "UNKNOWN_ERROR",
        message: "Unexpected error occurred",
        status: 500,
        details: error,
      };

  console.error("error:", error);
  return err;
}

export const formatDate = (d: Date | string) =>
  new Date(d).toISOString().replace(/\.\d{3}Z$/, "Z");
