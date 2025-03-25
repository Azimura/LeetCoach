import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (request.cookies.has("userID")) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/", "/problem", "/problem/list", "/problem/list/[id]"],
};
