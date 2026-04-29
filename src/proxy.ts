import { NextResponse, type NextRequest } from "next/server";

const CANONICAL_HOST = "aaronsfireplaceco.com";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.toLowerCase();

  if (host === `www.${CANONICAL_HOST}`) {
    const url = request.nextUrl.clone();
    url.hostname = CANONICAL_HOST;
    url.protocol = "https:";
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|apple-touch-icon.png).*)"],
};
