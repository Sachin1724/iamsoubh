import { NextRequest, NextResponse } from "next/server";

/**
 * One operator, one page: HTTP Basic is the whole auth model. Credentials live
 * in ADMIN_USER / ADMIN_PASS, the browser keeps the login box, and nothing is
 * stored. Served over HTTPS only, and never indexed.
 */
function unauthorised() {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="IAMSOUBH admin", charset="UTF-8"',
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

export function middleware(req: NextRequest) {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASS;

  // No credentials configured means the page stays shut, not open.
  if (!user || !pass) return unauthorised();

  const header = req.headers.get("authorization") ?? "";
  if (!header.startsWith("Basic ")) return unauthorised();

  let decoded = "";
  try {
    decoded = atob(header.slice(6));
  } catch {
    return unauthorised();
  }

  const i = decoded.indexOf(":");
  const given = decoded.slice(0, i);
  const secret = decoded.slice(i + 1);

  // Constant-time-ish: compare both halves in full rather than bailing early.
  const ok =
    given.length === user.length &&
    secret.length === pass.length &&
    given === user &&
    secret === pass;

  if (!ok) return unauthorised();

  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
