import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const options = {
  legend: {
    show: true,
    position: 'top',
    horizontalAlign: 'left',
    markers: {
      width: 14,
      height: 14,
      radius: 12,
    },
  },
  colors: ['#2563EB', '#14B8A6'],
  chart: {
    fontFamily: 'Inter, sans-serif',
    height: 350,
    type: 'area',
    dropShadow: {
      enabled: true,
      color: '#2563EB33',
      top: 8,
      blur: 6,
      left: 0,
      opacity: 0.2,
    },
    toolbar: {
      show: false,
    },
  },
  stroke: {
    width: [3, 3],
    curve: 'smooth',
  },
  grid: {
    borderColor: '#e5e7eb',
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 5,
    colors: '#fff',
    strokeColors: ['#2563EB', '#14B8A6'],
    strokeWidth: 3,
    hover: {
      size: 7,
    },
  },
  xaxis: {
    type: 'category',
    categories: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      text: 'Sales Performance',
      style: {
        fontSize: '14px',
        color: '#6b7280',
      },
    },
    min: 0,
    max: 100,
  },
  tooltip: {
    shared: true,
    intersect: false,
    theme: 'light',
  },
};

const ChartOne = () => {
  const [state] = useState({
    series: [
      {
        name: 'Product A',
        data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 45],
      },
      {
        name: 'Product B',
        data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 51],
      },
    ],
  });

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
      <div className="flex flex-wrap items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Sales Overview</h2>
        <div className="flex gap-2">
          <button className="rounded-md bg-blue-600 px-3 py-1.5 text-white text-xs font-medium shadow-md hover:bg-blue-700">Day</button>
          <button className="rounded-md bg-gray-200 px-3 py-1.5 text-gray-800 text-xs font-medium hover:bg-gray-300">Week</button>
          <button className="rounded-md bg-gray-200 px-3 py-1.5 text-gray-800 text-xs font-medium hover:bg-gray-300">Month</button>
        </div>
      </div>

      <div className="mt-5">
        <ReactApexChart options={options} series={state.series} type="area" height={350} />
      </div>
    </div>
  );
};

export default ChartOne;
