import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Baby,
  BarChart3,
  Calendar,
  CheckCircle,
  Heart,
  RefreshCw,
  Shield,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import React from "react";
import Map from "../../components/HealthWorker/Map";


import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// Import icons separately
import {
  PieChart as IconPieChart,
  LineChart as IconLineChart,
} from "lucide-react";
import VisitTrends from "./VisitTrends";
// Enhanced type definitions
interface HealthWorker {
  id: string;
  name: string;
  service_area: string;
  specialty: string;
  status: "active" | "inactive";
  workload: number;
  performance_score: number;
  created_at: string;
}

interface Parent {
  id: string;
  name: string;
  age: number;
  highRisk: boolean;
  riskScore: number;
  lastVisit?: string;
  pregnancyStatus: "pregnant" | "postpartum" | "not_pregnant";
  created_at: string;
}

interface Infant {
  id: string;
  name: string;
  parent_id: string;
  deliveryDate: string;
  birthWeight: number;
  gestationalAge: number;
  healthStatus: "healthy" | "at_risk" | "critical";
  created_at: string;
}

interface Visit {
  id: string;
  parent_id: string;
  infant_id?: string;
  health_worker_id: string;
  scheduledDate: string;
  status: "Scheduled" | "Completed" | "Cancelled" | "No Show";
  visitType: "prenatal" | "postnatal" | "vaccination" | "checkup";
  priority: "low" | "medium" | "high" | "urgent";
  satisfaction_score?: number;
  duration_minutes?: number;
  created_at: string;
}

