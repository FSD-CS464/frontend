import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_BASE ?? "http://localhost:8080/api/v1";

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get("refresh_token")?.value;
  if (!refreshToken) {
    return NextResponse.json({ error: "no refresh token" }, { status: 401 });
  }

  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "refresh failed" }, { status: 401 });
  }

  const { access_token } = await res.json();

  const resp = NextResponse.json({ ok: true });
  resp.cookies.set("access_token", access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60,
  });
  return resp;
}
