import { useQuery } from "@tanstack/react-query";
import { Box, Paper, Typography, CircularProgress, Alert } from "@mui/material";
import { BarChart, LineChart, PieChart } from "@mui/x-charts";
import KPICard from "./KPICard";
import { axiosInstance } from "@/utils/axiosInstance";

// -------------------- API --------------------
const fetchHealthWorkers = async () =>
  (await axiosInstance.get("/api/health-workers")).data;
const fetchVisits = async () => (await axiosInstance.get("/api/visits")).data;
const fetchParents = async () => (await axiosInstance.get("/api/parents")).data;
const fetchInfants = async () => (await axiosInstance.get("/api/infants")).data;

// -------------------- Dashboard --------------------
export default function Dashboard() {
  const { data: healthWorkers, isLoading: hwLoading } = useQuery({
    queryKey: ["healthWorkers"],
    queryFn: fetchHealthWorkers,
  });
  const { data: visits, isLoading: visitsLoading } = useQuery({
    queryKey: ["visits"],
    queryFn: fetchVisits,
  });
  const { data: parents, isLoading: parentsLoading } = useQuery({
    queryKey: ["parents"],
    queryFn: fetchParents,
  });
  const { data: infants, isLoading: infantsLoading } = useQuery({
    queryKey: ["infants"],
    queryFn: fetchInfants,
  });

  if (hwLoading || visitsLoading || parentsLoading || infantsLoading)
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

  if (!healthWorkers || !visits || !parents || !infants)
    return (
      <Box p={3}>
        <Alert severity="error">Failed to load dashboard data.</Alert>
      </Box>
    );

  // -------------------- KPI Cards --------------------
  const kpis = [
    { title: "Health Workers", value: healthWorkers.length },
    { title: "Visits", value: visits.length },
    { title: "Parents", value: parents.length },
    { title: "Infants", value: infants.length },
  ];

  // -------------------- Chart Data --------------------
  // Example: Visits by Status Pie
  // const visitStatusData = [
  //   { id: "completed", value: visits.filter((v: any) => v.status === "completed").length, label: "Completed" },
  //   { id: "scheduled", value: visits.filter((v: any) => v.status === "scheduled").length, label: "Scheduled" },
  //   { id: "cancelled", value: visits.filter((v: any) => v.status === "cancelled").length, label: "Cancelled" },
  // ];
  // Mock visit status data
  const visitStatusData = [
    { id: "completed", value: 42, label: "Completed" },
    { id: "scheduled", value: 18, label: "Scheduled" },
    { id: "cancelled", value: 7, label: "Cancelled" },
  ];

  // Example: Health Workers by Specialty
  // Health Workers by Specialty
  const specialtyData = Object.values(
    healthWorkers.reduce((acc: Record<string, number>, hw: any) => {
      acc[hw.specialty] = (acc[hw.specialty] || 0) + 1;
      return acc;
    }, {})
  ).map((count) => ({ label: "Specialty", value: count as number }));

  return (
    <Box p={3} sx={{ backgroundColor: "grey.50", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Healthcare Dashboard
      </Typography>

      {/* KPI Cards */}
      <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mb: 4 }}>
        {kpis.map((kpi) => (
          <Box key={kpi.title} sx={{ flex: "1 1 200px" }}>
            <KPICard title={kpi.title} value={kpi.value} icon={undefined} />
          </Box>
        ))}
      </Box>

      {/* Charts */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        <Paper sx={{ p: 3, flex: "1 1 400px", height: 400 }}>
          <Typography variant="h6" mb={2}>
            Visits by Status
          </Typography>
          <PieChart series={[{ data: visitStatusData }]} height={300} />
        </Paper>

        <Paper sx={{ p: 3, flex: "1 1 400px", height: 400 }}>
          <Typography variant="h6" mb={2}>
            Health Workers by Specialty
          </Typography>
          <BarChart
            dataset={specialtyData.map((d) => ({
              category: d.label,
              count: d.value,
            }))}
            xAxis={[{ scaleType: "band", dataKey: "category" }]}
            series={[{ dataKey: "count", color: "#4caf50" }]}
            height={320}
          />
        </Paper>

        <Paper sx={{ p: 3, flex: "1 1 100%", height: 400 }}>
          <Typography variant="h6" mb={2}>
            Monthly Visits Trend
          </Typography>
          <LineChart
            xAxis={[
              {
                data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                scaleType: "point",
              },
            ]}
            series={[
              { data: [5, 10, 8, 12, 7, 9], label: "Visits", color: "#2196f3" },
            ]}
            height={320}
          />
        </Paper>
      </Box>
    </Box>
  );
}
