import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  RiNotification3Line, 
  RiUserHeartLine, 
  RiCalendarCheckLine,
  RiArrowRightLine,
  RiCloseLine
} from "react-icons/ri";
import { ApexOptions } from "apexcharts";
import PatientChart from "../../components/HealthWorker/PatientChart";
import Map from "../../components/HealthWorker/Map";

// Types for statistics cards
type StatCardProps = {
  icon: React.ReactNode;
  title: string;
  count: number;
  period: string;
  color: string;
};

// Types for alert notification
type AlertProps = {
  title: string;
  message: string;
  isVisible: boolean;
  onClose: () => void;
};

const StatCard = ({ icon, title, count, period, color }: StatCardProps) => {
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm p-6 flex flex-col"
      whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>
        <motion.div 
          className="p-2 rounded-full bg-gray-100 cursor-pointer"
          whileHover={{ backgroundColor: "#f3f4f6" }}
          whileTap={{ scale: 0.95 }}
        >
          <RiArrowRightLine className="text-gray-500" />
        </motion.div>
      </div>
      <div className="mt-2">
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <div className="flex items-end">
          <span className="text-4xl font-bold text-gray-800">{count}</span>
          <span className="text-gray-500 text-sm ml-2 mb-1">{period}</span>
        </div>
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

const ProgressBar = ({ label, percentage, color }: { label: string; percentage: number; color: string }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-sm font-medium text-gray-900">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${color}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const Dashboard = (): JSX.Element => {
  const [showAlert, setShowAlert] = useState(true);
  
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
      fontFamily: 'Inter, sans-serif',
    },
    colors: ['#a854f7', '#38bdf8'],
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
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
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
        colors: ['transparent', 'transparent'],
        opacity: 0.5
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    }
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
        {/* <div className="flex items-center space-x-4">
          <div className="bg-white p-2 rounded-full shadow-sm">
            <RiNotification3Line className="text-gray-600 w-5 h-5" />
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 bg-purple-100 rounded-full overflow-hidden">
              <img 
                src="https://api.placeholder.com/400/320" 
                alt="Profile" 
                className="h-full w-full object-cover" 
              />
            </div>
            <div>
              <p className="text-sm font-medium">Hello</p>
              <p className="text-xs text-gray-500">Health Worker</p>
            </div>
          </div>
        </div> */}
      </div>

      <Alert 
        title="There is a pandemic" 
        message="Malesuada tellus tincidunt fringilla enim, id mauris. Id etiam nibh suscipit aliquam dolor."
        isVisible={showAlert}
        onClose={() => setShowAlert(false)}
      />

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Overview</h2>
        <p className="text-gray-600 mb-4">Harmonious Living, Balance, Strength, Vitality, Wellness</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            icon={<RiNotification3Line className="w-6 h-6 text-white" />}
            title="Alerts"
            count={13}
            period="This Month"
            color="bg-purple-500"
          />
          
          <StatCard 
            icon={<RiUserHeartLine className="w-6 h-6 text-white" />}
            title="Patient"
            count={123}
            period="This Month"
            color="bg-green-500"
          />
          
          <StatCard 
            icon={<RiCalendarCheckLine className="w-6 h-6 text-white" />}
            title="Ongoing Pregnancies"
            count={13}
            period="This Month"
            color="bg-purple-400"
          />
        </div>
      </div>

      <div className="mb-8 bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Patient Stats</h2>
          <div className="bg-gray-900 text-white text-sm rounded-lg px-4 py-2">
            Jan 2024 - Dec 2024
          </div>
        </div>
        <PatientChart series={series} options={options} />
      </div>

      <div className="bg-gray-900 rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">Users by province</h2>
            <div className="flex items-center mt-1">
              <span className="text-3xl font-bold text-white">12.4k</span>
              <span className="ml-2 px-2 py-1 text-xs bg-green-500 text-white rounded">28.5% ↑</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {locationData.map((item, index) => (
              <ProgressBar 
                key={index}
                label={item.region}
                percentage={item.percentage}
                color={item.color}
              />
            ))}
          </div>
          
          <div className="h-80">
            <Map />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;