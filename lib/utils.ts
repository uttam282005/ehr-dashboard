import { accessToken, baseUrl, api_key, firmUrlPrefix } from "@/config";
import type { ApiError } from "./types";

export const isApiError = (response: any) => {
  return "code" in response;
} 

export const fetcher = async (url: string) => {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "x-api-key": api_key,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw {
        code: "API_ERROR",
        message: "Failed to fetch patient records",
        status: res.status,
        details: res.bodyUsed,
      } as ApiError;
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    if (isApiError(err)) throw err; // already an ApiError

    throw {
      code: "NETWORK_ERROR",
      message: "Unable to connect to EHR API",
      status: 0,
      details: err,
    } as ApiError;
  }
};

export const postWrapper = async (url: string, body: Record<string, any>) => {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "x-api-key": api_key,
      },
      cache: "no-store",
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errorBody = await res.json();
      throw {
        code: "API_ERROR",
        message: "Failed to submit data",
        status: res.status,
        details: errorBody,
      } as ApiError;
    }
    const data = await res.json();
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
