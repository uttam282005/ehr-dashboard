"use server";

import { fetchWithCache, handleError } from "@/lib/helpers";
import { apiRequest, formatDate } from "@/lib/helpers";
import { baseUrl, firmUrlPrefix } from "@/config";

type Entity = "Patient" | "Appointment" | "Slot";

export async function fetchEntityByPage(entity: Entity, pageNo: number) {
  try {
    const url = `${baseUrl}/${firmUrlPrefix}/ema/fhir/v2/${entity}?page=${pageNo}`;

    const response = await fetchWithCache(null, url);

    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    return {
      success: false,
      error: handleError(error)
    }
  }
}

// fetchEntity by search params
export async function fetchEntity(
  entity: Entity,
  searchParams?: Record<string, any>
) {
  try {
    let url = `${baseUrl}/${firmUrlPrefix}/ema/fhir/v2/${entity}/`;

    if (searchParams && Object.keys(searchParams).length > 0) {
      url += "?";

      for (const [key, value] of Object.entries(searchParams)) {
        if (!value) continue;

        if (key === "date2") {
          url += `date=${value}&`;
          continue;
        }

        url += `${key}=${value}&`;
      }
    }

    url = url.slice(0, url.length - 1);
    console.log(url)
    const response = await fetchWithCache("patient:list", url);
    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    return {
      success: false,
      error: handleError(error)
    }
  }
}

export async function fetchEntityById(entity: Entity, id: string) {
  try {

    let url = `${baseUrl}/${firmUrlPrefix}/ema/fhir/v2/${entity}/${id}`;

    const response = await fetchWithCache(null, url);

    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    return {
      success: false,
      error: handleError(error)
    }
  }
}

//TODO: add payload type
export async function createEntity(entity: Entity, body: any) {
  try {
    let url = `${baseUrl}/${firmUrlPrefix}/ema/fhir/v2/${entity}`;
    console.log(url)
    const response = await apiRequest(url, "POST", body);
    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    return {
      success: false,
      error: handleError(error)
    }
  }
}

export async function updateEntity(entity: Entity, id: string, body: any) {
  try {
    const url = `${baseUrl}/${firmUrlPrefix}/ema/fhir/v2/${entity}/${id}`;
    const response = await apiRequest(url, "PUT", body);
    return {
      success: true,
      data: response,
    };
  } catch (error: any) {
    return {
      success: false,
      error: handleError(error)
    }
  }
}


export async function createAppointment(body: any) {
  try {
    const { appointmentType, start } = body;


    const startDate = formatDate(start);

    const slots = (await fetchEntity("Slot", {
      "appointment-type": appointmentType.coding[0].code,
      date: `eq${startDate}`,
    })) as any;

    if (slots.entry && slots.entry.length > 0) {
      const data = await createEntity("Appointment", body);
      return {
        success: true,
        data,
      };
    } else {
      return {
        success: false,
        error: {
          code: "NO_SLOT_AVAILABLE",
          message: "No available slots",
        },
      };
    }
  } catch (error: any) {
    return {
      success: false,
      error: handleError(error)
    }
  }
}

