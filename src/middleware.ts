import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { env } from "process";

export async function middleware(request: NextRequest) {
  let token = request.cookies.get("token");

  if (!token) {
    const { searchParams } = request.nextUrl;

    if (searchParams.size === 0) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    let obj = {
      startDate: searchParams.get("startDate"),
      endDate: searchParams.get("endDate"),
      age: searchParams.get("age"),
      gender: searchParams.get("gender"),
    };

    const response = NextResponse.redirect(new URL("/login", request.url));

    // Set a cookie
    response.cookies.set("filters", JSON.stringify(obj));

    // Return the modified response with the cookie set
    return response;
  }

  try {
    const { payload } = await jwtVerify(
      token.value,
      new TextEncoder().encode(env.JWT_SECRET),
    );

    if (!payload) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    const response = NextResponse.redirect(new URL("/login", request.url));

    response.cookies.delete("token");

    return response;
  }
}

export const config = {
  matcher: ["/dashboard"],
};
