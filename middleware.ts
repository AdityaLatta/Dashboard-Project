import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./app/lib/lib";

const protectedRoutes = ["/"];
const publicRoutes = ["/login", "/signup"];

export async function middleware(req: NextRequest) {
	const path = req.nextUrl.pathname;

	const isProtectedRoute = protectedRoutes.includes(path);
	const isPublicRoute = publicRoutes.includes(path);

	const cookie = req.cookies.get("session")?.value;
	const session = await decrypt(cookie || "");

	if (isProtectedRoute && !session) {
		const params = Object.fromEntries(req.nextUrl.searchParams.entries());

		if (!params.start || !params.end || !params.age || !params.gender) {
			return NextResponse.redirect(new URL("/login", req.url));
		}

		const res = NextResponse.redirect(new URL("/login", req.url));

		res.cookies.set("filters", JSON.stringify(params), {
			expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		});

		return res;
	}

	if (isPublicRoute && session) {
		return NextResponse.redirect(new URL("/", req.url));
	}

	const filters = JSON.parse(req.cookies.get("filters")?.value || "{}");

	if (
		isProtectedRoute &&
		session &&
		req.nextUrl.searchParams.size === 0 &&
		filters.start &&
		filters.end &&
		filters.age &&
		filters.gender
	) {
		const url = req.nextUrl.clone();

		url.searchParams.set("start", filters.start);
		url.searchParams.set("end", filters.end);
		url.searchParams.set("age", filters.age);
		url.searchParams.set("gender", filters.gender);

		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}
