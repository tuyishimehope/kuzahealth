import { axiosInstance } from "@/utils/axiosInstance";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import ScheduleIcon from "@mui/icons-material/Schedule";
import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Typography
} from "@mui/material";
import {
  BarChart,
  Gauge,
  LineChart,
  PieChart,
  ScatterChart,
} from "@mui/x-charts";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";
import KPICard from "./KpiCard";

// Data types
interface HealthWorker {
  id: string;
  name: string;
  specialty: string;
  status: "active" | "inactive";
  workload: number;
  performance_score: number;
  hire_date: string;
}

interface Visit {
  id: string;
  patient_id: string;
  health_worker_id: string;
  date: string;
  status: "scheduled" | "completed" | "cancelled" | "no_show";
  priority: "low" | "medium" | "high" | "urgent";
  duration_minutes: number;
  satisfaction_score?: number;
}

// API fetchers
const fetchHealthWorkers = async (): Promise<HealthWorker[]> => {
  const res = await axiosInstance.get("/api/health-workers");
  return res.data;
};

const fetchVisits = async (): Promise<Visit[]> => {
  const res = await axiosInstance.get("/api/visits");
  return res.data;
};

// Utils
const calculateTrend = (data: number[]): { value: number; isUp: boolean } => {
  if (data.length < 2) return { value: 0, isUp: true };
  const recent = data.slice(-3).reduce((a, b) => a + b, 0) / 3;
  const previous = data.slice(-6, -3).reduce((a, b) => a + b, 0) / 3;
  const change = ((recent - previous) / previous) * 100;
  return { value: Math.abs(change), isUp: change >= 0 };
};

const groupByMonth = (visits: Visit[], months: number = 6) => {
  const now = new Date();
  const result: { [key: string]: Visit[] } = {};
  for (let i = months - 1; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = month.toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });
    result[key] = visits.filter((visit) => {
      const visitDate = new Date(visit.date);
      return (
        visitDate.getMonth() === month.getMonth() &&
        visitDate.getFullYear() === month.getFullYear()
      );
    });
  }
  return result;
};
interface KPI {
  title: string;
  value: string | number;
  change?: { value: number; isUp: boolean };
  icon: React.ReactNode;
  color?: "primary" | "success" | "warning" | "error";
}


