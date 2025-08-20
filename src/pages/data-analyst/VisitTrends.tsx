import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Activity, RefreshCw } from "lucide-react";
import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

interface Visit {
  id: string;
  scheduledTime: string;
  visitType: string;
  status: "Scheduled" | "Completed" | "Cancelled" | "No Show";
}

interface VisitTrendPoint {
  month: string;
  scheduled: number;
  completed: number;
  cancelled: number;
  noShow: number;
}

function transformVisitsToTrends(visits: Visit[], months: number = 6): VisitTrendPoint[] {
  const now = new Date();
  const result: VisitTrendPoint[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = month.toLocaleDateString("en-US", { month: "short" });

    const filtered = visits.filter((v) => {
      const visitDate = new Date(v.scheduledTime);
      return (
        visitDate.getMonth() === month.getMonth() &&
        visitDate.getFullYear() === month.getFullYear()
      );
    });

    result.push({
      month: monthKey,
      scheduled: filtered.filter((v) => v.status === "Scheduled").length,
      completed: filtered.filter((v) => v.status === "Completed").length,
      cancelled: filtered.filter((v) => v.status === "Cancelled").length,
      noShow: filtered.filter((v) => v.status === "No Show").length,
    });
  }

  return result;
}

function VisitTrendsChart({ data }: { data: VisitTrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="scheduled" stackId="a" fill="#3b82f6" />
        <Bar dataKey="completed" stackId="a" fill="#22c55e" />
        <Bar dataKey="cancelled" stackId="a" fill="#ef4444" />
        <Bar dataKey="noShow" stackId="a" fill="#f59e0b" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function VisitTrends() {
  const { data, isLoading, isError, refetch } = useQuery<Visit[]>({
    queryKey: ["visits"],
    queryFn: async () => {
      const res = await axiosInstance.get("api/visits");
      return res.data;
    },
  });

  const trends = data ? transformVisitsToTrends(data) : [];

  if (isLoading) return <div className="p-4">Loading visit trends...</div>;
  if (isError) return <div className="p-4 text-red-500">Failed to load visit trends</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-md p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" /> Visit Trends
        </h2>
        <button onClick={() => refetch()} className="p-2 rounded-lg hover:bg-gray-100">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <VisitTrendsChart data={trends} />

      <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
        <div className="text-green-600">Completed: {trends.at(-1)?.completed ?? 0}</div>
        <div className="text-red-600">Cancelled: {trends.at(-1)?.cancelled ?? 0}</div>
        <div className="text-blue-600">Scheduled: {trends.at(-1)?.scheduled ?? 0}</div>
        <div className="text-orange-500">No Show: {trends.at(-1)?.noShow ?? 0}</div>
      </div>
    </motion.div>
  );
}