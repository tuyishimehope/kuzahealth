import { axiosInstance } from "@/utils/axiosInstance";
import {
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  Gauge,
} from "@mui/x-charts";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  Baby,
  Calendar,
  RefreshCw,
  Users,
  TrendingUp,
  TrendingDown,
  Heart,
  AlertTriangle,
  CheckCircle,
  UserCheck,
  Shield,
} from "lucide-react";
import React from "react";
import Map from "../../components/HealthWorker/Map";
import { motion } from "framer-motion";

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

// Loading skeleton component
const ChartSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    <div className="animate-pulse">
      <div className="h-6 bg-gray-200 rounded-lg w-48 mb-4"></div>
      <div className="h-64 bg-gray-100 rounded-lg"></div>
    </div>
  </div>
);

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
      { id: "high", value: highRiskParents.length, label: "High Risk" },
      {
        id: "low",
        value: parents.length - highRiskParents.length,
        label: "Low Risk",
      },
    ];

    // Visit type distribution
    const visitTypeData = [
      {
        id: "prenatal",
        value: visits.filter((v) => v.visitType === "prenatal").length,
        label: "Prenatal",
      },
      {
        id: "postnatal",
        value: visits.filter((v) => v.visitType === "postnatal").length,
        label: "Postnatal",
      },
      {
        id: "vaccination",
        value: visits.filter((v) => v.visitType === "vaccination").length,
        label: "Vaccination",
      },
      {
        id: "checkup",
        value: visits.filter((v) => v.visitType === "checkup").length,
        label: "Checkup",
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
                Healthcare Dashboard
              </h1>
              <p className="text-lg text-gray-600">
                Comprehensive maternal & infant care monitoring
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
                value={analytics.activeHealthWorkers}
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

        {/* Enhanced Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Patient Satisfaction Gauge */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Patient Satisfaction
              </h2>
              <Heart size={20} className="text-pink-500" />
            </div>
            {isLoading ? (
              <div className="h-64 bg-gray-100 rounded-xl animate-pulse"></div>
            ) : analytics ? (
              <div className="flex justify-center">
                <Gauge
                  value={analytics.avgSatisfaction}
                  startAngle={-90}
                  endAngle={90}
                  min={0}
                  max={10}
                  height={200}
                  width={280}
                  text={`${analytics.avgSatisfaction.toFixed(1)}/10`}
                  innerRadius="60%"
                  outerRadius="90%"
                />
              </div>
            ) : (
              <ChartSkeleton />
            )}
            <p className="text-sm text-gray-500 text-center mt-2">
              Average satisfaction from completed visits
            </p>
          </div>

          {/* Risk Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Risk Distribution
              </h2>
              <Shield size={20} className="text-red-500" />
            </div>
            {isLoading ? (
              <div className="h-64 bg-gray-100 rounded-xl animate-pulse"></div>
            ) : analytics ? (
              <PieChart
                series={[
                  {
                    data: analytics.riskDistribution,
                    innerRadius: 60,
                    outerRadius: 100,
                    paddingAngle: 2,
                    cornerRadius: 4,
                  },
                ]}
                height={240}
                colors={["#ef4444", "#10b981"]}
                slotProps={{
                  legend: {
                    direction: "horizontal",
                    position: { vertical: "bottom", horizontal: "center" },
                  },
                }}
              />
            ) : (
              <ChartSkeleton />
            )}
          </div>

          {/* Visit Types */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Visit Types</h2>
              <Activity size={20} className="text-blue-500" />
            </div>
            {isLoading ? (
              <div className="h-64 bg-gray-100 rounded-xl animate-pulse"></div>
            ) : analytics ? (
              <PieChart
                series={[
                  {
                    data: analytics.visitTypeData,
                    highlightScope: { fade: "global", highlight: "item" },
                    faded: { innerRadius: 30, additionalRadius: -30 },
                  },
                ]}
                height={240}
                colors={["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"]}
                slotProps={{
                  legend: {
                    direction: "horizontal",
                    position: { vertical: "bottom", horizontal: "center" },
                  },
                }}
              />
            ) : (
              <ChartSkeleton />
            )}
          </div>
        </div>

        {/* Enhanced Charts - Second Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          {/* Visits Trend */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Visits Trend (6 months)
              </h2>
              <Calendar size={20} className="text-blue-500" />
            </div>
            {isLoading ? (
              <div className="h-80 bg-gray-100 rounded-xl animate-pulse"></div>
            ) : analytics ? (
              <LineChart
                xAxis={[
                  {
                    data: analytics.months,
                    scaleType: "point",
                  },
                ]}
                series={[
                  {
                    data: analytics.visitsTrendData.map((d) => d.scheduled),
                    label: "Scheduled",
                    color: "#3b82f6",
                    curve: "monotoneX", // corrected
                  },
                  {
                    data: analytics.visitsTrendData.map((d) => d.completed),
                    label: "Completed",
                    color: "#10b981",
                    curve: "monotoneX", // corrected
                  },
                  {
                    data: analytics.visitsTrendData.map((d) => d.cancelled),
                    label: "Cancelled",
                    color: "#ef4444",
                    curve: "monotoneX", // corrected
                  },
                ]}
                height={320}
                margin={{ left: 60, right: 60, top: 20, bottom: 60 }}
                grid={{ vertical: true, horizontal: true }}
              />
            ) : (
              <ChartSkeleton />
            )}
          </div>

          {/* Birth Trends */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Birth Trends</h2>
              <Baby size={20} className="text-purple-500" />
            </div>
            {isLoading ? (
              <div className="h-80 bg-gray-100 rounded-xl animate-pulse"></div>
            ) : analytics ? (
              <BarChart
                xAxis={[
                  {
                    scaleType: "band",
                    data: analytics.months,
                  },
                ]}
                series={[
                  {
                    data: analytics.birthTrendsData.map((d) => d.births),
                    label: "Total Births",
                    color: "#8b5cf6",
                  },
                  {
                    data: analytics.birthTrendsData.map((d) => d.highRisk),
                    label: "High Risk",
                    color: "#ef4444",
                  },
                ]}
                height={320}
                margin={{ left: 60, right: 60, top: 20, bottom: 60 }}
              />
            ) : (
              <ChartSkeleton />
            )}
          </div>
        </div>

        {/* Worker Performance */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Health Worker Performance vs Workload
            </h2>
            <UserCheck size={20} className="text-emerald-500" />
          </div>
          <p className="text-gray-600 mb-4">
            Performance score vs current workload for active health workers
          </p>
          {isLoading ? (
            <div className="h-96 bg-gray-100 rounded-xl animate-pulse"></div>
          ) : analytics ? (
            <ScatterChart
              dataset={analytics.workerPerformance}
              xAxis={[
                {
                  dataKey: "workload",
                  label: "Current Workload",
                  min: 0,
                },
              ]}
              yAxis={[
                {
                  dataKey: "performance",
                  label: "Performance Score",
                  min: 0,
                  max: 100,
                },
              ]}
              series={[
                {
                  label: "Performance",
                  color: "#06b6d4",
                  datasetKeys: {
                    x: "workload",
                    y: "performance",
                    id: "id", // Each data point must have a unique 'id'
                  },
                },
              ]}
              height={400}
              margin={{ left: 80, right: 80, top: 40, bottom: 80 }}
              grid={{ vertical: true, horizontal: true }}
            />
          ) : (
            <ChartSkeleton />
          )}
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
    </div>
  );
};

export default Dashboard;
