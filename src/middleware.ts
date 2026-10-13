import { NextResponse, type NextRequest } from "next/server";

/**
 * Single-operator gate. Open /admin?k=<ADMIN_TOKEN> once; the cookie carries it
 * from then on. No user table, no sessions — there is exactly one admin.
 */
export function middleware(req: NextRequest) {
  const token = process.env.ADMIN_TOKEN;
  if (!token) return new NextResponse("ADMIN_TOKEN not set", { status: 503 });

  const fromQuery = req.nextUrl.searchParams.get("k");
  if (fromQuery === token) {
    const url = req.nextUrl.clone();
    url.searchParams.delete("k");
    const res = NextResponse.redirect(url);
    res.cookies.set("admin", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  }

  if (req.cookies.get("admin")?.value === token) return NextResponse.next();
  return new NextResponse("Not found", { status: 404 });
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
