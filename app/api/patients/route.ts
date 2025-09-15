import { fetchWithCache } from "@/actions/actions";
import { baseUrl, firmUrlPrefix } from "@/config";
import { isApiError } from "@/lib/utils";
import { fetcher } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    let url = `${baseUrl}/${firmUrlPrefix}/ema/fhir/v2/Patient`;
    const searchParams = req.nextUrl.searchParams;

    if ([...searchParams].length > 0) {
      url += "?"
      for (const [key, value] of searchParams.entries()) {
        if (value) {
          url += `&${key}=${value}`;
        }
      }
    }

    const response = await fetchWithCache("patient:list", fetcher, url);
    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    return isApiError(error)
      ? NextResponse.json(error)
      : NextResponse.json({
          status: 500,
          message: "Internal server error",
          error,
        });
  }
}
