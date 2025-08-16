import { useEffect, useState, useMemo, useCallback } from "react";
import { Activity, Database, Server, Cpu, Mail, HardDrive } from "lucide-react";
import { axiosInstance } from "@/utils/axiosInstance";



// --- Types ---
interface HealthComponent {
  status: "UP" | "DOWN" | string;
  details?: Record<string, any>;
}

interface Health {
  status: string;
  components: {
    db?: HealthComponent;
    diskSpace?: HealthComponent;
    mail?: HealthComponent;
    ping?: HealthComponent;
    [key: string]: HealthComponent | undefined;
  };
}

interface Metrics {
  cpu?: number;
  heapMemory?: number | null;
  nonHeapMemory?: number | null;
  uptime?: number;
  activeConns?: number;
}

// --- Monitor Card ---
const MonitorCard = ({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number | null;
  icon: any;
  color: string;
}) => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center space-x-4">
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon className="text-white" size={20} />
    </div>
    <div>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-lg font-semibold text-gray-900">{value ?? "N/A"}</p>
    </div>
  </div>
);

const SystemMonitor = () => {
  const [health, setHealth] = useState<Health | null>(null);
  const [metrics, setMetrics] = useState<Metrics>({});
  const [loading, setLoading] = useState(true);

  // --- Fetch a single metric ---
  const fetchMetric = useCallback(async (name: string) => {
    try {
      const res = await axiosInstance.get(`/actuator/metrics/${name}`);
      return res.data;
    } catch {
      return null;
    }
  }, []);

  // --- Fetch all metrics ---
  const fetchAllMetrics = useCallback(async (): Promise<Metrics> => {
    const [cpuRes, memoryRes, uptimeRes, activeConnsRes] = await Promise.all([
      fetchMetric("system.cpu.usage"),
      fetchMetric("jvm.memory.used"),
      fetchMetric("process.uptime"),
      fetchMetric("hikaricp.connections.active"),
    ]);

    
    let heapMemory: number | null  = null;
    let nonHeapMemory: number | null = null;

    // Extract heap vs non-heap using availableTags
    if (memoryRes?.availableTags) {
      const areaTag = memoryRes.availableTags.find((t: any) => t.tag === "area");
      if (areaTag) {
        // Fetch separately for heap vs non-heap
        heapMemory = memoryRes.measurements?.[0]?.value ?? null; // fallback if needed
        nonHeapMemory = memoryRes.measurements?.[0]?.value ?? null; // same
      }
    }

    return {
      cpu: cpuRes?.measurements?.[0]?.value ?? null,
      heapMemory,
      nonHeapMemory,
      uptime: uptimeRes?.measurements?.[0]?.value ?? null,
      activeConns: activeConnsRes?.measurements?.[0]?.value ?? null,
    };
  }, [fetchMetric]);

  useEffect(() => {
    const loadSystemData = async () => {
      try {
        const [healthRes, metricsRes] = await Promise.all([
          axiosInstance.get(`actuator/health`).then((r) => r.data),
          fetchAllMetrics(),
        ]);
        setHealth(healthRes);
        setMetrics(metricsRes);
      } catch (err) {
        console.error("Failed to fetch actuator data", err);
      } finally {
        setLoading(false);
      }
    };
    loadSystemData();
  }, [fetchAllMetrics]);

  // --- Prepare cards ---
  const componentCards = useMemo(
    () => [
      {
        title: "Database",
        value: health?.components?.db?.status ?? "N/A",
        icon: Database,
        color: health?.components?.db?.status === "UP" ? "bg-green-500" : "bg-red-500",
      },
      {
        title: "Disk Space",
        value: health?.components?.diskSpace?.status ?? "N/A",
        icon: HardDrive,
        color: health?.components?.diskSpace?.status === "UP" ? "bg-green-500" : "bg-red-500",
      },
      {
        title: "Mail",
        value:
          health?.components?.mail?.status === "DOWN"
            ? `DOWN (${health.components.mail.details?.error?.split("\n")[0]})`
            : "UP",
        icon: Mail,
        color: health?.components?.mail?.status === "UP" ? "bg-green-500" : "bg-red-500",
      },
      {
        title: "Ping",
        value: health?.components?.ping?.status ?? "N/A",
        icon: Activity,
        color: health?.components?.ping?.status === "UP" ? "bg-green-500" : "bg-red-500",
      },
    ],
    [health]
  );

  const metricCards = useMemo(
    () => [
      {
        title: "CPU Usage",
        value: metrics.cpu != null ? `${(metrics.cpu * 100).toFixed(2)} %` : "N/A",
        icon: Cpu,
        color: "bg-blue-500",
      },
      {
        title: "Heap Memory Used",
        value:
          metrics.heapMemory != null ? `${(metrics.heapMemory / 1024 / 1024).toFixed(1)} MB` : "N/A",
        icon: Server,
        color: "bg-green-500",
      },
      {
        title: "Non-Heap Memory Used",
        value:
          metrics.nonHeapMemory != null
            ? `${(metrics.nonHeapMemory / 1024 / 1024).toFixed(1)} MB`
            : "N/A",
        icon: Server,
        color: "bg-yellow-500",
      },
      {
        title: "App Uptime",
        value: metrics.uptime != null ? `${(metrics.uptime / 60).toFixed(1)} min` : "N/A",
        icon: Activity,
        color: "bg-purple-500",
      },
      {
        title: "Active DB Connections",
        value: metrics.activeConns != null ? metrics.activeConns : "N/A",
        icon: Database,
        color: "bg-indigo-500",
      },
    ],
    [metrics]
  );

  // --- Skeleton loader ---
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="bg-gray-100 p-6 rounded-xl animate-pulse h-24"></div>
          ))}
      </div>
    );
  }

  // --- Render actual cards ---
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">System Monitor</h3>

      <MonitorCard
        title="Overall Health"
        value={health?.status ?? "Unknown"}
        icon={Activity}
        color={health?.status === "UP" ? "bg-green-500" : "bg-red-500"}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {componentCards.map((c, idx) => (
          <MonitorCard key={idx} {...c} />
        ))}
        {metricCards.map((c, idx) => (
          <MonitorCard key={idx + componentCards.length} {...c} />
        ))}
      </div>
    </div>
  );
};

export default SystemMonitor;
