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

  const data = await upstream.json().catch(() => ({}));

  // If backend returns error, just bubble it up
  if (!upstream.ok) {
    return NextResponse.json(data, { status: upstream.status });
  }

  // Go backend returns: { access_token, refresh_token, user: { ... } }
  const { access_token, refresh_token, user, ...rest } = data as any;

  // Detect if request came over HTTPS (for when you later add TLS)
  const xfp = req.headers.get("x-forwarded-proto");
  const isHttps = xfp === "https";

  // Response body: include ok + user so any client code can rely on it
  const res = NextResponse.json({
    ok: true,
    user,
    ...rest,
  });

  const cookieOptions = {
    httpOnly: true,
    secure: isHttps,
    sameSite: "lax" as const,
    path: "/",
  };

  if (access_token) {
    res.cookies.set("access_token", access_token, {
      ...cookieOptions,
      maxAge: 15 * 60, // 15 minutes
    });
  }

  if (refresh_token) {
    res.cookies.set("refresh_token", refresh_token, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });
  }

  return res;
}
