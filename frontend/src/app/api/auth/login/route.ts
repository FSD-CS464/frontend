import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_BASE ?? "http://localhost:8080/api/v1";

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Forward login to Go backend
  const upstream = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await upstream.json().catch(() => ({} as any));

  // Bubble up backend errors
  if (!upstream.ok) {
    return NextResponse.json(data, { status: upstream.status });
  }

  // Go backend returns: { access_token, refresh_token, user: { ... } }
  const { access_token, refresh_token, user, ...rest } = data as any;

  const cookieBaseOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "lax" as const,
    path: "/",
  };

  const res = NextResponse.json({
    ok: true,
    user: user ?? null,
    ...rest,
  });

  if (access_token) {
    res.cookies.set("access_token", access_token, {
      ...cookieBaseOptions,
      maxAge: 15 * 60, // 15 minutes
    });
  }

  if (refresh_token) {
    res.cookies.set("refresh_token", refresh_token, {
      ...cookieBaseOptions,
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });
  }

  return res;
}
