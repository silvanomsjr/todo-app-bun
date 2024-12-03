import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkSession } from "@/lib/session";

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log(req.url);

  const session = await checkSession();

  if (pathname == "/login" && session) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname == "/login" && !session) {
    return NextResponse.next();
  }

  if (!session) {
    if (pathname.includes(".")) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
