import { NextResponse } from "next/server";

export async function POST() {
  const resp = NextResponse.json({ ok: true });
  resp.cookies.set("access_token", "", { path: "/", maxAge: 0 });
  resp.cookies.set("refresh_token", "", { path: "/", maxAge: 0 });
  return resp;
}
