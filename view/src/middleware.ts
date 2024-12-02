import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // const { pathname } = req.nextUrl;
  //
  // if (pathname != "/login") {
  // }

  return NextResponse.next();
}
