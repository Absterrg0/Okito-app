import { NextRequest, NextResponse } from "next/server";
import {getSessionCookie} from 'better-auth/cookies'
export async function middleware(request: NextRequest) {
  const session = getSessionCookie(request);
  if (!session) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"], // Only apply to /dashboard routes
};
