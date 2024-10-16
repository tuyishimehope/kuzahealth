import { useState } from "react";
import PatientChart from "../../components/HealthWorker/PatientChart";
import { ApexOptions } from 'apexcharts'; 

const Dashboard = () => {
  const [series] = useState([
    {
      name: 'Prenatal Visits',
      data: [2, 3, 4, 5, 3, 4, 5],
    },
    {
      name: 'Health Assessments',
      data: [1, 1, 2, 1, 2, 2, 3],
    },
  ]);

  const [options] = useState<ApexOptions>({
    chart: {
      height: 350,
      type: 'area' as const, // Use 'as const' to ensure type is correct
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      type: 'datetime',
      categories: [
        '2024-10-01T00:00:00.000Z',
        '2024-10-02T00:00:00.000Z',
        '2024-10-03T00:00:00.000Z',
        '2024-10-04T00:00:00.000Z',
        '2024-10-05T00:00:00.000Z',
        '2024-10-06T00:00:00.000Z',
        '2024-10-07T00:00:00.000Z',
      ],
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm',
      },
    },
  });

  return (
    <div className="flex">
      <div className="w-full p-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-bold">Maternal Health Overview</h2>
            <p className="text-slate-500">
              Supporting mothers with prenatal care, assessments, and wellness.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="flex justify-between items-center pb-4">
              <h3 className="text-xl font-semibold">Maternal Health Stats</h3>
              <div className="flex gap-4">
                <p className="text-slate-600">Total Mothers: 200</p>
                <p className="text-slate-600">Active Users: 350</p>
              </div>
            </div>
            <PatientChart series={series} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
