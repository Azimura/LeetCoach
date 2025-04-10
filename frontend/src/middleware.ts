import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname == "/") {
    if (request.cookies.has("userID")) {
      return NextResponse.redirect(new URL("/problem/26", request.url));
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  if (request.cookies.has("userID")) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/", "/problem", "/problem/list", "/problem/list/[id]"],
};
