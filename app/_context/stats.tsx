"use client";

import React, { useEffect } from "react";
import { useFilters } from "./filterContext";
import { useQuery } from "@tanstack/react-query";

type Stats = {
	keys: Array<string>;
	values: Array<number>;
	dates: Array<string>;
	A: Array<number>;
	B: Array<number>;
	C: Array<number>;
	D: Array<number>;
	E: Array<number>;
	F: Array<number>;
};

const StatsContext = React.createContext<{
	stats: Stats | null;
	setStats: React.Dispatch<React.SetStateAction<Stats | null>>;
}>({
	stats: null,
	setStats: () => {},
});

export function StatsProvider({ children }: { children: React.ReactNode }) {
	const [stats, setStats] = React.useState<Stats | null>(null);

	const { filter } = useFilters();

	const queryFn = async () => {
		const url = `/api/data?start=${filter?.start}&end=${filter?.end}&age=${filter?.age}&gender=${filter?.gender}`;

		const response = await fetch(url);
		const data = await response.json();
		return data;
	};

	const { data, isSuccess, isLoading } = useQuery({
		queryKey: ["stats", filter],
		queryFn: () => {
			return queryFn();
		},
	});

	useEffect(() => {
		setStats(data);
	}, [isSuccess, data]);

	useEffect(() => {
		if (isLoading) {
			setStats(null);
		}
	}, [isLoading]);

	return (
		<StatsContext.Provider value={{ stats, setStats }}>
			{children}
		</StatsContext.Provider>
	);
}

export const useStats = () => {
	const { stats, setStats } = React.useContext(StatsContext);
	return { stats, setStats };
};
