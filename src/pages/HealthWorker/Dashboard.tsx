import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  RiNotification3Line,
  RiUserHeartLine,
  RiCalendarCheckLine,
  RiArrowRightLine,
  RiCloseLine,
} from "react-icons/ri";
import type { ApexOptions } from "apexcharts";
import PatientChart from "../../components/HealthWorker/PatientChart";
import Map from "../../components/HealthWorker/Map";
import { LineChart, Line, ResponsiveContainer, Area } from "recharts";

interface ProgressBarProps {
  label: string;
  percentage: number;
  color: string; // Tailwind color class like "bg-blue-500"
}

type AlertProps = {
  title: string;
  message: string;
  isVisible: boolean;
  onClose: () => void;
};

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  count: number;
  period: string;
  color: string;
  chartData?: { value: number }[]; // Optional chart data
}


const StatCard = ({
  icon,
  title,
  count,
  period,
  color,
  chartData = [],
}: StatCardProps) => {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-sm p-6 flex flex-col cursor-pointer"
      whileHover={{ y: -6, boxShadow: "0 15px 25px rgba(0, 0, 0, 0.12)" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex justify-between items-start mb-6">
        <div
          className={`p-4 rounded-2xl flex items-center justify-center ${color} shadow-lg`}
        >
          {icon}
        </div>
        <motion.div
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
          whileTap={{ scale: 0.9 }}
        >
          <RiArrowRightLine className="text-gray-500" />
        </motion.div>
      </div>

      <div className="flex items-center justify-between gap-4">
        {/* Left: Stats */}
        <div className="flex-shrink-0">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">
            {title}
          </h3>
          <div className="flex items-baseline mt-1">
            <span className="text-3xl md:text-4xl font-extrabold text-gray-900">
              {count}
            </span>
            <span className="text-gray-400 text-sm ml-2">{period}</span>
          </div>
        </div>

        {/* Right: Long chart with area background */}
        {chartData.length > 0 && (
          <div className="flex-1 h-16">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                {/* Low opacity background */}
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="none"
                  fill="#6366F1"
                  fillOpacity={0.15}
                />
                {/* Main trend line */}
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#6366F1"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </motion.div>
  );
};



const Alert = ({ title, message, isVisible, onClose }: AlertProps) => {
  if (!isVisible) return null;

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-4 mb-6 border-l-4 border-red-500 flex items-start"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-red-100 p-2 rounded-full mr-3">
        <div className="text-red-500 w-6 h-6 flex items-center justify-center">
          ⚠️
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <RiCloseLine className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-1">{message}</p>
        <button className="mt-2 text-sm font-medium text-purple-600 hover:text-purple-800">
          Learn More
        </button>
      </div>
    </motion.div>
  );
};

const ProgressBar = ({ label, percentage, color }: ProgressBarProps) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-semibold text-gray-900">
          {percentage}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
        <motion.div
          className={`${color} h-4 rounded-full shadow-md`}
          style={{ width: `${percentage}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

const Dashboard = (): JSX.Element => {
  const [showAlert, setShowAlert] = useState(false);

  // Chart data setup
  const [series] = useState([
    {
      name: "Patients",
      data: [31, 40, 28, 51, 42, 82, 56, 35, 70, 90, 75, 65],
    },
    {
      name: "Users",
      data: [11, 32, 45, 32, 34, 52, 41, 50, 65, 45, 60, 55],
    },
  ]);

  const [options] = useState<ApexOptions>({
    chart: {
      height: 350,
      type: "area",
      toolbar: {
        show: false,
      },
      fontFamily: "Inter, sans-serif",
    },
    colors: ["#a854f7", "#38bdf8"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100],
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    tooltip: {
      x: {
        format: "MMM",
      },
    },
    grid: {
      borderColor: "#f1f1f1",
      row: {
        colors: ["transparent", "transparent"],
        opacity: 0.5,
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
    },
  });

  // User location data
  const locationData = [
    { region: "Kigali City", percentage: 25, color: "bg-purple-500" },
    { region: "North Province", percentage: 20, color: "bg-pink-500" },
    { region: "South Province", percentage: 22, color: "bg-purple-400" },
    { region: "East Province", percentage: 32, color: "bg-green-500" },
    { region: "West Province", percentage: 18, color: "bg-lime-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      </div>

      <Alert
        title="There is a pandemic"
        message="Malesuada tellus tincidunt fringilla enim, id mauris. Id etiam nibh suscipit aliquam dolor."
        isVisible={showAlert}
        onClose={() => setShowAlert(false)}
      />

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Overview</h2>
        <p className="text-gray-600 mb-4">
          Harmonious Living, Balance, Strength, Vitality, Wellness
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={<RiNotification3Line className="w-6 h-6 text-white" />}
            title="Alerts"
            count={13}
            period="This Month"
            color="bg-purple-500"
            chartData={[
              { value: 5 },
              { value: 8 },
              { value: 6 },
              { value: 10 },
              { value: 12 },
              { value: 9 },
            ]}
          />

          <StatCard
            icon={<RiUserHeartLine className="w-6 h-6 text-white" />}
            title="Mother"
            count={123}
            period="This Month"
            color="bg-green-500"
            chartData={[
              { value: 5 },
              { value: 8 },
              { value: 6 },
              { value: 10 },
              { value: 12 },
              { value: 9 },
            ]}
          />

          <StatCard
            icon={<RiCalendarCheckLine className="w-6 h-6 text-white" />}
            title="Ongoing Pregnancies"
            count={13}
            period="This Month"
            color="bg-purple-400"
            chartData={[
              { value: 5 },
              { value: 8 },
              { value: 6 },
              { value: 10 },
              { value: 12 },
              { value: 9 },
            ]}
          />
        </div>
      </div>

      <div className="mb-8 bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Mother Stats</h2>
          <div className="bg-gray-900 text-white text-sm rounded-lg px-4 py-2">
            Jan 2024 - Dec 2024
          </div>
        </div>
        <PatientChart series={series} options={options} />
      </div>
      <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              Users by Province
            </h2>
            <div className="flex items-center mt-2">
              <span className="text-4xl font-extrabold text-white">12.4k</span>
              <span className="ml-3 px-3 py-1 text-sm bg-green-500/90 text-white rounded-full font-medium">
                28.5% ↑
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Progress Bars */}
          <div className="space-y-4">
            {locationData.map((item, index) => (
              <ProgressBar
                key={index}
                label={item.region}
                percentage={item.percentage}
                color={item.color + " transition-all duration-700"}
              />
            ))}
          </div>

          {/* Map */}
          <div className="h-80 rounded-xl overflow-hidden shadow-inner border border-gray-700">
            <Map />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
