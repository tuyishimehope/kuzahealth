/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import {
  Activity,
  AlertCircle,
  Baby,
  BarChart3,
  Calendar,
  CheckCircle2,
  Eye,
  MapPin,
  RefreshCw,
  UserPlus,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import React from "react";
import type { IconType } from "react-icons";
// Mock axios instance - replace with your actual axiosInstance
const axiosInstance = {
  get: async (url: any) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Mock data based on endpoint
    switch (url) {
      case "/api/health-workers":
        return {
          data: [
            {
              id: "1",
              first_name: "Alice",
              last_name: "Johnson",
              service_area: "Kicukiro",
              qualification: "Nurse",
              phone_number: "+250788123456",
            },
            {
              id: "2",
              first_name: "Bob",
              last_name: "Smith",
              service_area: "Gasabo",
              qualification: "Midwife",
              phone_number: "+250788234567",
            },
            {
              id: "3",
              first_name: "Carol",
              last_name: "Davis",
              service_area: "Nyarugenge",
              qualification: "CHW",
              phone_number: "+250788345678",
            },
          ],
        };
      case "/api/parents":
        return {
          data: Array.from({ length: 156 }, (_, i) => ({
            id: `p${i + 1}`,
            firstName: `Parent${i + 1}`,
            lastName: `Last${i + 1}`,
            district: ["Kicukiro", "Gasabo", "Nyarugenge"][i % 3],
            highRisk: Math.random() > 0.8,
          })),
        };
      case "/api/infants":
        return {
          data: Array.from({ length: 89 }, (_, i) => ({
            id: `i${i + 1}`,
            firstName: `Baby${i + 1}`,
            deliveryDate: new Date(
              Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
          })),
        };
      case "/api/visits":
        return {
          data: Array.from({ length: 234 }, (_, i) => ({
            id: `v${i + 1}`,
            status: ["Scheduled", "Completed", "Cancelled"][
              Math.floor(Math.random() * 3)
            ],
            visitType: ["Antenatal", "Postnatal", "Emergency"][
              Math.floor(Math.random() * 3)
            ],
            scheduledTime: new Date(
              Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000
            ).toISOString(),
          })),
        };
      default:
        return { data: [] };
    }
  },
};

// type StatCardProps = {
//   title: string;
//   value: number | string;
//   icon: IconType;
//   color: string; // e.g., "bg-blue-500"
//   trend?: number;
//   loading?: boolean;
// };

// const StatCard: React.FC<StatCardProps> = ({
//   title,
//   value,
//   icon: Icon,
//   color,
//   trend,
//   loading,
// }) => (
//   <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
//     <div className="flex items-center justify-between">
//       <div className="flex-1">
//         <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
//         {loading ? (
//           <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
//         ) : (
//           <div className="flex items-baseline space-x-2">
//             <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
//             {trend !== undefined && (
//               <span
//                 className={`text-xs px-2 py-1 rounded-full ${
//                   trend > 0
//                     ? "bg-green-100 text-green-700"
//                     : "bg-red-100 text-red-700"
//                 }`}
//               >
//                 {trend > 0 ? "+" : ""}
//                 {trend}%
//               </span>
//             )}
//           </div>
//         )}
//       </div>
//       <div className={`p-3 rounded-lg ${color}`}>
//         <Icon size={24} className="text-white" />
//       </div>
//     </div>
//   </div>
// );
type QuickActionCardProps = {
  title: string;
  description: string;
  icon: IconType;
  onClick: () => void;
  color: string;
};

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  description,
  icon: Icon,
  onClick,
  color,
}) => (
  <div
    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group"
    onClick={onClick}
  >
    <div className="flex items-center space-x-4">
      <div
        className={`p-3 rounded-lg ${color} group-hover:scale-110 transition-transform duration-200`}
      >
        <Icon size={20} className="text-white" />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  </div>
);
type Activity = {
  icon: IconType;
  title: string;
  time: string;
  color: string; // Tailwind color class like bg-blue-500
};

type ActivityCardProps = {
  activities: Activity[];
  loading?: boolean;
};

