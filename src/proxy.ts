/** This file was previously known as middleware.tsx */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, getPassword, sessionToken } from "@/lib/auth";

/** Runs before every page: lets the request through only with a valid session. */
export async function proxy(request: NextRequest) {
  const password = getPassword();

  // No password configured: fine on your own machine, never in production.
  if (!password) {
    if (process.env.NODE_ENV !== "production") return NextResponse.next();
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  if (cookie && cookie === (await sessionToken(password))) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  // Everything except the login page and Next.js internal files.
  matcher: ["/((?!login|_next/static|_next/image|favicon.ico).*)"],
};