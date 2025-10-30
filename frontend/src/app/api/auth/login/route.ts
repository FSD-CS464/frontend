import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_BASE ?? "http://localhost:8080/api/v1";

export async function POST(req: NextRequest) {
  const body = await req.json();

  // forward to Go
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return NextResponse.json(err, { status: res.status });
  }

  const { access_token, refresh_token } = await res.json();

  const resp = NextResponse.json({ ok: true });

  // short-lived access token (your Go is ~15m)
  resp.cookies.set("access_token", access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60,
  });

  // long-lived refresh token (your Go is 7 days)
  resp.cookies.set("refresh_token", refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  return resp;
}
