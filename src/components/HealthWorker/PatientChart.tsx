import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts'; // Import ApexOptions for TypeScript type

interface PatientChartProps {
  series: { name: string; data: number[] }[];
  options: ApexOptions; // Specify the options prop type
}

const PatientChart: React.FC<PatientChartProps> = ({ series, options }) => {
  return (
    <div id="chart" className='w-full'>
      <ReactApexChart options={options} series={series} type="area" height={300} />
    </div>
  );
};

export default PatientChart;
