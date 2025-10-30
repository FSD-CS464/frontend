import { NextRequest, NextResponse } from "next/server";

const PROTECTED = ["/", "/habits", "/pet-bar", "/play", "/settings"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED.some((p) => pathname === p || pathname.startsWith(p + "/"));
  if (!isProtected) {
    return NextResponse.next();
  }

  const access = req.cookies.get("access_token")?.value;
  if (!access) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/habits/:path*",
    "/pet-bar/:path*",
    "/play/:path*",
    "/settings/:path*",
  ],
};
