import { Card, CardContent } from "@/components/ui/card";
import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, MessageSquare, Users } from "lucide-react";
import type { FC, ReactNode } from "react";
import {
  Area,
  AreaChart,
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
import ErrorState from "./ErrorState";
import LoadingSpinner from "./LoadingSpinner";
import type { Schedule } from "./Schedule/ViewSchedule";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#8b5cf6",
  "#ec4899",
  "#6366f1",
];

const COMMUNICATION_COLORS: Record<string, string> = {
  phone: "#3b82f6",
  email: "#10b981",
  video: "#8b5cf6",
  "in-person": "#06b6d4",
  sms: "#f59e0b",
};

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
  <Card className={`transition-all duration-300 hover:shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 ${className}`}>
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        {actions && <div className="flex items-center space-x-2">{actions}</div>}
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
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-sm text-gray-600">
            {entry.name}: <span className="font-semibold">{entry.value}</span>
          </span>
        </div>
      ))}
    </div>
  );
};

export default function VisitAnalytics() {
  const { data: visits = [], isLoading, isError, refetch } = useQuery<Schedule[]>({
    queryKey: ["visits"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/api/visits");
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  // Hardcoded fallback data if no API data
  const fallbackVisits: Schedule[] = [
    { scheduledTime: new Date().toISOString(), visitType: "Routine", status: "completed", modeOfCommunication: "phone" } as any,
    { scheduledTime: new Date().toISOString(), visitType: "Follow-up", status: "scheduled", modeOfCommunication: "email" } as any,
    { scheduledTime: new Date().toISOString(), visitType: "Emergency", status: "completed", modeOfCommunication: "in-person" } as any,
    { scheduledTime: new Date().toISOString(), visitType: "Routine", status: "cancelled", modeOfCommunication: "video" } as any,
  ];

  const chartVisits = visits.length ? visits : fallbackVisits;

  const processData = (groupBy: "month" | "type" | "status" | "communication") => {
    const grouped = chartVisits.reduce<Record<string, number>>((acc, visit) => {
      let key = "";
      switch (groupBy) {
        case "month":
          { const date = new Date(visit.scheduledTime);
          key = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`;
          break; }
        case "type":
          key = visit.visitType || "Unknown";
          break;
        case "status":
          key = visit.status || "Unknown";
          break;
        case "communication":
          key = visit.modeOfCommunication || "N/A";
          break;
      }
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  };

  const visitsByMonth = processData("month");
  const visitsByType = processData("type");
  const visitsByCommunication = processData("communication");

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorState error="Failed to load visit data" onRetry={refetch} />;

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="grid gap-6 mb-8">
        {/* Area chart: Visit Trends */}
        <ChartCard title="Visit Trends Over Time" icon={BarChart3}>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={visitsByMonth}>
              <defs>
                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" stroke={COLORS[0]} strokeWidth={2} fill="url(#colorVisits)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Pie chart: Visit Types */}
          <ChartCard title="Visit Types" icon={Users}>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={visitsByType} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={2}>
                  {visitsByType.map((entry, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Pie chart: Communication Methods */}
          <ChartCard title="Communication Methods" icon={MessageSquare}>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={visitsByCommunication} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={2}>
                  {visitsByCommunication.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={COMMUNICATION_COLORS[entry.name.toLowerCase()] || COLORS[i % COLORS.length]}
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
