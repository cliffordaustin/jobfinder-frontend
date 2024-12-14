import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/company-profile/:path*"],
};
