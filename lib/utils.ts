import { accessToken, baseUrl, api_key, firmUrlPrefix } from "@/config";
import type { ApiError } from "./types";

export const isApiError = (response: any) => {
  return "code" in response;
} 

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export const apiRequest = async <T = any>(
  url: string,
  method: HttpMethod,
  body?: Record<string, any>
): Promise<T> => {
  try {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "x-api-key": api_key,
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
        message: `Failed to ${method} data`,
        status: res.status,
        details: errorBody,
      } as ApiError;
    }

    const data: T = await res.json();
    return data;
  } catch (err: any) {
    if (isApiError(err)) throw err;
    throw {
      code: "NETWORK_ERROR",
      message: "Unable to connect to EHR API",
      status: 0,
      details: err,
    } as ApiError;
  }
};
