/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import {
  Activity,
  AlertCircle,
  BarChart3,
  CheckCircle2,
  RefreshCw,
  UserPlus,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import SystemMonitor from "./SystemMonitor";
import { useNavigate } from "react-router-dom";

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
    className="bg-white rounded-2xl p-6 shadow hover:shadow-lg border border-gray-100 
             transition-all duration-200 cursor-pointer group hover:-translate-y-1"
    onClick={onClick}
  >
    <div className="flex items-center space-x-4">
      <div
        className={`p-3 rounded-xl ${color} bg-gradient-to-tr from-${color}-500 to-${color}-400
                  shadow-inner group-hover:scale-110 transition-transform`}
      >
        <Icon size={20} className="text-white" />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  </div>
);
type Activity = {
  icon: IconType;
  title: string;
  time: string;
  color: string;
};

type RecentActivitiesProps = {
  activities: Activity[];
  loading?: boolean;
};

export const RecentActivities: React.FC<RecentActivitiesProps> = ({
  activities,
  loading,
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Recent Activities
        </h3>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View All
        </button>
      </div>
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
              </div>
            </div>
          ))
        ) : (
          <div className="relative pl-6 border-l border-gray-200 space-y-4">
            {activities.map((activity, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div
                  className={`absolute -left-3 top-1 w-6 h-6 rounded-full flex items-center justify-center ${activity.color}`}
                >
                  <activity.icon size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

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
                  className={`px-2.5 py-1 rounded-full text-xs font-medium
  ${
    visit.status === "Confirmed"
      ? "bg-green-100 text-green-700"
      : visit.status === "Pending"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700"
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
  const navigate = useNavigate();

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
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 text-white 
             hover:bg-blue-700 transition disabled:opacity-50 shadow-sm"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <QuickActionCard
              title="Manage Health Workers"
              description="Add, update, or remove health worker accounts"
              icon={Users}
              color="bg-green-600"
              onClick={() => navigate("/superadmin/health-workers")}
            />

            <QuickActionCard
              title="Audit Logs"
              description="Review all system activity for compliance & HIPAA"
              icon={Activity}
              color="bg-blue-600"
              onClick={() => navigate("/superadmin/audit")}
            />

            <QuickActionCard
              title="Access Control"
              description="Assign roles, permissions, and security policies"
              icon={UserPlus}
              color="bg-purple-600"
              onClick={() => navigate("/superadmin/users")}
            />

            {/* <QuickActionCard
              title="Analytics & Reports"
              description="Generate insights on visits, workers, and patients"
              icon={BarChart3}
              color="bg-orange-600"
              onClick={() => console.log("Generate analytics")}
            />

            <QuickActionCard
              title="Emergency Broadcast"
              description="Send alerts to all health workers instantly"
              icon={AlertCircle}
              color="bg-red-600"
              onClick={() => console.log("Send broadcast")}
            />

            <QuickActionCard
              title="System Settings"
              description="Configure integrations, backups, and policies"
              icon={CheckCircle2}
              color="bg-gray-700"
              onClick={() => console.log("System settings")}
            /> */}
          </div>
        </div>

        <SystemMonitor />
        {/* Activity and Visits */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivities activities={activities} loading={loading} />
          <UpcomingVisitsCard visits={upcomingVisits} loading={loading} />
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