// Enhanced StatCard Component
type StatCardProps = {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  trend?: { value: number; isUp: boolean };
  loading?: boolean;
  subtitle?: string;
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
  loading,
  subtitle,
}) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-2">
          <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            {title}
          </h4>
        </div>

        {loading ? (
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-20"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-baseline space-x-3">
              <h3 className="text-3xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                {value}
              </h3>
              {trend && (
                <div className="flex items-center space-x-1">
                  {trend.isUp ? (
                    <TrendingUp size={16} className="text-emerald-500" />
                  ) : (
                    <TrendingDown size={16} className="text-red-500" />
                  )}
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      trend.isUp
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {trend.isUp ? "+" : ""}
                    {trend.value.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        )}
      </div>

      <div
        className={`p-4 rounded-xl ${color} group-hover:scale-110 transition-transform duration-200`}
      >
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </div>
);

// Visit Trends Chart
export const VisitTrendsChart = ({
  data,
  loading,
}: {
  data: any[];
  loading: boolean;
}) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <IconLineChart size={20} className="text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Visit Trends</h3>
          <p className="text-sm text-gray-500">Monthly visit statistics</p>
        </div>
      </div>
    </div>

    {loading ? (
      <div className="h-80 bg-gray-100 rounded-lg animate-pulse"></div>
    ) : (
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="scheduledGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
          <YAxis stroke="#6B7280" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="completed"
            stroke="#10B981"
            strokeWidth={2}
            fill="url(#completedGradient)"
            name="Completed Visits"
          />
          <Area
            type="monotone"
            dataKey="scheduled"
            stroke="#3B82F6"
            strokeWidth={2}
            fill="url(#scheduledGradient)"
            name="Scheduled Visits"
          />
        </AreaChart>
      </ResponsiveContainer>
    )}
  </div>
);

// Risk Distribution Chart
const RiskDistributionChart = ({
  data,
  loading,
}: {
  data: any[];
  loading: boolean;
}) => {
  const COLORS = ["#EF4444", "#10B981", "#F59E0B", "#8B5CF6"];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <IconPieChart size={20} className="text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Risk Distribution
            </h3>
            <p className="text-sm text-gray-500">
              Patient risk assessment breakdown
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-80 bg-gray-100 rounded-lg animate-pulse"></div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={5}
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Legend />
          </RechartsPieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

// API fetcher with error handling
const fetchDashboardData = async () => {
  try {
    const [healthWorkersRes, parentsRes, infantsRes, visitsRes] =
      await Promise.all([
        axiosInstance.get("/api/health-workers"),
        axiosInstance.get("/api/parents"),
        axiosInstance.get("/api/infants"),
        axiosInstance.get("/api/visits"),
      ]);

    return {
      healthWorkers: healthWorkersRes.data as HealthWorker[],
      parents: parentsRes.data as Parent[],
      infants: infantsRes.data as Infant[],
      visits: visitsRes.data as Visit[],
    };
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    throw new Error("Failed to fetch dashboard data");
  }
};

// Utility functions
const calculateTrend = (
  current: number,
  previous: number
): { value: number; isUp: boolean } => {
  if (previous === 0) return { value: 0, isUp: true };
  const change = ((current - previous) / previous) * 100;
  return { value: Math.abs(change), isUp: change >= 0 };
};

const getMonthlyData = (
  items: any[],
  dateField: string,
  months: number = 6
) => {
  const now = new Date();
  const monthlyData: { [key: string]: any[] } = {};

  for (let i = months - 1; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = month.toLocaleDateString("en-US", { month: "short" });
    monthlyData[key] = items.filter((item) => {
      const itemDate = new Date(item[dateField]);
      return (
        itemDate.getMonth() === month.getMonth() &&
        itemDate.getFullYear() === month.getFullYear()
      );
    });
  }

  return monthlyData;
};

const Dashboard = () => {
  const { data, isLoading, refetch, isFetching, error } = useQuery({
    queryKey: ["dashboardData"],
    queryFn: fetchDashboardData,
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: 1000,
  });

  // Memoized calculations
  const analytics = React.useMemo(() => {
    if (!data) return null;

    const { healthWorkers, parents, infants, visits } = data;

    // Current period stats
    const activeHealthWorkers = healthWorkers.filter(
      (hw) => hw.status === "active"
    );
    const highRiskParents = parents.filter((p) => p.highRisk);
    const recentInfants = infants.filter(
      (i) =>
        new Date(i.deliveryDate) >
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );
    const scheduledVisits = visits.filter((v) => v.status === "Scheduled");
    const completedVisits = visits.filter((v) => v.status === "Completed");
    const urgentVisits = visits.filter((v) => v.priority === "urgent");

    // Previous period for trends (simplified - you might want to fetch actual historical data)
    const prevHealthWorkers = Math.floor(healthWorkers.length * 0.95);
    const prevParents = Math.floor(parents.length * 0.92);
    const prevInfants = Math.floor(infants.length * 0.88);
    const prevVisits = Math.floor(visits.length * 0.9);

    // Monthly data processing
    const monthlyVisits = getMonthlyData(visits, "created_at", 6);
    const monthlyInfants = getMonthlyData(infants, "deliveryDate", 6);
    const months = Object.keys(monthlyVisits);

    // Chart data
    const visitsTrendData = months.map((month) => ({
      month,
      scheduled: monthlyVisits[month].filter((v) => v.status === "Scheduled")
        .length,
      completed: monthlyVisits[month].filter((v) => v.status === "Completed")
        .length,
      cancelled: monthlyVisits[month].filter((v) => v.status === "Cancelled")
        .length,
    }));

    const birthTrendsData = months.map((month) => ({
      month,
      births: monthlyInfants[month].length,
      highRisk: monthlyInfants[month].filter(
        (i) => i.healthStatus === "at_risk" || i.healthStatus === "critical"
      ).length,
    }));

    // Risk distribution
    const riskDistribution = [
      {
        id: "high",
        value: highRiskParents.length,
        label: "High Risk",
        name: "High Risk",
      },
      {
        id: "low",
        value: parents.length - highRiskParents.length,
        label: "Low Risk",
        name: "Low Risk",
      },
    ];

    // Visit type distribution
    const visitTypeData = [
      {
        id: "prenatal",
        value: visits.filter((v) => v.visitType === "prenatal").length,
        label: "Prenatal",
        name: "Prenatal",
      },
      {
        id: "postnatal",
        value: visits.filter((v) => v.visitType === "postnatal").length,
        label: "Postnatal",
        name: "Postnatal",
      },
      {
        id: "vaccination",
        value: visits.filter((v) => v.visitType === "vaccination").length,
        label: "Vaccination",
        name: "Vaccination",
      },
      {
        id: "checkup",
        value: visits.filter((v) => v.visitType === "checkup").length,
        label: "Checkup",
        name: "Checkup",
      },
    ];

    // Worker performance data
    const workerPerformance = activeHealthWorkers
      .map((worker) => ({
        name: worker.name.split(" ")[0],
        workload: worker.workload,
        performance: worker.performance_score,
        specialty: worker.specialty,
      }))
      .slice(0, 15);

    // Satisfaction scores
    const satisfactionScores = visits
      .filter((v) => v.satisfaction_score && v.status === "Completed")
      .map((v) => v.satisfaction_score!);
    const avgSatisfaction =
      satisfactionScores.length > 0
        ? satisfactionScores.reduce((a, b) => a + b, 0) /
          satisfactionScores.length
        : 0;

    return {
      // Current stats
      totalHealthWorkers: healthWorkers.length,
      activeHealthWorkers: activeHealthWorkers.length,
      totalParents: parents.length,
      highRiskParents: highRiskParents.length,
      totalInfants: infants.length,
      recentInfants: recentInfants.length,
      scheduledVisits: scheduledVisits.length,
      completedVisits: completedVisits.length,
      urgentVisits: urgentVisits.length,
      completionRate:
        visits.length > 0 ? (completedVisits.length / visits.length) * 100 : 0,
      avgSatisfaction,

      // Trends
      trends: {
        healthWorkers: calculateTrend(healthWorkers.length, prevHealthWorkers),
        parents: calculateTrend(parents.length, prevParents),
        infants: calculateTrend(infants.length, prevInfants),
        visits: calculateTrend(visits.length, prevVisits),
      },

      // Chart data
      months,
      visitsTrendData,
      birthTrendsData,
      riskDistribution,
      visitTypeData,
      workerPerformance,
    };
  }, [data]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-red-200 max-w-md w-full text-center">
          <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600 mb-4">
            Failed to load dashboard data. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const locationData = [
    { region: "Kigali City", percentage: 25, color: "bg-purple-500" },
    { region: "North Province", percentage: 20, color: "bg-pink-500" },
    { region: "South Province", percentage: 22, color: "bg-purple-400" },
    { region: "East Province", percentage: 32, color: "bg-green-500" },
    { region: "West Province", percentage: 18, color: "bg-lime-500" },
  ];

  type ProgressBarProps = { label: string; percentage: number; color: string };

  const ProgressBar: React.FC<ProgressBarProps> = ({
    label,
    percentage,
    color,
  }) => (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-semibold text-gray-900">
          {percentage}%
        </span>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-600 rounded-2xl">
              <Heart size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-1">
                Healthcare Analytics Dashboard
              </h1>
              <p className="text-lg text-gray-600">
                Comprehensive maternal & infant care monitoring with advanced
                analytics
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Last updated</p>
              <p className="text-sm font-semibold text-gray-900">
                {new Date().toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <RefreshCw
                size={18}
                className={isFetching ? "animate-spin" : ""}
              />
              <span className="font-semibold">Refresh</span>
            </button>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))
          ) : analytics ? (
            <>
              <StatCard
                title="Active Health Workers"
                value={analytics.totalHealthWorkers}
                subtitle={`${analytics.totalHealthWorkers} total`}
                icon={UserCheck}
                color="bg-blue-500"
                trend={analytics.trends.healthWorkers}
                loading={isLoading}
              />
              <StatCard
                title="Registered Parents"
                value={analytics.totalParents.toLocaleString()}
                subtitle={`${analytics.highRiskParents} high-risk`}
                icon={Users}
                color="bg-emerald-500"
                trend={analytics.trends.parents}
                loading={isLoading}
              />
              <StatCard
                title="Total Infants"
                value={analytics.totalInfants.toLocaleString()}
                subtitle={`${analytics.recentInfants} this month`}
                icon={Baby}
                color="bg-purple-500"
                trend={analytics.trends.infants}
                loading={isLoading}
              />
              <StatCard
                title="Scheduled Visits"
                value={analytics.scheduledVisits}
                subtitle={`${analytics.urgentVisits} urgent`}
                icon={Calendar}
                color="bg-amber-500"
                trend={analytics.trends.visits}
                loading={isLoading}
              />
              <StatCard
                title="Completed Visits"
                value={analytics.completedVisits}
                subtitle="This period"
                icon={CheckCircle}
                color="bg-green-500"
                loading={isLoading}
              />
              <StatCard
                title="Completion Rate"
                value={`${analytics.completionRate.toFixed(1)}%`}
                subtitle="Visit completion"
                icon={Activity}
                color="bg-indigo-500"
                loading={isLoading}
              />
              <StatCard
                title="Satisfaction Score"
                value={`${analytics.avgSatisfaction.toFixed(1)}/10`}
                subtitle="Patient satisfaction"
                icon={Heart}
                color="bg-pink-500"
                loading={isLoading}
              />
              <StatCard
                title="Risk Assessment"
                value={`${(
                  (analytics.highRiskParents / analytics.totalParents) *
                  100
                ).toFixed(1)}%`}
                subtitle="High-risk cases"
                icon={Shield}
                color="bg-red-500"
                loading={isLoading}
              />
            </>
          ) : null}
        </div>

        {/* Advanced Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="lg:col-span-2">
            {/* <VisitTrendsChart
              data={analytics?.visitsTrendData || []}
              loading={isLoading}
            /> */}
            <VisitTrends/>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RiskDistributionChart
            data={analytics?.riskDistribution || []}
            loading={isLoading}
          />
        </div>

        {/* Regional Coverage & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <BarChart3 size={20} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Health Coverage by Region
                </h3>
                <p className="text-sm text-gray-500">
                  Regional distribution analysis
                </p>
              </div>
            </div>
            {locationData.map((loc, i) => (
              <ProgressBar
                key={i}
                label={loc.region}
                percentage={loc.percentage}
                color={loc.color}
              />
            ))}
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Activity size={20} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Geographic Coverage
                </h3>
                <p className="text-sm text-gray-500">
                  Service area visualization
                </p>
              </div>
            </div>
            <div className="h-80 rounded-xl overflow-hidden shadow-inner border border-gray-200">
              <Map />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
