"use server";

import { fetchWithCache } from "@/actions/actions";
import { fetcher, isApiError, postWrapper } from "@/lib/utils";
import { baseUrl, firmUrlPrefix } from "@/config";
import { ApiError } from "@/lib/types"; 

export async function fetchEntityByPage(pageNo: number) {
  try {
    const url = `${baseUrl}/${firmUrlPrefix}/ema/fhir/v2/Patient?page=${pageNo}`;

    const response = await fetchWithCache("patient:list", fetcher, url);

    return response;
  } catch (error: any) {
    if (isApiError(error)) {
      throw error;
    }
    throw {
      code: "SERVER_ACTION_ERROR",
      message: "Failed to fetch patients",
      status: 500,
      details: error,
    };
  }
}

// fetchEntity by search params
export async function fetchEntity(
  searchParams?: Record<string, string>
) {
  try {
    let url = `${baseUrl}/${firmUrlPrefix}/ema/fhir/v2/Patient/`;

    if (searchParams && Object.keys(searchParams).length > 0) {
      url += "?"
      for (const [key, value] of Object.entries(searchParams)) {
        if (value) {
          url += `&${key}=${value}`;
        }
      }
    }

    const response = await fetchWithCache("patient:list", fetcher, url);
    return response;
  } catch (error: any) {
    if (isApiError(error)) {
      throw error;
    }

    const fallbackError: ApiError = {
      code: "SERVER_ACTION_ERROR",
      message: "Internal server error",
      status: 500,
      details: error,
    };
    throw fallbackError;
  }
}

export async function fetchEntityById(id: string) {
  try {

    let url = `${baseUrl}/${firmUrlPrefix}/ema/fhir/v2/Patient/${id}`;

    const response = await fetchWithCache(null, fetcher, url);

    return response;
  } catch(error: any) {
    if (isApiError(error)) {
      throw error;
    }

    const fallbackError: ApiError = {
      code: "SERVER_ACTION_ERROR",
      message: "Internal server error",
      status: 500,
      details: error,
    };
    throw fallbackError;
  } 
}

//TODO: add payload type
export async function createEntity(body: any) {
  try {
    const url = `${baseUrl}/${firmUrlPrefix}/ema/fhir/v2/Patient`;
    const response = await postWrapper(url, body);
    return response;
  } catch (error: any) {
    if (isApiError(error)) {
      throw error;
    }
    const fallbackError: ApiError = {
      code: "SERVER_ACTION_ERROR",
      message: "Internal server error",
      status: 500,
      details: error,
    };
    throw fallbackError;
  }
}
