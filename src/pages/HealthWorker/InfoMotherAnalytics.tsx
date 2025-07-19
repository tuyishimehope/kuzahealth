import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  LoaderCircle,
  Users,
  Baby,
  TrendingUp,
  Heart,
  Calendar,
  Activity,
} from "lucide-react";
import type { Patient } from "./Mother/ViewPatient";
import type { Child } from "./infants/ViewInfants";
import { axiosInstance } from "@/utils/axiosInstance";

interface TrendDataPoint {
  name: string;
  value: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string | number;
  subtitle?: string;
  color: string;
  trend?: string;
}

interface ChartCardProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  className?: string;
}

interface GenderColor {
  Male: string;
  Female: string;
  [key: string]: string; // allows indexing by any string
}

const GENDER_COLORS: GenderColor = {
  Male: "#3b82f6",
  Female: "#ec4899",
};

const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-600">
          Count:{" "}
          <span className="font-semibold text-blue-600">
            {payload[0].value}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  title,
  value,
  subtitle,
  color,
  trend,
}) => (
  <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-gray-50">
    <div
      className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${color}`}
    />
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`p-3 rounded-full bg-gradient-to-r ${color} bg-opacity-10`}
          >
            <Icon
              className="h-6 w-6 text-white"
              style={{ filter: "drop-shadow(0 0 0 #3b82f6)" }}
            />
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
        {trend && (
          <div className="flex items-center text-green-600 text-sm font-medium">
            <TrendingUp className="h-4 w-4 mr-1" />
            {trend}
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  icon: Icon,
  children,
  className = "",
}) => (
  <Card
    className={`transition-all duration-300 hover:shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 ${className}`}
  >
    <CardContent className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Icon className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </CardContent>
  </Card>
);

const InfantMotherAnalytics = () => {
  const [mothers, setMothers] = useState<Patient[]>([]);
  const [infants, setInfants] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [mothersRes, infantsRes] = await Promise.all([
          axiosInstance.get("/api/parents"),
          axiosInstance.get("/api/infants"),
        ]);
        setMothers(mothersRes.data);
        setInfants(infantsRes.data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // ----- COMPUTED ANALYTICS -----
  const totalMothers = mothers.length;
  const totalInfants = infants.length;
  const averageInfantsPerMother = totalMothers
    ? (totalInfants / totalMothers).toFixed(1)
    : 0;

  const genderDist = [
    {
      name: "Male",
      value: infants.filter((i) => i.gender === "male").length,
      percentage: (
        (infants.filter((i) => i.gender === "male").length / totalInfants) *
        100
      ).toFixed(1),
    },
    {
      name: "Female",
      value: infants.filter((i) => i.gender === "female").length,
      percentage: (
        (infants.filter((i) => i.gender === "female").length / totalInfants) *
        100
      ).toFixed(1),
    },
  ];

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const bloodGroupDist = bloodGroups
    .map((group) => ({
      name: group,
      value: infants.filter((i) => i.bloodGroup === group).length,
    }))
    .filter((group) => group.value > 0)
    .sort((a, b) => b.value - a.value);

  const birthTrend = infants.reduce<Record<string, number>>((acc, curr) => {
    if (!curr.dateOfBirth) return acc;
    const month = new Date(curr.dateOfBirth).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    acc[month] = acc[month] ? acc[month] + 1 : 1;
    return acc;
  }, {});

  const birthTrendData: TrendDataPoint[] = Object.entries(birthTrend)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
        <div className="text-center">
          <div className="relative">
            <LoaderCircle className="animate-spin h-16 w-16 text-blue-500 mx-auto" />
            <div className="absolute inset-0 h-16 w-16 border-4 border-blue-200 rounded-full mx-auto"></div>
          </div>
          <p className="mt-4 text-lg font-medium text-gray-700">
            Loading Analytics...
          </p>
          <p className="text-sm text-gray-500">
            Fetching maternal and infant data
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Maternal & Infant Analytics
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comprehensive insights into maternal and infant health data,
            demographics, and trends
          </p>
        </div>

        {/* Key Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Mothers"
            value={totalMothers}
            subtitle="Registered in system"
            color="from-blue-500 to-blue-600"
            trend="+12%"
          />
          <StatCard
            icon={Baby}
            title="Total Infants"
            value={totalInfants}
            subtitle="Born this period"
            color="from-green-500 to-emerald-600"
            trend="+18%"
          />
          <StatCard
            icon={Activity}
            title="Avg. per Mother"
            value={averageInfantsPerMother}
            subtitle="Infants per mother"
            color="from-purple-500 to-purple-600"
            trend={undefined}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gender Distribution */}
          <ChartCard title="Gender Distribution" icon={Heart}>
            <div className="grid grid-cols-2 gap-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={genderDist}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    innerRadius={40}
                    paddingAngle={5}
                  >
                    {genderDist.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={GENDER_COLORS[entry.name]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={
                      <CustomTooltip
                        active={undefined}
                        payload={undefined}
                        label={undefined}
                      />
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col justify-center space-y-3">
                {genderDist.map((entry) => (
                  <div key={entry.name} className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: GENDER_COLORS[entry.name] }}
                    />
                    <div>
                      <p className="font-medium text-gray-900">{entry.name}</p>
                      <p className="text-sm text-gray-500">
                        {entry.value} ({entry.percentage}%)
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>

          {/* Blood Group Distribution */}
          <ChartCard title="Blood Group Distribution" icon={Heart}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={bloodGroupDist}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
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
                <Tooltip
                  content={
                    <CustomTooltip
                      active={undefined}
                      payload={undefined}
                      label={undefined}
                    />
                  }
                />
                <Bar
                  dataKey="value"
                  fill="url(#colorGradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient
                    id="colorGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Birth Trend Chart */}
        <ChartCard
          title="Birth Trends Over Time"
          icon={Calendar}
          className="mb-6"
        >
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={birthTrendData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <Tooltip
                content={
                  <CustomTooltip
                    active={undefined}
                    payload={undefined}
                    label={undefined}
                  />
                }
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                activeDot={{
                  r: 8,
                  stroke: "#10b981",
                  strokeWidth: 2,
                  fill: "#ffffff",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Peak births in{" "}
              {
                birthTrendData.reduce(
                  (max, curr) => (curr.value > max.value ? curr : max),
                  { value: 0, name: "N/A" }
                ).name
              }
            </p>
          </div>
        </ChartCard>

        {/* Footer */}
        <div className="text-center py-6 border-t border-gray-200 bg-white rounded-lg">
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()} • Data refreshed
            every hour
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfantMotherAnalytics;
