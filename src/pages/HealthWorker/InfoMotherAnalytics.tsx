// InfantMotherAnalytics.tsx
import React from "react";
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
import { LoaderCircle, Users, Baby, TrendingUp, Heart, Calendar, Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axiosInstance";
import type { Patient } from "./Mother/ViewPatient";
import type { Child } from "./infants/ViewInfants";

const GENDER_COLORS: Record<string, string> = { Male: "#3b82f6", Female: "#ec4899" };

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-600">
          Count: <span className="font-semibold text-blue-600">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

const StatCard = ({ icon: Icon, title, value, subtitle, color, trend }: any) => (
  <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${color}`} />
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-full bg-gradient-to-r ${color} bg-opacity-10`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">{title}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
        </div>
        {trend && (
          <div className="flex items-center text-green-600 text-sm font-medium">
            <TrendingUp className="h-4 w-4 mr-1" /> {trend}
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

const ChartCard = ({ title, icon: Icon, children, className = "" }: any) => (
  <Card className={`transition-all duration-300 hover:shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 ${className}`}>
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
  const { data: mothers = [], isLoading: mothersLoading } = useQuery<Patient[]>({
    queryKey: ["mothers"],
    queryFn: async () => (await axiosInstance.get("/api/parents")).data,
  });
  const { data: infants = [], isLoading: infantsLoading } = useQuery<Child[]>({
    queryKey: ["infants"],
    queryFn: async () => (await axiosInstance.get("/api/infants")).data,
  });

  const loading = mothersLoading || infantsLoading;
  if (loading) return <LoaderCircle className="animate-spin h-16 w-16 text-blue-500" />;

  const totalMothers = mothers.length;
  const totalInfants = infants.length;
  const averageInfantsPerMother = totalMothers ? (totalInfants / totalMothers).toFixed(1) : 0;

  const genderDist = [
    { name: "Male", value: infants.filter((i) => i.gender === "male").length },
    { name: "Female", value: infants.filter((i) => i.gender === "female").length },
  ];

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const bloodGroupDist = bloodGroups
    .map((g) => ({ name: g, value: infants.filter((i) => i.bloodGroup === g).length }))
    .filter((g) => g.value > 0);

  const birthTrendData = Object.entries(
    infants.reduce<Record<string, number>>((acc, curr) => {
      if (!curr.dateOfBirth) return acc;
      const month = new Date(curr.dateOfBirth).toLocaleString("default", { month: "short", year: "numeric" });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={Users} title="Total Mothers" value={totalMothers} color="from-blue-500 to-blue-600" trend="+12%" />
        <StatCard icon={Baby} title="Total Infants" value={totalInfants} color="from-green-500 to-emerald-600" trend="+18%" />
        <StatCard icon={Activity} title="Avg. per Mother" value={averageInfantsPerMother} color="from-purple-500 to-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard title="Gender Distribution" icon={Heart}>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={genderDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40} paddingAngle={5}>
                {genderDist.map((entry) => (
                  <Cell key={entry.name} fill={GENDER_COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Blood Group Distribution" icon={Heart}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={bloodGroupDist} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Birth Trends Over Time" icon={Calendar} className="mb-6">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={birthTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 12 }} />
            <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8, fill: "#ffffff", stroke: "#10b981", strokeWidth: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

export default InfantMotherAnalytics;
