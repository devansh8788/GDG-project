// App.js or any other component
import React from 'react';
import ChartOne from './ChartOne'; // Adjust the path based on where ChartOne is located
import ChartTwo from './ChartTwo';
import Navbar from '../Navbar';

const Chart = () => {
  return (
    <div className='ml-52'>
      <Navbar />
      <h1 className="text-2xl font-bold text-grey mb-8 ml-6">
        Sales Overview
      </h1>
      <div className='p-6 flex flex-wrap justify-center gap-6'>
        <div className='flex-1  w-full'>
          <ChartOne />
        </div>
        <div className='flex-1 max-w-md w-full'>
          <ChartTwo />
        </div>
      </div>
      </div>
  );
};

export default Chart;
