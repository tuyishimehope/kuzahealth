import { useState } from "react";
import PatientChart from "../../components/HealthWorker/PatientChart";
import { ApexOptions } from "apexcharts";
import Map from "../../components/HealthWorker/Map";

const Dashboard = () => {
  const [series] = useState([
    {
      name: "Prenatal Visits",
      data: [2, 3, 4, 5, 3, 4, 5],
    },
    {
      name: "Health Assessments",
      data: [1, 1, 2, 1, 2, 2, 3],
    },
  ]);

  const [options] = useState<ApexOptions>({
    chart: {
      height: 350,
      type: "area" as const, // Use 'as const' to ensure type is correct
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: [
        "2024-10-01T00:00:00.000Z",
        "2024-10-02T00:00:00.000Z",
        "2024-10-03T00:00:00.000Z",
        "2024-10-04T00:00:00.000Z",
        "2024-10-05T00:00:00.000Z",
        "2024-10-06T00:00:00.000Z",
        "2024-10-07T00:00:00.000Z",
      ],
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
  });

  return (
    <div className="flex min-h-screen">
      <div className="w-full p-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-lg font-bold">Maternal Health Overview</h2>
            <p className="text-slate-500">
              Supporting mothers with prenatal care, assessments, and wellness.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-2">
            <div className="flex justify-between items-center pb-2">
              <h3 className="text-xl font-semibold">Maternal Health Stats</h3>
              <div className="flex gap-4">
                <p className="text-slate-600">Total Mothers: 200</p>
                <p className="text-slate-600">Active Users: 350</p>
              </div>
            </div>
            <PatientChart series={series} options={options} />
          </div>
        </div>
        <div className=" flex justify-between py-4">
          <div className="w-96 pr-10">
            <div className=" flex items-center gap-4 pb-6">
              <p>Users By Location</p>
              <p>12.4k</p>
            </div>
            <div className="space-y-3">
              <div className="flex flex-col justify-between ">
                <p>Kigali City</p>
                <div className="flex items-center  justify-between">
                  <div className="w-1/2 ">
                    <div className="relative pt-1 ">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                        <div
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                          style={{ width: "25%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <p>25%</p>
                </div>
              </div>

              <div className="flex flex-col justify-between ">
                <p>Western Province</p>
                <div className="flex items-center  justify-between">
                  <div className="w-1/2 ">
                    <div className="relative pt-1 ">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                        <div
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                          style={{ width: "25%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <p>25%</p>
                </div>
              </div>


              <div className="flex flex-col justify-between ">
                <p>Eastern Province</p>
                <div className="flex items-center  justify-between">
                  <div className="w-1/2 ">
                    <div className="relative pt-1 ">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                        <div
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                          style={{ width: "25%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <p>25%</p>
                </div>
              </div>


              <div className="flex flex-col justify-between ">
                <p>Southern Province</p>
                <div className="flex items-center  justify-between">
                  <div className="w-1/2 ">
                    <div className="relative pt-1 ">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                        <div
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                          style={{ width: "25%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <p>25%</p>
                </div>
              </div>

              <div className="flex flex-col justify-between ">
                <p>Northern Province</p>
                <div className="flex items-center  justify-between">
                  <div className="w-1/2 ">
                    <div className="relative pt-1 ">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                        <div
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                          style={{ width: "25%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <p>25%</p>
                </div>
              </div>

            </div>
          </div>
          <div className="w-full h-40">
            {" "}
            <div className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-xl font-semibold">Rwanda Map</h3>
              <Map />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
