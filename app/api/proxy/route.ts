import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const API_URL = process.env.NEXT_API;
  const API_TOKEN = process.env.NEXT_API_TOKEN;

  if (!API_URL || !API_TOKEN) {
    return NextResponse.json(
      { error: "API_URL or API_TOKEN is not defined" },
      { status: 500 }
    );
  }

  const { endpoint, body } = await request.json();

  if (!endpoint) {
    return NextResponse.json(
      { error: "Endpoint is required" },
      { status: 400 }
    );
  }

  const response = await fetch(`${API_URL}/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify(body || {}),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: `API Error: ${response.statusText}` },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}
