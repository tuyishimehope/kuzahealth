import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import React from "react";
import {
  RiArrowRightLine,
  RiCalendarCheckLine,
  RiNotification3Line,
  RiUserHeartLine,
} from "react-icons/ri";
import { Area, Line, LineChart, ResponsiveContainer } from "recharts";

import { axiosInstance } from "@/utils/axiosInstance";
import type { ApexOptions } from "apexcharts";
import Map from "../../components/HealthWorker/Map";
import PatientChart from "../../components/HealthWorker/PatientChart";

// ---------- Types ----------
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  expectedDeliveryDate: string;
  bloodGroup: string;
  maritalStatus: string;
  emergencyContactFullName: string;
  emergencyContactNumber: string;
  emergencyContactRelationship: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  highRisk: boolean;
  createdAt: string;
  updatedAt: string;
}

type ProgressBarProps = { label: string; percentage: number; color: string };

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  count: number;
  period: string;
  color: string;
  chartData?: { value: number }[];
}

// ---------- Components ----------
const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  count,
  period,
  color,
  chartData = [],
}) => (
  <motion.div
    className="bg-white rounded-2xl shadow-sm p-6 flex flex-col cursor-pointer"
    whileHover={{ y: -6, boxShadow: "0 15px 25px rgba(0,0,0,0.12)" }}
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
      {chartData.length > 0 && (
        <div className="flex-1 h-16">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Area
                type="monotone"
                dataKey="value"
                stroke="none"
                fill="#6366F1"
                fillOpacity={0.15}
              />
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

const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  percentage,
  color,
}) => (
  <div className="mb-5">
    <div className="flex justify-between items-center mb-1">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{percentage}%</span>
    </div>
    <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner">
      <motion.div
        className={`${color} h-4 rounded-full shadow-md`}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  </div>
);

// ---------- Dashboard ----------
const Dashboard: React.FC = () => {
  // React Query for patients
  const { data: patients = [], isLoading } = useQuery<Patient[]>({
    queryKey: ["patients"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/parents");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
  const safePatients = Array.isArray(patients) ? patients : [];

  const locationData = [
    { region: "Kigali City", percentage: 25, color: "bg-purple-500" },
    { region: "North Province", percentage: 20, color: "bg-pink-500" },
    { region: "South Province", percentage: 22, color: "bg-purple-400" },
    { region: "East Province", percentage: 32, color: "bg-green-500" },
    { region: "West Province", percentage: 18, color: "bg-lime-500" },
  ];

  const series = [
    {
      name: "Patients",
      data: [31, 40, 28, 51, 42, 82, 56, 35, 70, 90, 75, 65],
    },
  ];
  const chartOptions: ApexOptions = {
    chart: {
      type: "area" as const, // tell TS this is the literal "area"
      height: 350,
      toolbar: { show: false },
      fontFamily: "Inter, sans-serif",
    },
    colors: ["#a854f7"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100],
      },
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
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
    tooltip: { x: { format: "MMM" } },
    grid: {
      borderColor: "#f1f1f1",
      row: { colors: ["transparent", "transparent"], opacity: 0.5 },
    },
    legend: { position: "top", horizontalAlign: "right" },
  };

  if (isLoading)
    return <div className="text-center mt-20 text-gray-700">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      </div>

      {/* Stat Cards */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
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
          title="Mothers"
          count={safePatients.length}
          period="This Month"
          color="bg-green-500"
          chartData={safePatients
            .slice(0, 6)
            .map(() => ({ value: Math.floor(Math.random() * 100) }))}
        />

        <StatCard
          icon={<RiCalendarCheckLine className="w-6 h-6 text-white" />}
          title="Ongoing Pregnancies"
          count={safePatients.filter((p) => p.highRisk).length}
          period="This Month"
          color="bg-purple-400"
          chartData={safePatients
            .slice(0, 6)
            .map(() => ({ value: Math.floor(Math.random() * 50) }))}
        />
      </div>

      {/* Charts & Map */}
      <div className="mb-8 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Mother Stats
          </h2>
          <PatientChart series={series} options={chartOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Health Coverage by Region
          </h2>
          {locationData.map((loc, i) => (
            <ProgressBar
              key={i}
              label={loc.region}
              percentage={loc.percentage}
              color={loc.color}
            />
          ))}
        </div>
        <div className="h-80 rounded-xl overflow-hidden shadow-inner border border-gray-200 mt-6">
          <Map />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
