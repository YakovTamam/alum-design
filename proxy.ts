import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, CLIENT_SESSION_COOKIE, readSessionToken } from "@/lib/auth";

const ADMIN_ONLY_PREFIXES = ["/admin/content", "/admin/media"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login" || pathname.startsWith("/admin/reset-password/")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const session = readSessionToken(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
    if (!session || (session.role !== "super-admin" && session.role !== "admin")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    if (
      session.role === "admin" &&
      ADMIN_ONLY_PREFIXES.some((prefix) => pathname.startsWith(prefix))
    ) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
  }

  if (pathname === "/client/login") {
    return NextResponse.next();
  }

  if (pathname.startsWith("/client")) {
    const session = readSessionToken(request.cookies.get(CLIENT_SESSION_COOKIE)?.value);
    if (!session || session.role !== "client") {
      return NextResponse.redirect(new URL("/client/login", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/client/:path*"],
};
