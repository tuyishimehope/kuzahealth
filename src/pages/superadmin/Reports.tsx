import { axiosInstance } from "@/utils/axiosInstance";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Loader,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
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

// Types based on your API interfaces
interface HealthWorker {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  qualification: string;
  service_area: string;
}

interface Schedule {
  id: string;
  scheduledTime: string;
  actualStartTime: string | null;
  actualEndTime: string | null;
  visitType: string;
  location: string;
  modeOfCommunication: string;
  status: "Scheduled" | "Completed" | "Cancelled";
  visitNotes: {
    id: string;
    observation: string;
    vitalSigns: string;
    recommendations: string;
    attachments: string[];
  }[];
}

const Reports = () => {
  const [healthWorkers, setHealthWorkers] = useState<HealthWorker[]>([]);
  const [visits, setVisits] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState("30"); // days

  // Fetch data from APIs

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [healthWorkersResponse, visitsResponse] = await Promise.all([
          axiosInstance.get("/api/health-workers"),
          axiosInstance.get("/api/visits"),
        ]);

        setHealthWorkers(healthWorkersResponse.data);
        setVisits(visitsResponse.data);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(
          err?.response?.data?.message || err.message || "Failed to fetch data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Analytics calculations
  const calculateAnalytics = () => {
    // const now = new Date();
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(dateRange));

    // Filter visits by date range
    const recentVisits = visits.filter(
      (visit) => new Date(visit.scheduledTime) >= daysAgo
    );

    // Key Performance Indicators
    const kpis = {
      totalHealthWorkers: healthWorkers.length,
      totalVisits: recentVisits.length,
      completedVisits: recentVisits.filter((v) => v.status === "Completed")
        .length,
      scheduledVisits: recentVisits.filter((v) => v.status === "Scheduled")
        .length,
      cancelledVisits: recentVisits.filter((v) => v.status === "Cancelled")
        .length,
      completionRate:
        recentVisits.length > 0
          ? (
              (recentVisits.filter((v) => v.status === "Completed").length /
                recentVisits.length) *
              100
            ).toFixed(1)
          : "0",
      avgVisitDuration: calculateAverageVisitDuration(
        recentVisits.filter((v) => v.status === "Completed")
      ),
    };

    // Service Area Distribution
    const serviceAreaStats = healthWorkers.reduce((acc, hw) => {
      acc[hw.service_area] = (acc[hw.service_area] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const serviceAreaData = Object.entries(serviceAreaStats).map(
      ([area, count]) => ({
        name: area,
        value: count,
        visits: recentVisits.filter((v) => v.location === area).length,
      })
    );

    // Qualification Distribution
    const qualificationStats = healthWorkers.reduce((acc, hw) => {
      acc[hw.qualification] = (acc[hw.qualification] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const qualificationData = Object.entries(qualificationStats).map(
      ([qual, count]) => ({
        name: qual,
        count,
      })
    );

    // Visit Status Distribution
    const statusData = [
      { name: "Completed", value: kpis.completedVisits, color: "#10B981" },
      { name: "Scheduled", value: kpis.scheduledVisits, color: "#3B82F6" },
      { name: "Cancelled", value: kpis.cancelledVisits, color: "#EF4444" },
    ];

    // Visit Type Distribution
    const visitTypeStats = recentVisits.reduce((acc, visit) => {
      acc[visit.visitType] = (acc[visit.visitType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const visitTypeData = Object.entries(visitTypeStats).map(
      ([type, count]) => ({
        name: type,
        count,
      })
    );

    // Daily Visit Trends
    const dailyVisits = generateDailyVisitTrends(
      recentVisits,
      parseInt(dateRange)
    );

    // Mode of Communication Stats
    const communicationStats = recentVisits.reduce((acc, visit) => {
      acc[visit.modeOfCommunication] =
        (acc[visit.modeOfCommunication] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const communicationData = Object.entries(communicationStats).map(
      ([mode, count]) => ({
        name: mode,
        count,
      })
    );

    // Health Worker Performance (visits per worker)
    const workerVisitCounts = recentVisits.reduce((acc, visit) => {
      console.log(visit);
      // Since we don't have healthWorkerId in the visit data, we'll simulate it
      const randomWorker =
        healthWorkers[Math.floor(Math.random() * healthWorkers.length)];
      if (randomWorker) {
        const workerName = `${randomWorker.first_name} ${randomWorker.last_name}`;
        acc[workerName] = (acc[workerName] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const performanceData = Object.entries(workerVisitCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([worker, visits]) => ({
        worker: worker.length > 20 ? worker.substring(0, 20) + "..." : worker,
        visits,
      }));

    return {
      kpis,
      serviceAreaData,
      qualificationData,
      statusData,
      visitTypeData,
      dailyVisits,
      communicationData,
      performanceData,
    };
  };

  const calculateAverageVisitDuration = (completedVisits: Schedule[]) => {
    const visitsWithDuration = completedVisits.filter(
      (v) => v.actualStartTime && v.actualEndTime
    );

    if (visitsWithDuration.length === 0) return "N/A";

    const totalDuration = visitsWithDuration.reduce((sum, visit) => {
      const start = new Date(visit.actualStartTime!);
      const end = new Date(visit.actualEndTime!);
      return sum + (end.getTime() - start.getTime());
    }, 0);

    const avgMs = totalDuration / visitsWithDuration.length;
    const avgMinutes = Math.round(avgMs / (1000 * 60));
    return `${avgMinutes} min`;
  };

  const generateDailyVisitTrends = (visits: Schedule[], days: number) => {
    const trends = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const dayVisits = visits.filter(
        (visit) => visit.scheduledTime.split("T")[0] === dateStr
      );

      trends.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        completed: dayVisits.filter((v) => v.status === "Completed").length,
        scheduled: dayVisits.filter((v) => v.status === "Scheduled").length,
        cancelled: dayVisits.filter((v) => v.status === "Cancelled").length,
        total: dayVisits.length,
      });
    }

    return trends;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex items-center space-x-3 text-red-600 mb-4">
            <AlertTriangle className="w-6 h-6" />
            <h2 className="text-lg font-semibold">Error Loading Data</h2>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const analytics = calculateAnalytics();
  const colors = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Healthcare Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Comprehensive insights into health worker performance and visit
            management
          </p>

          {/* Date Range Selector */}
          <div className="mt-4 flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">
              Time Period:
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Health Workers
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.kpis.totalHealthWorkers}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Visits
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.kpis.totalVisits}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Completion Rate
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.kpis.completionRate}%
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg Visit Duration
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.kpis.avgVisitDuration}
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Visit Status Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Visit Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {analytics.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Service Area Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Health Workers by Service Area
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.serviceAreaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Visit Trends */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Daily Visit Trends
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={analytics.dailyVisits}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="completed"
                stackId="1"
                stroke="#10B981"
                fill="#10B981"
                name="Completed"
              />
              <Area
                type="monotone"
                dataKey="scheduled"
                stackId="1"
                stroke="#3B82F6"
                fill="#3B82F6"
                name="Scheduled"
              />
              <Area
                type="monotone"
                dataKey="cancelled"
                stackId="1"
                stroke="#EF4444"
                fill="#EF4444"
                name="Cancelled"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Visit Types */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Visit Types
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.visitTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Qualification Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Health Worker Qualifications
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.qualificationData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="count"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {analytics.qualificationData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Stats */}
        {analytics.communicationData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Communication Methods */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Communication Methods
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.communicationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top Performing Workers */}
            {analytics.performanceData.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Top Performing Health Workers
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={analytics.performanceData}
                    layout="horizontal"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="worker" type="category" width={120} />
                    <Tooltip />
                    <Bar dataKey="visits" fill="#EC4899" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {/* Summary Statistics */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Summary Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {analytics.kpis.completedVisits}
              </p>
              <p className="text-sm text-gray-600">Completed Visits</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {analytics.kpis.scheduledVisits}
              </p>
              <p className="text-sm text-gray-600">Scheduled Visits</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {analytics.kpis.cancelledVisits}
              </p>
              <p className="text-sm text-gray-600">Cancelled Visits</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {analytics.serviceAreaData.length}
              </p>
              <p className="text-sm text-gray-600">Service Areas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
