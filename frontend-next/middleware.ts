import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/home") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Exclude /uploads paths from redirection
  if (request.nextUrl.pathname.startsWith("/uploads")) {
    return NextResponse.next();
  }
}
