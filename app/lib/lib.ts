import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const key = process.env.SECRET_KEY || "secret-key";
const secret = new TextEncoder().encode(key);

export async function encrypt(id: string) {
	const res = await new SignJWT({ payload: id })
		.setProtectedHeader({ alg: "HS256" })
		.setExpirationTime("1h")
		.sign(secret);

	return res;
}

export async function decrypt(token: string) {
	try {
		const { payload } = await jwtVerify(token, secret, {
			algorithms: ["HS256"],
		});
		return payload;
	} catch {
		return null;
	}
}

export async function createSession(id: string) {
	const session = await encrypt(id);

	const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

	cookies().set("session", session, {
		expires,
		httpOnly: true,
		secure: true,
	});
}