export default function Dashboard() {
  const {
    data: healthWorkers,
    isLoading: hwLoading,
    error: hwError,
  } = useQuery({ queryKey: ["healthWorkers"], queryFn: fetchHealthWorkers });
  const {
    data: visits,
    isLoading: visitsLoading,
    error: visitsError,
  } = useQuery({ queryKey: ["visits"], queryFn: fetchVisits });

  const analytics = useMemo(() => {
    if (!visits || !healthWorkers) return null;

    const monthlyData = groupByMonth(visits, 6);
    const months = Object.keys(monthlyData);

    const totalVisits = visits.length;
    const completedVisits = visits.filter(
      (v) => v.status === "completed"
    ).length;
    const scheduledVisits = visits.filter(
      (v) => v.status === "scheduled"
    ).length;
    const cancelledVisits = visits.filter(
      (v) => v.status === "cancelled"
    ).length;
    const completionRate =
      totalVisits > 0 ? (completedVisits / totalVisits) * 100 : 0;

    const activeWorkers = healthWorkers.filter(
      (hw) => hw.status === "active"
    ).length;

    const monthlyCompleted = months.map(
      (month) =>
        monthlyData[month].filter((v) => v.status === "completed").length
    );
    const monthlyScheduled = months.map(
      (month) =>
        monthlyData[month].filter((v) => v.status === "scheduled").length
    );
    const monthlyCancelled = months.map(
      (month) =>
        monthlyData[month].filter((v) => v.status === "cancelled").length
    );

    const priorityData = [
      {
        id: "urgent",
        value: visits.filter((v) => v.priority === "urgent").length,
        label: "Urgent",
      },
      {
        id: "high",
        value: visits.filter((v) => v.priority === "high").length,
        label: "High",
      },
      {
        id: "medium",
        value: visits.filter((v) => v.priority === "medium").length,
        label: "Medium",
      },
      {
        id: "low",
        value: visits.filter((v) => v.priority === "low").length,
        label: "Low",
      },
    ];

    const workerPerformance = healthWorkers
      .filter((hw) => hw.status === "active")
      .map((hw) => ({
        id: hw.id,
        name: hw.name.split(" ")[0],
        workload: hw.workload,
        performance: hw.performance_score,
        specialty: hw.specialty,
      }))
      .slice(0, 10);

    const specialtyCount = healthWorkers.reduce((acc, hw) => {
      acc[hw.specialty] = (acc[hw.specialty] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    const specialtyData = Object.entries(specialtyCount).map(
      ([specialty, count]) => ({
        id: specialty,
        value: count,
        label: specialty,
      })
    );

    const satisfactionScores = visits
      .filter((v) => v.status === "completed" && v.satisfaction_score)
      .map((v) => v.satisfaction_score!);
    const avgSatisfaction =
      satisfactionScores.length > 0
        ? satisfactionScores.reduce((a, b) => a + b, 0) /
          satisfactionScores.length
        : 0;

    return {
      totalVisits,
      completedVisits,
      scheduledVisits,
      cancelledVisits,
      completionRate,
      activeWorkers,
      months,
      monthlyCompleted,
      monthlyScheduled,
      monthlyCancelled,
      priorityData,
      workerPerformance,
      specialtyData,
      avgSatisfaction,
      trends: {
        completion: calculateTrend(monthlyCompleted),
        scheduling: calculateTrend(monthlyScheduled),
      },
    };
  }, [visits, healthWorkers]);

  if (hwLoading || visitsLoading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress size={60} />
      </Box>
    );

  if (hwError || visitsError)
    return (
      <Box p={3}>
        <Alert severity="error">
          Failed to load dashboard data. Please try again later.
        </Alert>
      </Box>
    );

  if (!analytics) return null;
  const kpis: KPI[] = [
    {
      title: "Total Visits",
      value: analytics.totalVisits.toLocaleString(),
      change: analytics.trends.completion,
      icon: <EventIcon fontSize="large" />,
      color: "primary",
    },
    {
      title: "Completed Visits",
      value: analytics.completedVisits.toLocaleString(),
      change: analytics.trends.completion,
      icon: <CheckCircleIcon fontSize="large" />,
      color: "success",
    },
    {
      title: "Active Workers",
      value: analytics.activeWorkers,
      icon: <PeopleIcon fontSize="large" />,
      color: "warning",
    },
    {
      title: "Completion Rate",
      value: `${analytics.completionRate.toFixed(1)}%`,
      change: analytics.trends.completion,
      icon: <ScheduleIcon fontSize="large" />,
      color: "success",
    },
  ];
  return (
    <Box p={3} sx={{ backgroundColor: "grey.50", minHeight: "100vh" }}>
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Healthcare Analytics Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Real-time insights into healthcare operations and performance
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {/* KPI Cards */}
        {kpis.map((kpi) => (
          <Box key={kpi.title} sx={{ flex: "1 1 300px" }}>
            <KPICard {...kpi} />
          </Box>
        ))}

        {/* Patient Satisfaction Gauge */}
        <Box sx={{ flex: "1 1 400px" }}>
          <Paper
            sx={{
              p: 3,
              height: "400px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" fontWeight="semibold" mb={2}>
              Patient Satisfaction
            </Typography>
            <Box
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Gauge
                value={analytics.avgSatisfaction}
                startAngle={-90}
                endAngle={90}
                min={0}
                max={10}
                height={200}
                width={300}
                text={`${analytics.avgSatisfaction.toFixed(1)}/10`}
                innerRadius="60%"
                outerRadius="90%"
              />
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              Average satisfaction score from completed visits
            </Typography>
          </Paper>
        </Box>

        {/* Visit Status Pie Chart */}
        <Box sx={{ flex: "1 1 400px" }}>
          <Paper sx={{ p: 3, height: "400px" }}>
            <Typography variant="h6" fontWeight="semibold" mb={2}>
              Visit Status Distribution
            </Typography>
            <PieChart
              series={[
                {
                  data: [
                    {
                      id: "completed",
                      value: analytics.completedVisits,
                      label: "Completed",
                    },
                    {
                      id: "scheduled",
                      value: analytics.scheduledVisits,
                      label: "Scheduled",
                    },
                    {
                      id: "cancelled",
                      value: analytics.cancelledVisits,
                      label: "Cancelled",
                    },
                  ],
                  highlightScope: { fade: "global", highlight: "item" },
                },
              ]}
              height={300}
              slotProps={{
                legend: {
                  direction: "horizontal",
                  position: { vertical: "middle", horizontal: "center" },
                },
              }}
            />
          </Paper>
        </Box>

        {/* Visit Priority Pie Chart */}
        <Box sx={{ flex: "1 1 400px" }}>
          <Paper sx={{ p: 3, height: "400px" }}>
            <Typography variant="h6" fontWeight="semibold" mb={2}>
              Visit Priority Levels
            </Typography>
            <PieChart
              series={[
                {
                  data: analytics.priorityData,
                  innerRadius: 40,
                  outerRadius: 100,
                  paddingAngle: 2,
                  cornerRadius: 4,
                },
              ]}
              height={300}
              colors={["#f44336", "#ff9800", "#2196f3", "#4caf50"]}
              slotProps={{
                legend: {
                  direction: "horizontal",
                  position: { vertical: "middle", horizontal: "center" },
                },
              }}
            />
          </Paper>
        </Box>

        {/* Monthly Visits Trend */}
        <Box sx={{ flex: "1 1 100%" }}>
          <Paper sx={{ p: 3, height: "400px" }}>
            <Typography variant="h6" fontWeight="semibold" mb={2}>
              Monthly Visits Trend
            </Typography>
            <LineChart
              xAxis={[
                {
                  data: analytics.months,
                  scaleType: "point",
                  tickLabelStyle: { fontSize: 12 },
                },
              ]}
              series={[
                {
                  data: analytics.monthlyCompleted,
                  label: "Completed",
                  color: "#4caf50",
                  curve: "monotoneX",
                },
                {
                  data: analytics.monthlyScheduled,
                  label: "Scheduled",
                  color: "#2196f3",
                  curve: "monotoneX",
                },
                {
                  data: analytics.monthlyCancelled,
                  label: "Cancelled",
                  color: "#f44336",
                  curve: "monotoneX",
                },
              ]}
              height={320}
              margin={{ left: 60, right: 60, top: 40, bottom: 60 }}
            />
          </Paper>
        </Box>

        {/* Healthcare Specialties Bar Chart */}
        <Box sx={{ flex: "1 1 100%" }}>
          <Paper sx={{ p: 3, height: "400px" }}>
            <Typography variant="h6" fontWeight="semibold" mb={2}>
              Healthcare Specialties
            </Typography>
            <BarChart
              dataset={analytics.specialtyData.map((item) => ({
                specialty: item.label,
                count: item.value,
              }))}
              xAxis={[
                {
                  scaleType: "band",
                  dataKey: "specialty",
                  tickLabelStyle: { angle: 45, fontSize: 10 },
                },
              ]}
              series={[{ dataKey: "count", color: "#9c27b0" }]}
              height={320}
              margin={{ left: 40, right: 20, top: 20, bottom: 80 }}
            />
          </Paper>
        </Box>

        {/* Worker Performance Scatter Chart */}
        <Box sx={{ flex: "1 1 100%" }}>
          <Paper sx={{ p: 3, height: "500px" }}>
            <Typography variant="h6" fontWeight="semibold" mb={2}>
              Health Worker Performance vs Workload
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Performance score vs current workload for active health workers
            </Typography>
            <ScatterChart
              dataset={analytics.workerPerformance}
              xAxis={[
                {
                  dataKey: "workload",
                  label: "Current Workload",
                  min: 0,
                  max:
                    Math.max(
                      ...analytics.workerPerformance.map((w) => w.workload)
                    ) + 10,
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
                  color: "#00bcd4",
                  datasetKeys: {
                    x: "workload",
                    y: "performance",
                    id: "id", // ensure each worker object has a unique 'id'
                  },
                },
              ]}
              height={400}
              margin={{ left: 80, right: 80, top: 40, bottom: 80 }}
            />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
