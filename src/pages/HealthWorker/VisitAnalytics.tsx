import { Card, CardContent } from "@/components/ui/card";
import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  MessageSquare,
  TrendingUp,
  Users,
} from "lucide-react";
import type { FC, ReactNode } from "react";
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
import ErrorState from "./ErrorState";
import LoadingSpinner from "./LoadingSpinner";

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
      className="absolute top-0 left-0 w-full h-1"
      style={{ backgroundColor: color }}
    />
    <CardContent className="p-6 flex justify-between items-center">
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
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
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
  payload?: Array<{ color?: string; name?: string; value?: number | string }>;
  label?: string;
}

const CustomTooltip: FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;
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
};

export default function VisitAnalytics() {
  const {
    data: visits = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<Schedule[]>({
    queryKey: ["visits"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/api/visits");
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const totalVisits = visits.length;
  const completedVisits = visits.filter((v) => v.status === "Completed").length;
  const completionRate = totalVisits
    ? ((completedVisits / totalVisits) * 100).toFixed(1)
    : "0";
  const avgDuration = totalVisits
    ? (
        visits.reduce((sum, v) => sum + (parseInt(v.scheduledTime) || 0), 0) /
        totalVisits
      ).toFixed(0)
    : "0";

  const processData = (
    groupBy: "month" | "type" | "status" | "communication"
  ) =>
    Object.entries(
      visits.reduce<Record<string, number>>((acc, visit) => {
        let key: string;
        switch (groupBy) {
          case "month": {
            const date = new Date(visit.scheduledTime);
            key = `${date.toLocaleString("default", {
              month: "short",
            })} ${date.getFullYear()}`;
            break;
          }
          case "type": {
            key = visit.visitType || "Unknown";
            break;
          }
          case "status": {
            key = visit.status || "Unknown";
            break;
          }
          case "communication": {
            key = visit.modeOfCommunication || "N/A";
            break;
          }
        }

        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
      }, {})
    ).map(([name, value]) => ({ name, value }));

  const visitsByMonth = processData("month");
  const visitsByType = processData("type");
  const visitsByStatus = processData("status");
  const visitsByCommunication = processData("communication");

  if (isLoading) return <LoadingSpinner />;
  if (isError)
    return (
      <ErrorState error="Failed to load visit data" onRetry={() => refetch()} />
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Calendar}
          title="Total Visits"
          value={totalVisits}
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
            visits.filter(
              (v) =>
                new Date(v.scheduledTime).toDateString() ===
                new Date().toDateString()
            ).length
          }
          subtitle="Scheduled today"
          color={COLORS.purple}
          change="+8%"
          trend="up"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 mb-8">
        <ChartCard title="Visit Trends Over Time" icon={BarChart3}>
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                  {visitsByType.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={
                        Object.values(COLORS)[i % Object.values(COLORS).length]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

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
                  {visitsByStatus.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={
                        STATUS_COLORS[
                          entry.name.toLowerCase() as keyof typeof STATUS_COLORS
                        ] || COLORS.primary
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

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
                  {visitsByCommunication.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={
                        COMMUNICATION_COLORS[
                          entry.name.toLowerCase() as keyof typeof COMMUNICATION_COLORS
                        ] ||
                        Object.values(COLORS)[i % Object.values(COLORS).length]
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
    </div>
  );
}
