import { NextResponse } from "next/server";
import { getRedisClient } from "@/lib/redis";
import { baseUrl, firmUrlPrefix } from "@/config";

export async function POST(req: Request) {
  try {
    const { username, password, apiKey } = await req.json();
    const redis = await getRedisClient();

    const body = new URLSearchParams();
    body.set('grant_type', 'password');
    body.set('username', username);
    body.set('password', password);

    console.log(body)
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/x-www-form-urlencoded',
        'x-api-key': apiKey
      },
      body
    };

    const resp = await fetch(`${baseUrl}/${firmUrlPrefix}/ema/ws/oauth2/grant`, options);

    const data = await resp.json();
    console.log(data);
    if (!resp.ok) return NextResponse.json(data, { status: resp.status });

    await redis.hSet(`ehr`, {
      apiKey: apiKey || "",
      accessToken: data.access_token || "",
      refreshToken: data.refresh_token || "",
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch tokens" }, { status: 500 });
  }
}

