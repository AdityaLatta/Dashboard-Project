"use client";

import { Chart, type ChartEvent, registerables } from "chart.js";
import React, { useEffect, useRef } from "react";
import { useStats } from "../context/stats";

Chart.register(...registerables);

const BarChart = ({
  setlineData,
}: {
  setlineData: React.Dispatch<React.SetStateAction<(number | null)[]>>;
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  const { stats } = useStats();

  const originalColors = [
    "#C55A11",
    "#4472C4",
    "#4472C4",
    "#4472C4",
    "#4472C4",
    "#4472C4",
  ];

  useEffect(() => {
    const ctx = chartRef.current?.getContext("2d");

    if (!ctx) return;

    const myBarChart = new Chart(ctx, {
      type: "bar", // Specify the type of chart
      data: {
        labels: stats.keys, // X-axis labels
        datasets: [
          {
            data: stats.values,
            backgroundColor: originalColors.slice(), // Bar color (blue)
            borderColor: "#4472C4", // Border color (blue)
            borderWidth: 1, // Border width
            // hoverBackgroundColor: "#4472C8", // Bar color when hovered (red)
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
              text: "Axis Title", // X-axis title
            },
            min: 0,
            max:
              Math.ceil(
                (Math.max(...stats.values.filter((val) => val !== null)) +
                  1000) /
                  1000,
              ) * 1000,
          },

          y: {
            reverse: true,
            beginAtZero: true, // Start y-axis from zero
            title: {
              display: true,
              text: "Axis Title", // Y-axis title
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
            text: "Title", // Chart titl
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
            event.native as Event, // ts-ignore
            "nearest",
            { intersect: true },
            true,
          ); // ts-ignore

          if (activePoints.length > 0) {
            const index = activePoints[0]?.index; // Get the index of the clicked bar

            originalColors[0] = "#4472C4";

            // Reset all bars to original colors
            myBarChart.data.datasets[0]!.backgroundColor =
              originalColors.slice();

            // Highlight only the clicked bar
            const newBackgroundColor = [
              ...myBarChart.data.datasets[0]!.backgroundColor,
            ];
            newBackgroundColor[index!] = "#C55A11";
            myBarChart.data.datasets[0]!.backgroundColor = newBackgroundColor;

            // Update the chart to reflect changes
            myBarChart.update();

            const label = myBarChart?.data.labels?.[index!];

            switch (label) {
              case "a":
                setlineData(stats.A as number[]);
                break;
              case "b":
                setlineData(stats.B as number[]);
                break;
              case "c":
                setlineData(stats.C as number[]);
                break;
              case "d":
                setlineData(stats.D as number[]);
                break;
              case "e":
                setlineData(stats.E as number[]);
                break;
              case "f":
                setlineData(stats.F as number[]);
                break;
            }
          }
        },
        onHover: (event, chartElement) => {
          if (chartElement.length) {
            (event.native!.target as HTMLElement).style.cursor = "pointer"; // Set cursor to pointer on hover
          } else {
            (event.native!.target as HTMLElement).style.cursor = "default"; // Set cursor back to default
          }
        },
      },

      plugins: [
        {
          // Add data labels to bars
          id: "dataLabels",
          afterDatasetsDraw: (chart) => {
            const ctx = chart.ctx;
            chart.data.datasets.forEach((dataset, i) => {
              const meta = chart.getDatasetMeta(i);
              meta.data.forEach((bar, index) => {
                const data = dataset.data[index]?.toString();
                ctx.fillStyle = "black";
                ctx.fillText(data!, bar.x + 5, bar.y + 5); // Positioning labels
              });
            });
          },
        },
      ],
    });

    // Cleanup chart when component unmounts
    return () => {
      myBarChart.destroy();
    };
  }, [stats]); // ts-ignore

  return (
    <>
      <div className="h-full w-full rounded-lg bg-white p-4 shadow-lg">
        <canvas ref={chartRef} width="400" height="200"></canvas>
      </div>
    </>
  );
};

export default BarChart;
