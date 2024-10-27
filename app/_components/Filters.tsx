"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
	defaultFilter,
	DefaultFilter,
	useFilters,
} from "../_context/filterContext";
import { saveFilters, setParams } from "../lib/utils";
import DateSelector from "./DateSelector";
import SelectButton from "./SelectButton";

const Filters = () => {
	const { filter } = useFilters();
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [queryData, setqueryData] = useState(filter);

	const handleOption = (e: React.ChangeEvent<HTMLInputElement>) =>
		setqueryData({
			...queryData,
			[e.target.name]: e.target.value,
		} as DefaultFilter);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.target as HTMLFormElement);

		const data = {
			date: formData.get("date") as string,
			age: formData.get("age") as string,
			gender: formData.get("gender") as string,
		};

		const params = setParams(data);
		router.replace(`${pathname}?${params.toString()}`);

		saveFilters(data);
	};

	useEffect(() => {
		if (searchParams.size === 0) {
			setqueryData(defaultFilter);
		}
	}, [searchParams]);

	return (
		<div className="col-span-12 row-span-12 h-full space-y-6 rounded-lg bg-white p-4 shadow-lg md:col-span-6">
			<div className="text-center text-lg font-bold text-gray-500">
				Filters
			</div>

			<form className="space-y-6" onSubmit={handleSubmit}>
				<div className="flex items-center justify-between">
					<div>Age - </div>

					<div className="flex gap-4">
						<SelectButton
							name="age"
							value="20"
							onChange={handleOption}
							checked={
								(queryData ?? defaultFilter).age >= 15 &&
								(queryData ?? defaultFilter).age <= 25
							}>
							15-25
						</SelectButton>

						<SelectButton
							name="age"
							value="30"
							onChange={handleOption}
							checked={(queryData ?? defaultFilter).age > 25}>
							&gt;25
						</SelectButton>
					</div>
				</div>

				<div className="flex items-center justify-between">
					<div>Gender - </div>

					<div className="flex gap-4">
						<SelectButton
							name="gender"
							value="male"
							onChange={handleOption}
							checked={queryData?.gender === "male"}>
							Male
						</SelectButton>

						<SelectButton
							name="gender"
							value="female"
							onChange={handleOption}
							checked={queryData?.gender === "female"}>
							Female
						</SelectButton>
					</div>
				</div>

				<div className="flex items-center justify-between">
					<span>Date Range - </span>
					<DateSelector
						queryData={queryData}
						setqueryData={setqueryData}
					/>
				</div>

				<button
					type="submit"
					className="w-full rounded-lg bg-blue-500 px-4 py-2 text-white">
					Submit
				</button>
			</form>
		</div>
	);
};

export default Filters;
