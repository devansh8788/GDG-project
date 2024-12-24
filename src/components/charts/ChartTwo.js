import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const options = {
  colors: ['#3C50E0', '#80CAEE'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    type: 'bar',
    height: '100%', // Use a relative height for better responsiveness
    stacked: true,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  responsive: [
    {
      breakpoint: 768,
      options: {
        chart: {
          height: 300, // Adjust height for smaller screens
        },
      },
    },
    {
      breakpoint: 1536,
      options: {
        plotOptions: {
          bar: {
            columnWidth: '50%', // Increase column width on larger screens
          },
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 4, // Add slight rounding to bars for a modern look
      columnWidth: '25%',
      borderRadiusApplication: 'end',
      borderRadiusWhenStacked: 'last',
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    labels: {
      style: {
        colors: '#637381',
        fontSize: '12px',
      },
    },
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    fontFamily: 'Satoshi',
    fontWeight: 500,
    fontSize: '14px',
    markers: {
      radius: 12,
    },
  },
  fill: {
    opacity: 1,
  },
};

const ChartTwo = () => {
  const [state, setState] = useState({
    series: [
      {
        name: 'Sales',
        data: [44, 55, 41, 67, 22, 43, 65],
      },
      {
        name: 'Revenue',
        data: [13, 23, 20, 8, 13, 27, 15],
      },
    ],
  });

  const handleReset = () => {
    setState((prevState) => ({
      ...prevState,
    }));
  };

  return (
    <div className="col-span-12 rounded-lg border border-stroke bg-white p-6 shadow-lg dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 flex justify-between items-center">
        <h4 className="text-xl font-semibold text-black dark:text-white">Profit this week</h4>
        <div className="relative inline-block">
          <select className="relative z-20 inline-flex appearance-none bg-gray-200 border border-gray-300 rounded-md py-1 pl-3 pr-8 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 dark:bg-boxdark dark:border-gray-600 dark:text-white">
            <option className='dark:bg-boxdark'>This Week</option>
            <option className='dark:bg-boxdark'>Last Week</option>
          </select>
          <span className="absolute top-1/2 right-3 z-10 -translate-y-1/2">
            {/* Arrow SVG */}
            <svg width="10" height="6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.47072 1.08816C0.47072 1.02932 0.500141 0.955772 0.54427 0.911642C0.647241 0.808672 0.809051 0.808672 0.912022 0.896932L4.85431 4.60386C4.92785 4.67741 5.06025 4.67741 5.14851 4.60386L9.09079 0.896932C9.19376 0.793962 9.35557 0.808672 9.45854 0.911642C9.56151 1.01461 9.5468 1.17642 9.44383 1.27939L5.50155 4.98632C5.22206 5.23639 4.78076 5.23639 4.51598 4.98632L0.558981 1.27939C0.50014 1.22055 0.47072 1.16171 0.47072 1.08816Z" fill="#637381" />
            </svg>
          </span>
        </div>
      </div>

      <div id="chartTwo" className="-ml-5 -mb-9">
        <ReactApexChart options={options} series={state.series} type="bar" height={350} />
      </div>
    </div>
  );
};

export default ChartTwo;
