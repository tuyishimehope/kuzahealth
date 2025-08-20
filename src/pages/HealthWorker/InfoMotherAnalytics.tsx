import React, { useMemo } from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { LoaderCircle, Users, Baby, TrendingUp, Heart, Calendar, Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axiosInstance";
import type { Patient } from "./Mother/ViewPatient";
import type { Child } from "./infants/ViewInfants";

// Colors
const GENDER_COLORS: Record<string, string> = { Male: "#3b82f6", Female: "#ec4899" };
const BLOOD_COLORS = ["#3b82f6","#10b981","#f59e0b","#ef4444","#06b6d4","#8b5cf6","#ec4899","#6366f1"];
const BLOOD_GROUPS = ["A+","A-","B+","B-","O+","O-","AB+","AB-"];

// Tooltip component
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

// Stat card
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

// Chart card
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

  // Stats
  const totalMothers = mothers.length;
  const totalInfants = infants.length;
  const averageInfantsPerMother = totalMothers ? (totalInfants / totalMothers).toFixed(1) : 0;

  // Memoized charts data
  const genderDist = useMemo(() => [
    { name: "Male", value: infants.filter(i => i.gender === "male").length },
    { name: "Female", value: infants.filter(i => i.gender === "female").length },
  ], [infants]);

  const bloodGroupDist = useMemo(() =>
    BLOOD_GROUPS.map((g, i) => ({
      name: g,
      value: infants.filter(i => i.bloodGroup === g).length,
      color: BLOOD_COLORS[i]
    })).filter(g => g.value > 0)
  , [infants]);

  const birthTrendData = useMemo(() => {
    if (!infants.length) {
      // Dummy data if no infants
      return [
        { name: "Jan 2025", value: 5, avg: 1.2 },
        { name: "Feb 2025", value: 8, avg: 1.5 },
        { name: "Mar 2025", value: 6, avg: 1.3 },
        { name: "Apr 2025", value: 9, avg: 1.6 },
        { name: "May 2025", value: 4, avg: 1.1 },
      ];
    }
    const counts: Record<string, number> = {};
    infants.forEach(child => {
      if (!child.dateOfBirth) return;
      const month = new Date(child.dateOfBirth).toLocaleString("default", { month: "short", year: "numeric" });
      counts[month] = (counts[month] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value, avg: value / totalMothers }))
      .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
  }, [infants, totalMothers]);

  if (loading) return <LoaderCircle className="animate-spin h-16 w-16 text-blue-500" />;

  return (
    <div className="p-4">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={Users} title="Total Mothers" value={totalMothers} color="from-blue-500 to-blue-600" trend="+12%" />
        <StatCard icon={Baby} title="Total Infants" value={totalInfants} color="from-green-500 to-emerald-600" trend="+18%" />
        <StatCard icon={Activity} title="Avg. per Mother" value={averageInfantsPerMother} color="from-purple-500 to-purple-600" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard title="Gender Distribution" icon={Heart}>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={genderDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40} paddingAngle={5}>
                {genderDist.map(e => <Cell key={e.name} fill={GENDER_COLORS[e.name]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Blood Group Distribution" icon={Heart}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={bloodGroupDist} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {bloodGroupDist.map(entry => <Cell key={entry.name} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Birth Trends Over Time" icon={Calendar}>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={birthTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 12 }} />
            <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8, fill: "#ffffff", stroke: "#10b981", strokeWidth: 2 }} />
            <Line type="monotone" dataKey="avg" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

export default InfantMotherAnalytics;
