"use client";

import { Chart, registerables } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import React, { useEffect, useRef } from "react";
import { useStats } from "../context/stats";

Chart.register(...registerables, zoomPlugin);

const LineChart = ({ lineData }: { lineData: React.ReactNode }) => {
  const { stats } = useStats();
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = chartRef.current?.getContext("2d");

    if (!ctx) return;

    const myLineChart = new Chart(ctx, {
      type: "line", // Specify the type of chart
      data: {
        labels: stats.dates, // X-axis labels
        datasets: [
          {
            data: lineData,
            backgroundColor: "#4472C4", // Bar color (blue)
            borderColor: "#4472C4", // Border color (blue)
            borderWidth: 1, // Border width
            hoverBackgroundColor: "#C55A11", // Bar color when hovered (red)
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
              text: "Axis Title", // X-axis title
            },
            grid: {
              display: false,
              offset: true,
            },
            offset: true, // Add offset to the x-axis to create space
            ticks: {
              font: {
                size: 10,
              },
              padding: 10,
            },
          },

          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Axis Title", // Y-axis title
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
            text: "Chart Title", // Chart titl
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
              enabled: true, // Enable panning
              mode: "x", // You can also use 'y' or 'xy'
            },
            zoom: {
              mode: "x", // You can also use 'y' or 'xy'
              wheel: {
                enabled: true, // Enable zooming via mouse wheel
              },
              pinch: {
                enabled: true, // Enable zooming via touch gestures
              },
            },
          },
        },
      },
    });

    // Cleanup chart when component unmounts
    return () => {
      myLineChart.destroy();
    };
  }, [stats, lineData]);

  return (
    <>
      <div className="h-full w-full rounded-lg bg-white p-4 shadow-lg">
        <canvas ref={chartRef} width="400" height="200"></canvas>
      </div>
    </>
  );
};

export default LineChart;
