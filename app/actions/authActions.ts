/* eslint-disable */
"use server";

import { createSession } from "@/app/lib/lib";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import prisma from "../lib/db";

const signupSchema = z.object({
	name: z
		.string()
		.min(3, { message: "Name must be at least 3 characters" })
		.trim(),
	email: z.string().email({ message: "Invalid email" }).trim(),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters" })
		.trim(),
});

const loginSchema = z.object({
	email: z.string().email({ message: "Invalid email" }).trim(),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters" })
		.trim(),
});

export const signuphandler = async (prevState: any, FormData: FormData) => {
	const result = signupSchema.safeParse(Object.fromEntries(FormData));

	if (!result.success) {
		return {
			errors: result.error.flatten().fieldErrors,
		};
	}

	const { name, email, password } = result.data;

	let user;

	try {
		user = await prisma.user.create({
			data: {
				name,
				email,
				password,
			},
			select: {
				id: true,
			},
		});
	} catch {
		return {
			errors: {
				email: ["Email already exists"],
			},
		};
	}

	await createSession(user.id);

	redirect("/login");
};

export const loginhandler = async (prev: any, FormData: FormData) => {
	const result = loginSchema.safeParse(Object.fromEntries(FormData));

	if (!result.success) {
		return {
			errors: result.error.flatten().fieldErrors,
		};
	}

	const { email, password } = result.data;

	if (!email || !password) {
		return {
			errors: {
				email: ["Invalid email or password"],
			},
		};
	}

	let user;

	try {
		user = await prisma.user.findUnique({
			where: {
				email,
			},
		});
	} catch {
		return {
			errors: {
				email: ["Something went wrong"],
			},
		};
	}

	if (!user) {
		return {
			errors: {
				email: ["Invalid email or password"],
			},
		};
	}

	if (user.password !== password) {
		return {
			errors: {
				password: ["Invalid email or password"],
			},
		};
	}

	await createSession(user.id);

	// const a = {
	// 	start: new Date("2022-10-10"),
	// 	end: new Date("2022-10-20"),
	// 	age: 16,
	// 	gender: "male",
	// };

	// cookies().set("filters", JSON.stringify(a));

	const filters = JSON.parse(cookies().get("filters")?.value || "{}") as {
		start: Date;
		end: Date;
		age: number;
		gender: "male" | "female";
	};

	if (filters.start && filters.end && filters.age && filters.gender) {
		redirect(
			`/?start=${encodeURIComponent(
				filters.start.toString()
			)}&end=${encodeURIComponent(filters.end.toString())}&age=${
				filters.age
			}&gender=${filters.gender}`
		);
	} else {
		redirect("/");
	}
};

export const logouthandler = async () => {
	cookies().delete("session");
	redirect("/login");
};
