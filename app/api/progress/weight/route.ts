import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function forwardHeaders(req: NextRequest): HeadersInit {
  const auth = req.headers.get("authorization");
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (auth) headers["authorization"] = auth;
  return headers;
}

/** GET /api/progress/weight — fetch weight history */
export async function GET(req: NextRequest) {
  try {
    const res = await fetch(`${BACKEND}/api/progress/weight`, {
      headers: forwardHeaders(req),
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to reach backend." },
      { status: 502 }
    );
  }
}

/** POST /api/progress/weight — log a new weight */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${BACKEND}/api/progress/weight`, {
      method: "POST",
      headers: forwardHeaders(req),
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to reach backend." },
      { status: 502 }
    );
  }
}