const ActivityCard: React.FC<ActivityCardProps> = ({ activities, loading }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
        View All
      </button>
    </div>
    <div className="space-y-3">
      {loading
        ? Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
              </div>
            </div>
          ))
        : activities.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${activity.color}`}>
                <activity.icon size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
    </div>
  </div>
);
type Visit = {
  type: string;
  time: string;
  status: "Confirmed" | "Pending" | string;
};

type UpcomingVisitsCardProps = {
  visits: Visit[];
  loading?: boolean;
};

const UpcomingVisitsCard: React.FC<UpcomingVisitsCardProps> = ({
  visits,
  loading,
}) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">Upcoming Visits</h3>
      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
        Schedule New
      </button>
    </div>
    <div className="space-y-3">
      {loading
        ? Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-lg animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </div>
          ))
        : visits.slice(0, 5).map((visit, index) => (
            <div
              key={index}
              className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {visit.type}
                  </p>
                  <p className="text-xs text-gray-500">{visit.time}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    visit.status === "Confirmed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {visit.status}
                </span>
              </div>
            </div>
          ))}
    </div>
  </div>
);

const Dashboard = () => {
  const [data, setData] = useState<any>({
    healthWorkers: [],
    parents: [],
    infants: [],
    visits: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [healthWorkersRes, parentsRes, infantsRes, visitsRes] =
        await Promise.all([
          axiosInstance.get("/api/health-workers"),
          axiosInstance.get("/api/parents"),
          axiosInstance.get("/api/infants"),
          axiosInstance.get("/api/visits"),
        ]);

      setData({
        healthWorkers: healthWorkersRes.data,
        parents: parentsRes.data,
        infants: infantsRes.data,
        visits: visitsRes.data,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
  };

  // Calculate statistics
  // const stats = {
  //   totalHealthWorkers: data.healthWorkers.length,
  //   activeHealthWorkers: data.healthWorkers.filter(
  //     (hw: { service_area: any }) => hw.service_area
  //   ).length,
  //   totalParents: data.parents.length,
  //   highRiskParents: data.parents.filter((p: { highRisk: any }) => p.highRisk)
  //     .length,
  //   totalInfants: data.infants.length,
  //   recentInfants: data.infants.filter(
  //     (i: { deliveryDate: string | number | Date }) =>
  //       new Date(i.deliveryDate) >
  //       new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  //   ).length,
  //   scheduledVisits: data.visits.filter(
  //     (v: { status: string }) => v.status === "Scheduled"
  //   ).length,
  //   completedVisits: data.visits.filter(
  //     (v: { status: string }) => v.status === "Completed"
  //   ).length,
  // };

  // Mock activities
  const activities = [
    {
      title: "New health worker registered",
      time: "2 hours ago",
      icon: UserPlus,
      color: "bg-green-500",
    },
    {
      title: "Visit completed in Gasabo",
      time: "4 hours ago",
      icon: CheckCircle2,
      color: "bg-blue-500",
    },
    {
      title: "High-risk patient flagged",
      time: "6 hours ago",
      icon: AlertCircle,
      color: "bg-red-500",
    },
    {
      title: "Report generated",
      time: "1 day ago",
      icon: BarChart3,
      color: "bg-purple-500",
    },
  ];

  // Mock upcoming visits
  const upcomingVisits = data.visits
    .filter((v: { status: string }) => v.status === "Scheduled")
    .slice(0, 5)
    .map(
      (visit: {
        visitType: string;
        scheduledTime: string | number | Date;
      }) => ({
        type: visit.visitType + " Care Visit",
        time: new Date(visit.scheduledTime).toLocaleDateString(),
        status: "Confirmed",
      })
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Healthcare Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Monitor and manage healthcare operations
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Health Workers"
            value={stats.totalHealthWorkers.toString()}
            icon={Users}
            color="bg-blue-500"
            trend={5}
            loading={loading}
          />
          <StatCard
            title="Active Parents"
            value={stats.totalParents.toString()}
            icon={Activity}
            color="bg-green-500"
            trend={12}
            loading={loading}
          />
          <StatCard
            title="Total Infants"
            value={stats.totalInfants.toString()}
            icon={Baby}
            color="bg-purple-500"
            trend={8}
            loading={loading}
          />
          <StatCard
            title="Scheduled Visits"
            value={stats.scheduledVisits.toString()}
            icon={Calendar}
            color="bg-orange-500"
            trend={-3}
            loading={loading}
          />
        </div> */}

        {/* Secondary Stats */}
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide">
                  High Risk
                </p>
                <p className="text-lg font-bold text-red-600">
                  {stats.highRiskParents}
                </p>
              </div>
              <AlertCircle size={20} className="text-red-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide">
                  Completed
                </p>
                <p className="text-lg font-bold text-green-600">
                  {stats.completedVisits}
                </p>
              </div>
              <CheckCircle2 size={20} className="text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide">
                  Recent Births
                </p>
                <p className="text-lg font-bold text-purple-600">
                  {stats.recentInfants}
                </p>
              </div>
              <Baby size={20} className="text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide">
                  Service Areas
                </p>
                <p className="text-lg font-bold text-blue-600">3</p>
              </div>
              <MapPin size={20} className="text-blue-500" />
            </div>
          </div>
        </div> */}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* <QuickActionCard
              title="Add Health Worker"
              description="Register new health worker"
              icon={UserPlus}
              color="bg-blue-500"
              onClick={() => console.log("Add health worker")}
            /> */}
            <QuickActionCard
              title="View All Workers"
              description="Manage health worker profiles"
              icon={Users}
              color="bg-green-500"
              onClick={() => console.log("View workers")}
            />
            {/* <QuickActionCard
              title="Schedule Visit"
              description="Plan upcoming care visits"
              icon={Calendar}
              color="bg-purple-500"
              onClick={() => console.log("Schedule visit")}
            /> */}
            <QuickActionCard
              title="Generate Report"
              description="Create system analytics"
              icon={BarChart3}
              color="bg-orange-500"
              onClick={() => console.log("Generate report")}
            />
            {/* <QuickActionCard
              title="View Parents"
              description="Manage patient records"
              icon={Eye}
              color="bg-indigo-500"
              onClick={() => console.log("View parents")}
            /> */}
            <QuickActionCard
              title="Emergency Alert"
              description="Handle urgent cases"
              icon={AlertCircle}
              color="bg-red-500"
              onClick={() => console.log("Emergency alert")}
            />
          </div>
        </div>

        {/* Activity and Visits */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivityCard activities={activities} loading={loading} />
          <UpcomingVisitsCard visits={upcomingVisits} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
