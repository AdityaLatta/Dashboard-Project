import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const inputSchema = z.object({
	start: z.string(),
	end: z.string(),
	age: z.string(),
	gender: z.enum(["male", "female"]),
});

export async function GET(request: NextRequest) {
	const { data, error } = inputSchema.safeParse(
		Object.fromEntries(request.nextUrl.searchParams)
	);

	if (error) {
		return NextResponse.json(
			{ error: error.flatten().fieldErrors },
			{ status: 400 }
		);
	}

	if (!data) {
		return NextResponse.json({ error: "Invalid input" }, { status: 400 });
	}

	const { start, end, age, gender } = data;

	const startDate = new Date(start);
	const endDate = new Date(end);
	const ageInt = Number(age);

	// if (
	// 	startDate !== new Date("2022-10-04") &&
	// 	endDate !== new Date("2022-10-29") &&
	// 	ageInt !== 20 &&
	// 	gender !== "male"
	// ) {
	// 	cookies().set(
	// 		"filters",
	// 		JSON.stringify({
	// 			start: startDate,
	// 			end: endDate,
	// 			age: ageInt,
	// 			gender,
	// 		}),
	// 		{
	// 			expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
	// 			httpOnly: true,
	// 			secure: true,
	// 		}
	// 	);
	// }

	const ageObj = {
		gte: 0,
		lte: 0,
	};

	if (ageInt > 25) {
		ageObj.gte = 26;
		ageObj.lte = 100;
	} else {
		ageObj.gte = 15;
		ageObj.lte = 25;
	}

	if (startDate > endDate) {
		throw new Error("Start date cannot be after end date");
	}

	const res = await prisma.dashboard_data.findMany({
		where: {
			day: {
				gte: startDate,
				lte: endDate,
			},
			age: ageObj,
			gender: gender,
		},
		select: {
			day: true,
			a: true,
			b: true,
			c: true,
			d: true,
			e: true,
			f: true,
		},
	});

	const dates = [];
	const A = [];
	const B = [];
	const C = [];
	const D = [];
	const E = [];
	const F = [];

	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	for (const i of res) {
		dates.push(i.day.getDate() + " " + months[i.day.getMonth()]);
		A.push(i.a);
		B.push(i.b);
		C.push(i.c);
		D.push(i.d);
		E.push(i.e);
		F.push(i.f);
	}

	const a = A.reduce((a, e) => a + e, 0);
	const b = B.reduce((a, e) => a + e, 0);
	const c = C.reduce((a, e) => a + e, 0);
	const d = D.reduce((a, e) => a + e, 0);
	const e = E.reduce((a, e) => a + e, 0);
	const f = F.reduce((a, e) => a + e, 0);

	const keys = ["A", "B", "C", "D", "E", "F"];
	const values = [a, b, c, d, e, f];

	return NextResponse.json({
		keys,
		values,
		dates,
		A,
		B,
		C,
		D,
		E,
		F,
	});
}
