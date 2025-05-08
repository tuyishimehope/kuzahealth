// import { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

// Sample data - in a real app, this would come from your API
const monthlyData = [
  { name: 'JAN', pregnancies: 26, visits: 24, vaccines: 22, month: 35 },
  { name: 'FEB', pregnancies: 18, visits: 16, vaccines: 17, month: 22 },
  { name: 'MAR', pregnancies: 32, visits: 30, vaccines: 29, month: 38 },
  { name: 'APR', pregnancies: 19, visits: 18, vaccines: 16, month: 22 },
  { name: 'MAY', pregnancies: 28, visits: 25, vaccines: 24, month: 30 },
];

const AnalyticsDashboard = () => {
//   const [activeTab, setActiveTab] = useState('overview');
  
  // Card component for summary metrics
  const MetricCard = ({ 
    title, 
    value, 
    color, 
    hasLegend = true 
  }: {
    title: string;
    value: number;
    color: string;
    hasLegend?: boolean;
  }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-gray-700 font-medium text-sm">{title}</h3>
        <button className="text-gray-400">•••</button>
      </div>
      
      <div className="flex justify-center my-6">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle 
              cx="50" cy="50" r="45" 
              fill="none" 
              stroke="#f0f0f0" 
              strokeWidth="10" 
            />
            <circle 
              cx="50" cy="50" r="45" 
              fill="none" 
              stroke={color} 
              strokeWidth="10" 
              strokeDasharray="283" 
              strokeDashoffset="50"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-gray-800">{value}</span>
          </div>
        </div>
      </div>
      
      {hasLegend && (
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
          <span className="text-xs text-gray-500">Legend</span>
          <div className="ml-auto">
            <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24">
              <path fill="currentColor" d="M3,9H21V11H3V9M3,5H21V7H3V5M3,13H21V15H3V13M3,17H21V19H3V17Z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
  
  // Chart component for monthly data
  const ChartCard = ({ 
    title, 
    dataKey, 
    color, 
    secondaryColor 
  }: {
    title: string;
    dataKey: string;
    color: string;
    secondaryColor: string;
  }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-gray-700 font-medium text-sm">{title}</h3>
        <button className="text-gray-400">•••</button>
      </div>
      
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey={dataKey} fill={color} barSize={10} radius={[5, 5, 0, 0]} />
            <Bar dataKey="month" fill={secondaryColor} barSize={10} radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex items-center mt-2 space-x-6">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
          <span className="ml-2 text-xs text-gray-500">{dataKey}</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: secondaryColor }}></div>
          <span className="ml-2 text-xs text-gray-500">month</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs text-gray-500">Label</span>
            <div className="text-2xl font-bold">14,744</div>
          </div>
          <div className="text-xs font-semibold text-green-500">+13.6%</div>
        </div>
      </div>
    </div>
  );
  
  // Gauge component for the postnatal care metric
  const GaugeCard = () => (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-gray-700 font-medium text-sm mb-4">Postnatal care uptake rate.</h3>
      
      <div className="relative flex justify-center my-6">
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r="60"
            fill="none"
            stroke="#f0f0f0"
            strokeWidth="20"
          />
          <circle
            cx="80"
            cy="80"
            r="60"
            fill="none"
            stroke="#4169E1"
            strokeWidth="20"
            strokeDasharray="377"
            strokeDashoffset="160"
            strokeLinecap="round"
            transform="rotate(-90 80 80)"
          />
          <circle
            cx="80"
            cy="20"
            r="8"
            fill="#4169E1"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="mb-1">
            <svg className="w-5 h-5 text-blue-700" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
            </svg>
          </div>
          <span className="text-4xl font-bold text-gray-800">350</span>
          <span className="text-sm text-gray-600">Excellent</span>
        </div>
      </div>
      
      <div className="mt-4">
        <button className="w-full py-2 bg-blue-100 text-blue-700 rounded-md font-medium text-sm">
          Details
        </button>
      </div>
    </div>
  );
  
  return (
    <div className="bg-gray-50 min-h-screen">

      
      {/* Main Content */}
      <main className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Overview</h1>
        
        {/* Top row - Summary metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <MetricCard title="Total number of mothers registered." value={1456} color="#4299E1" />
          <MetricCard title="Number of ongoing pregnancies." value={343} color="#68D391" />
          <MetricCard title="Birth outcomes" value={12} color="#805AD5" />
          <MetricCard title="Average maternal age" value={1456} color="#F56565" />
        </div>
        
        {/* Bottom row - Charts and Gauge */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <ChartCard title="Number of pregnancies per month" dataKey="pregnancies" color="#68D391" secondaryColor="#90CDF4" />
          </div>
          <div className="lg:col-span-1">
            <ChartCard title="Number of antenatal visits" dataKey="visits" color="#68D391" secondaryColor="#90CDF4" />
          </div>
          <div className="lg:col-span-1">
            <ChartCard title="Vaccination rates" dataKey="vaccines" color="#68D391" secondaryColor="#90CDF4" />
          </div>
          <div className="lg:col-span-1">
            <GaugeCard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;