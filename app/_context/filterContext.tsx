"use client";

import { useSearchParams } from "next/navigation";
import React from "react";
import Cookies from "js-cookie";
import Loader from "../_components/Loader";

export type DefaultFilter = {
	start: Date;
	end: Date;
	age: number;
	gender: "male" | "female";
};

export const defaultFilter: DefaultFilter = {
	start: new Date("2022-10-04"),
	end: new Date("2022-10-29"),
	age: 20,
	gender: "male",
};

const FilterContext = React.createContext<{
	filter: DefaultFilter | null;
	setFilter: React.Dispatch<React.SetStateAction<DefaultFilter | null>>;
}>({ filter: defaultFilter, setFilter: () => {} });

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
	const params = useSearchParams();
	const [filter, setFilter] = React.useState<DefaultFilter | null>(null);
	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		const getFilter = async () => {
			if (params.size > 0) {
				const filterData = {
					start: new Date(params.get("start") || ""),
					end: new Date(params.get("end") || ""),
					age: Number(params.get("age") || ""),
					gender: params.get("gender") || "",
				} as DefaultFilter;
				setFilter(filterData);
			} else if (Cookies.get("filters")) {
				const CookieData = JSON.parse(Cookies.get("filters") || "");
				const filterData = {
					start: new Date(CookieData.start),
					end: new Date(CookieData.end),
					age: Number(CookieData.age),
					gender: CookieData.gender,
				};
				setFilter(filterData);
			} else {
				setFilter(defaultFilter);
			}

			await new Promise((resolve) => setTimeout(resolve, 2000));

			setLoading(false);
		};

		getFilter();
	}, [params]);

	if (loading) {
		return <Loader />;
	}

	return (
		<FilterContext.Provider value={{ filter, setFilter }}>
			{children}
		</FilterContext.Provider>
	);
};

export const useFilters = () => {
	const { filter, setFilter } = React.useContext(FilterContext);
	return { filter, setFilter };
};
