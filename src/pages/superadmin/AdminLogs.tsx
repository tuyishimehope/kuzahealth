import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { Terminal } from "lucide-react";
import { useState } from "react";

type LogEntry = {
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "DEBUG";
  message: string;
};

// Fetch function
const fetchLogs = async (): Promise<LogEntry[]> => {
  const res = await axiosInstance.get<string[]>("/api/logging/recent");

  // Convert raw log strings to structured LogEntry objects
  return res.data.map((line) => {
    // Example log:
    // "Completed API request: GET /api/logging/recent | Status: 200 | Time: 46 ms"
    const timestamp = new Date().toLocaleTimeString(); // fallback timestamp
    let level: LogEntry["level"] = "INFO";

    if (line.includes("ERROR")) level = "ERROR";
    else if (line.includes("WARN")) level = "WARN";
    else if (line.includes("DEBUG")) level = "DEBUG";

    return {
      timestamp,
      level,
      message: line,
    };
  });
};

export default function AdminLogs() {
  const [selectedLevel, setSelectedLevel] = useState("ALL");

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["backendLogs"],
    queryFn: fetchLogs,
    refetchInterval: 5000, // auto-refresh every 5s
  });

  const filteredLogs =
    selectedLevel === "ALL"
      ? logs
      : logs.filter((log) => log.level === selectedLevel);

  const levelColors: Record<string, string> = {
    INFO: "text-blue-400",
    WARN: "text-yellow-400",
    ERROR: "text-red-400",
    DEBUG: "text-gray-400",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Terminal className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Backend Logs</h1>
              <p className="text-sm text-gray-600">
                Monitor server-side requests, errors, and runtime events.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {/* <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button> */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            >
              <option value="ALL">All</option>
              <option value="INFO">Info</option>
              <option value="WARN">Warnings</option>
              <option value="ERROR">Errors</option>
              <option value="DEBUG">Debug</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-black text-gray-100 rounded-lg shadow-md p-4 font-mono text-sm h-[600px] overflow-y-auto">
          {isLoading ? (
            <p className="text-gray-400">Loading logs...</p>
          ) : filteredLogs.length === 0 ? (
            <p className="text-gray-500">No logs available.</p>
          ) : (
            filteredLogs.map((log, idx) => (
              <div key={idx} className="mb-2">
                <span className="text-gray-500 mr-2">{log.timestamp}</span>
                <span className={`font-semibold ${levelColors[log.level]} mr-2`}>
                  [{log.level}]
                </span>
                <span>{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
