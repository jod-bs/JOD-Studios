import { NextRequest, NextResponse } from "next/server";

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="JOD Studios Admin"',
      "Cache-Control": "no-store",
    },
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public project inquiry submissions stay open
  if (pathname === "/api/projects" && request.method === "POST") {
    return NextResponse.next();
  }

  const needsAuth =
    pathname.startsWith("/admin") || pathname.startsWith("/api/projects");

  if (!needsAuth) return NextResponse.next();

  const password = process.env.ADMIN_PASSWORD?.trim();
  if (!password) {
    if (process.env.NODE_ENV === "production") {
      return new NextResponse("Admin is locked until ADMIN_PASSWORD is configured.", {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      });
    }
    return NextResponse.next();
  }

  const header = request.headers.get("authorization");
  if (!header?.startsWith("Basic ")) return unauthorized();

  try {
    const decoded = atob(header.slice(6));
    const separator = decoded.indexOf(":");
    if (separator === -1) return unauthorized();
    const user = decoded.slice(0, separator);
    const pass = decoded.slice(separator + 1);
    const expectedUser = process.env.ADMIN_USER || "admin";
    if (user === expectedUser && pass === password) {
      return NextResponse.next();
    }
  } catch {
    return unauthorized();
  }

  return unauthorized();
}

export const config = {
  matcher: ["/admin/:path*", "/api/projects", "/api/projects/:path*"],
};
