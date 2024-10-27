"use client";

import { Chart, registerables } from "chart.js";
import { useEffect, useRef } from "react";
import { useStats } from "../_context/stats";

import zoomPlugin from "chartjs-plugin-zoom";
import { SyncLoader } from "react-spinners";

const LineChart = ({ lineData }: { lineData: (number | null)[] }) => {
	const { stats } = useStats();
	const chartRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (chartRef.current) {
			const ctx = chartRef.current?.getContext("2d");

			if (!ctx) return;

			Chart.register(...registerables, zoomPlugin);

			const myLineChart = new Chart(ctx, {
				type: "line",
				data: {
					labels: stats?.dates,
					datasets: [
						{
							data: lineData,
							backgroundColor: "#4472C4",
							borderColor: "#4472C4",
							borderWidth: 1,
							hoverBackgroundColor: "#C55A11",
							hoverBorderColor: "#4472C4",
						},
					],
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					scales: {
						x: {
							beginAtZero: true,
							title: {
								display: true,
								text: "Axis Title",
							},
							grid: {
								display: false,
								offset: true,
							},
							offset: true,
							ticks: {
								font: {
									size: 10,
								},
								padding: 10,
							},
						},

						y: {
							type: "linear",
							beginAtZero: true,
							title: {
								display: true,
								text: "Axis Title",
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
							text: "Chart Title",
							font: {
								size: 16,
							},
							padding: {
								top: 0,
								bottom: 15,
							},
						},
						zoom: {
							pan: {
								enabled: true,
								mode: "x",
							},
							zoom: {
								mode: "x",
								wheel: {
									enabled: true,
								},
								pinch: {
									enabled: true,
								},
							},
						},
					},
				},
			});

			return () => {
				myLineChart.destroy();
			};
		}
	}, [stats, lineData]);

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

export default LineChart;
