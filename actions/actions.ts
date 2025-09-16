"use server";

import { fetchWithCache } from "@/lib/utils";
import { apiRequest, isApiError } from "@/lib/utils";
import { baseUrl, firmUrlPrefix } from "@/config";
import { ApiError } from "@/lib/types";

type Entity = "Patient" | "Appointment" | "Slot";

export async function fetchEntityByPage(entity: Entity, pageNo: number) {
  try {
    const url = `${baseUrl}/${firmUrlPrefix}/ema/fhir/v2/${entity}?page=${pageNo}`;

    const response = await fetchWithCache(null, url);

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
  entity: Entity,
  searchParams?: Record<string, string>
) {
  try {
    let url = `${baseUrl}/${firmUrlPrefix}/ema/fhir/v2/${entity}/`;

    if (searchParams && Object.keys(searchParams).length > 0) {
      url += "?"
      for (const [key, value] of Object.entries(searchParams)) {
        if (key === "date2") {
          url += `date=${value}`; continue;
        }
        if (value) {
          url += `${key}=${value}&`;
        }
      }
    }

    url = url.slice(0, url.length - 1);
    console.log(url)
    const response = await fetchWithCache("patient:list", url);
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

export async function fetchEntityById(entity: Entity, id: string) {
  try {

    let url = `${baseUrl}/${firmUrlPrefix}/ema/fhir/v2/${entity}/${id}`;

    const response = await fetchWithCache(null, url);

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

//TODO: add payload type
export async function createEntity(entity: Entity, body: any) {
  try {
    const url = `${baseUrl}/${firmUrlPrefix}/ema/fhir/v2/${entity}`;
    const response = await apiRequest(url, "POST", body);
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

export async function updateEntity(entity: Entity, id: string, body: any) {
  try {
    const url = `${baseUrl}/${firmUrlPrefix}/ema/fhir/v2/${entity}/${id}`;
    const response = await apiRequest(url, "PUT", body);
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

export async function createAppointment(body: any) {
  try {
    const res = await fetchEntity("Slot", {
      ...body
    }) as any
    if (res.status !== "busy") {
      const res = createEntity("Appointment", body);
      return res;
    }
  } catch (e: any) {

  }
}
