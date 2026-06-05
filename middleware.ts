import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const adminUser = process.env.ADMIN_USER;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUser || !adminPassword) {
    return new NextResponse("Admin access is not configured.", { status: 503 });
  }

  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) {
    return requireLogin();
  }

  const [user, password] = atob(auth.slice(6)).split(":");
  if (user !== adminUser || password !== adminPassword) {
    return requireLogin();
  }

  return NextResponse.next();
}

function requireLogin() {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="ResselerHub Admin"'
    }
  });
}

export const config = {
  matcher: "/admin/:path*"
};
