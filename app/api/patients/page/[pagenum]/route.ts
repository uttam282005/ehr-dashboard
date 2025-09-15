import { fetchWithCache } from "@/actions/actions";
import { isApiError } from "@/lib/utils";
import { baseUrl, firmUrlPrefix } from "@/config";
import { fetcher } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, { params }: { params: { pagenum: string } }) {
  try {
    const { pagenum: pageNo } = await params;
    const url = `${baseUrl}/${firmUrlPrefix}/ema/fhir/v2/Patient/?page=${pageNo}`;
    console.log(url)
    const response = await fetchWithCache("patient:list", fetcher, url);
    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    return isApiError(error)
      ? NextResponse.json(error)
      : NextResponse.json({
        status: 500,
        message: "Internal server error",
        error
      })
  }
}
