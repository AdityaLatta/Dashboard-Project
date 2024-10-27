"use client";

import { Chart, type ChartEvent, registerables } from "chart.js";
import React, { useEffect, useRef } from "react";
import { useStats } from "../_context/stats";
import { SyncLoader } from "react-spinners";

Chart.register(...registerables);

const BarChart = ({
	setlineData,
}: {
	setlineData: React.Dispatch<React.SetStateAction<number[]>>;
}) => {
	const chartRef = useRef<HTMLCanvasElement>(null);

	const { stats } = useStats();

	useEffect(() => {
		const originalColors = [
			"#C55A11",
			"#4472C4",
			"#4472C4",
			"#4472C4",
			"#4472C4",
			"#4472C4",
		];

		const ctx = chartRef.current?.getContext("2d");

		if (!ctx) return;

		const myBarChart = new Chart(ctx, {
			type: "bar",
			data: {
				labels: stats?.keys,
				datasets: [
					{
						data: stats?.values,
						backgroundColor: originalColors.slice(),
						borderColor: "#4472C4",
						borderWidth: 1,
						hoverBorderColor: "black",
					},
				],
			},

			options: {
				indexAxis: "y",
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: {
						beginAtZero: true,
						title: {
							display: true,
							text: "Axis Title",
						},
						min: 0,
						max: stats?.values
							? Math.ceil(
									(Math.max(
										...stats.values.filter(
											(val) => val !== null
										)
									) +
										1000) /
										1000
							  ) * 1000
							: 0,
					},

					y: {
						reverse: true,
						beginAtZero: true,
						title: {
							display: true,
							text: "Axis Title",
						},
						grid: {
							display: false,
						},
					},
				},
				plugins: {
					tooltip: {
						enabled: false,
					},
					legend: {
						display: false,
					},
					title: {
						display: true,
						text: "Title",
						font: {
							size: 16,
						},
						padding: {
							top: 0,
							bottom: 15,
						},
					},
				},

				onClick: (event: ChartEvent) => {
					const activePoints = myBarChart.getElementsAtEventForMode(
						event.native!,
						"nearest",
						{ intersect: true },
						true
					);

					if (activePoints.length > 0) {
						const index = activePoints[0]?.index;

						originalColors[0] = "#4472C4";

						// Reset all bars to original colors
						myBarChart.data.datasets[0]!.backgroundColor =
							originalColors.slice();

						// Highlight only the clicked bar
						const newBackgroundColor = [
							...myBarChart.data.datasets[0]!.backgroundColor,
						];
						newBackgroundColor[index!] = "#C55A11";
						myBarChart.data.datasets[0]!.backgroundColor =
							newBackgroundColor;

						// Update the chart to reflect changes
						myBarChart.update();

						const label = myBarChart?.data.labels?.[index!];

						switch (label) {
							case "A":
								setlineData(stats?.A as number[]);
								break;
							case "B":
								setlineData(stats?.B as number[]);
								break;
							case "C":
								setlineData(stats?.C as number[]);
								break;
							case "D":
								setlineData(stats?.D as number[]);
								break;
							case "E":
								setlineData(stats?.E as number[]);
								break;
							case "F":
								setlineData(stats?.F as number[]);
								break;
						}
					}
				},
				onHover: (event, chartElement) => {
					if (chartElement.length) {
						(event.native!.target as HTMLElement).style.cursor =
							"pointer";
					} else {
						(event.native!.target as HTMLElement).style.cursor =
							"default";
					}
				},
			},

			plugins: [
				{
					id: "dataLabels",
					afterDatasetsDraw: (chart) => {
						const ctx = chart.ctx;
						chart.data.datasets.forEach((dataset, i) => {
							const meta = chart.getDatasetMeta(i);
							meta.data.forEach((bar, index) => {
								const data = dataset.data[index]?.toString();
								ctx.fillStyle = "black";
								ctx.fillText(data!, bar.x + 5, bar.y + 5);
							});
						});
					},
				},
			],
		});

		return () => {
			myBarChart.destroy();
		};
	}, [stats, setlineData]);

	if (!stats)
		return (
			<div className="h-full w-full flex justify-center items-center rounded-lg bg-white p-4 shadow-lg">
				<SyncLoader color="#1A5ED4" />
			</div>
		);

	return (
		<>
			<div className="h-full w-full rounded-lg bg-white p-4 shadow-lg">
				<canvas ref={chartRef} width="400" height="200"></canvas>
			</div>
		</>
	);
};

export default BarChart;
