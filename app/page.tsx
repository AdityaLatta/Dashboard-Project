"use client";
import { useEffect, useState } from "react";
import BarChart from "./_components/BarChart";
import Filters from "./_components/Filters";
import Logout from "./_components/Logout";
import Controls from "./_components/Controls";
import { useStats } from "./_context/stats";

import dynamic from "next/dynamic";
const LineChart = dynamic(() => import("./_components/LineChart"), {
	ssr: false,
});

export default function Home() {
	const { stats } = useStats();

	const [lineData, setlineData] = useState<number[]>(stats?.A || []);

	useEffect(() => {
		setlineData(stats?.A || []);
	}, [stats]);

	return (
		<section className="flex h-screen w-full flex-col lg:flex-row">
			<header className="flex h-16 w-full items-center justify-between border-r-[1px] bg-gray-800 p-4 text-white lg:h-screen lg:w-64 lg:flex-col">
				<div className="text-2xl -tracking-[-9px]">DashBoard</div>
				<Logout />
			</header>
			<section className="h-full w-full grid  grid-cols-1 lg:grid-rows-2 lg:grid-cols-2 gap-4 bg-gray-200 p-4 overflow-auto lg:w-[calc(100vw-256px)]">
				<div className="w-full h-full">
					<BarChart setlineData={setlineData} />
				</div>
				<div className="w-full h-full bg-white rounded-lg">
					<LineChart lineData={lineData} />
				</div>
				<div className="w-full h-full">
					<Filters />
				</div>
				<div className="w-full h-full">
					<Controls />
				</div>
			</section>
		</section>
	);
}
