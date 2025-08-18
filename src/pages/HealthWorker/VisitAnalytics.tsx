import { Card, CardContent } from "@/components/ui/card";
import { axiosInstance } from "@/utils/axiosInstance";
import {
  Activity,
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  MessageSquare,
  RefreshCw,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import type { FC, ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Schedule } from "./Schedule/ViewSchedule";

type StatusKey = keyof typeof STATUS_COLORS;
type CommunicationKey = keyof typeof COMMUNICATION_COLORS;

const COLORS = {
  primary: "#3b82f6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#06b6d4",
  purple: "#8b5cf6",
  pink: "#ec4899",
  indigo: "#6366f1",
} as const;

const STATUS_COLORS = {
  scheduled: COLORS.info,
  completed: COLORS.success,
  cancelled: COLORS.danger,
  pending: COLORS.warning,
  "in-progress": COLORS.purple,
  "no-show": "#6b7280",
} as const;

const COMMUNICATION_COLORS = {
  phone: COLORS.primary,
  email: COLORS.success,
  video: COLORS.purple,
  "in-person": COLORS.info,
  sms: COLORS.warning,
} as const;

interface StatCardProps {
  icon: FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  color: string;
  trend?: "up" | "down";
}

const StatCard: FC<StatCardProps> = ({
  icon: Icon,
  title,
  value,
  subtitle,
  change,
  color,
  trend,
}) => (
  <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-gray-50">
    <div
      className={`absolute top-0 left-0 w-full h-1`}
      style={{ backgroundColor: color }}
    />
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            className="p-3 rounded-full bg-opacity-10"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon className="h-6 w-6" style={{ color }} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              {title}
            </h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        {change && (
          <div
            className={`flex items-center text-sm font-medium ${
              trend === "up" ? "text-green-600" : "text-red-600"
            }`}
          >
            <TrendingUp
              className={`h-4 w-4 mr-1 ${trend === "down" ? "rotate-180" : ""}`}
            />
            {change}
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

interface ChartCardProps {
  title: string;
  icon: FC<React.SVGProps<SVGSVGElement>>;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}

const ChartCard: FC<ChartCardProps> = ({
  title,
  icon: Icon,
  children,
  className = "",
  actions,
}) => (
  <Card
    className={`transition-all duration-300 hover:shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 ${className}`}
  >
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        {actions && (
          <div className="flex items-center space-x-2">{actions}</div>
        )}
      </div>
      {children}
    </CardContent>
  </Card>
);

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    color?: string;
    name?: string;
    value?: number | string;
  }>;
  label?: string;
}

const CustomTooltip: FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">
              {entry.name}: <span className="font-semibold">{entry.value}</span>
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const LoadingSpinner: FC = () => (
  <div className="flex justify-center items-center h-64">
    <div className="relative">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <div className="absolute inset-0 rounded-full h-12 w-12 border-2 border-gray-200"></div>
    </div>
  </div>
);

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState: FC<ErrorStateProps> = ({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center h-64 text-center">
    <XCircle className="h-12 w-12 text-red-500 mb-4" />
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      Failed to Load Data
    </h3>
    <p className="text-gray-600 mb-4">{error}</p>
    <button
      onClick={onRetry}
      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      <RefreshCw className="h-4 w-4" />
      <span>Retry</span>
    </button>
  </div>
);

type GroupBy = "month" | "type" | "status" | "communication";

interface ChartDataItem {
  name: string;
  value: number;
}

export default function VisitAnalytics() {
  const [visits, setVisits] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVisits = useCallback(async () => {
    try {
      setError(null);
      const response = await axiosInstance.get<Schedule[]>("/api/visits");
      setVisits(response.data);
    } catch (err) {
      console.error("Error fetching visits:", err);
      setError(
        "Unable to fetch visit data. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchVisits();
  }, [fetchVisits]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchVisits();
  };

  const processData = (
    visits: Schedule[],
    groupBy: GroupBy
  ): Record<string, number> => {
    return visits.reduce<Record<string, number>>((acc, visit) => {
      let key: string;

      switch (groupBy) {
        case "month": {
          if (!visit.scheduledTime) return acc;
          const date = new Date(visit.scheduledTime);
          key = `${date.toLocaleString("default", {
            month: "short",
          })} ${date.getFullYear()}`;
          break;
        }
        case "type":
          key = visit.visitType || "Unknown";
          break;
        case "status":
          key = visit.status || "Unknown";
          break;
        case "communication":
          key = visit.modeOfCommunication || "N/A";
          break;
        default:
          return acc;
      }

      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});
  };

  const formatToChartData = (data: Record<string, number>): ChartDataItem[] =>
    Object.entries(data)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

  const totalVisits = visits.length;
  const completedVisits = visits.filter((v) => v.status === "Completed").length;
  const completionRate = totalVisits
    ? ((completedVisits / totalVisits) * 100).toFixed(1)
    : "0";
  const avgDuration = visits.length
    ? (
        visits.reduce((sum, v) => sum + (parseInt(v.scheduledTime) || 0), 0) /
        visits.length
      ).toFixed(0)
    : "0";

  const visitsByMonth = formatToChartData(processData(visits, "month"));
  const visitsByType = formatToChartData(processData(visits, "type"));
  const visitsByStatus = formatToChartData(processData(visits, "status"));
  const visitsByCommunication = formatToChartData(
    processData(visits, "communication")
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Visit Analytics
            </h1>
            <p className="text-gray-600">
              Loading comprehensive visit insights...
            </p>
          </div>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <ErrorState error={error} onRetry={fetchVisits} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div>
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Visit Analytics Dashboard
              </h1>
              <p className="text-gray-600">
                Comprehensive insights into patient visits, appointments, and
                healthcare delivery
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Calendar}
            title="Total Visits"
            value={totalVisits.toLocaleString()}
            subtitle="All time visits"
            color={COLORS.primary}
            change="+12%"
            trend="up"
          />
          <StatCard
            icon={CheckCircle}
            title="Completion Rate"
            value={`${completionRate}%`}
            subtitle={`${completedVisits} completed`}
            color={COLORS.success}
            change="+5%"
            trend="up"
          />
          <StatCard
            icon={Clock}
            title="Avg Duration"
            value={`${avgDuration} min`}
            subtitle="Per visit"
            color={COLORS.warning}
            change="-3%"
            trend="down"
          />
          <StatCard
            icon={Activity}
            title="Active Today"
            value={
              visits.filter((v) => {
                const today = new Date();
                const visitDate = new Date(v.scheduledTime);
                return visitDate.toDateString() === today.toDateString();
              }).length
            }
            subtitle="Scheduled today"
            color={COLORS.purple}
            change="+8%"
            trend="up"
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 mb-8">
          {/* Monthly Trend - Full Width */}
          <ChartCard
            title="Visit Trends Over Time"
            icon={BarChart3}
            actions={
              <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                <Download className="h-4 w-4" />
              </button>
            }
          >
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={visitsByMonth}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={COLORS.primary}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={COLORS.primary}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={COLORS.primary}
                  strokeWidth={2}
                  fill="url(#colorVisits)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Charts Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Visit Types */}
            <ChartCard title="Visit Types" icon={Users}>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={visitsByType}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    paddingAngle={2}
                  >
                    {visitsByType.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          Object.values(COLORS)[
                            index % Object.values(COLORS).length
                          ]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Visit Status */}
            <ChartCard title="Visit Status" icon={AlertCircle}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={visitsByStatus} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" axisLine={false} tickLine={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    width={80}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {visitsByStatus.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          STATUS_COLORS[
                            entry.name.toLowerCase() as StatusKey
                          ] || COLORS.primary
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Communication Methods */}
            <ChartCard title="Communication Methods" icon={MessageSquare}>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={visitsByCommunication}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    paddingAngle={2}
                  >
                    {visitsByCommunication.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          COMMUNICATION_COLORS[
                            entry.name.toLowerCase() as CommunicationKey
                          ] ||
                          Object.values(COLORS)[
                            index % Object.values(COLORS).length
                          ]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6 border-t border-gray-200 bg-white rounded-lg">
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleString()} • Auto-refresh every 5
            minutes
          </p>
        </div>
      </div>
    </div>
  );
}
