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

  const credentials = decodeBasicAuth(auth);
  if (!credentials || credentials.user !== adminUser || credentials.password !== adminPassword) {
    return requireLogin();
  }

  return NextResponse.next();
}

function decodeBasicAuth(auth: string) {
  try {
    const decoded = atob(auth.slice(6));
    const separatorIndex = decoded.indexOf(":");
    if (separatorIndex === -1) return null;

    return {
      user: decoded.slice(0, separatorIndex),
      password: decoded.slice(separatorIndex + 1)
    };
  } catch {
    return null;
  }
}

function requireLogin() {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="ResselerHub Admin"',
      "Cache-Control": "no-store"
    }
  });
}

export const config = {
  matcher: "/admin/:path*"
};
