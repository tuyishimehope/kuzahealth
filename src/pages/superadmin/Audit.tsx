import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  AlertTriangle,
  Database,
  Download,
  Eye,
  Filter,
  Search,
  Shield,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

export interface audit {
  id: string;
  createdAt: string;
  updatedAt: string;
  action: string;
  email: string;
  entityId: string;
  ip: string;
  resource: string;
  username: string;
}
const fetchLogs = async () => {
  const data = await axiosInstance.get<audit[]>("api/v1/audit/logs");
  return data.data;
};

const Audit = () => {
  const { data, isLoading, error } = useQuery<audit[]>({
    queryKey: ["audit"],
    queryFn: fetchLogs,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("all");
  const [filterResource, setFilterResource] = useState("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState("today");
  const [currentPage, setCurrentPage] = useState(1);
  // Add at the top inside Audit component:
  const itemsPerPage = 6;
  // Filter and search logic
  const filteredData = useMemo(() => {
    if (!data) return [];

    return data.filter((log) => {
      const matchesSearch =
        searchTerm === "" ||
        log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ip.includes(searchTerm);

      const matchesAction =
        filterAction === "all" || log.action === filterAction;

      const matchesResource =
        filterResource === "all" || log.resource.includes(filterResource);

      return matchesSearch && matchesAction && matchesResource;
    });
  }, [data, searchTerm, filterAction, filterResource]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  // Handle page change
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const sampleChartData = [
    { name: "Mon", value: 20 },
    { name: "Tue", value: 45 },
    { name: "Wed", value: 35 },
    { name: "Thu", value: 60 },
    { name: "Fri", value: 50 },
    { name: "Sat", value: 75 },
    { name: "Sun", value: 65 },
  ];

// Statistics calculations
const stats = useMemo(() => {
  if (!data) return { total: 0, actions: {}, resources: 0, users: 0 };

  // Count actions
  const actions = data.reduce<Record<string, number>>((acc, { action }) => {
    acc[action] = (acc[action] ?? 0) + 1;
    return acc;
  }, {});

  // Count unique users
  const users = new Set(data.map(({ username }) => username)).size;

  // Count unique resources
  const resources = new Set(data.map(({ resource }) => resource)).size;

  return {
    total: data.length,
    actions,
    users,
    resources,
  };
}, [data]);


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getActionBadgeColor = (action: string) => {
    const colors = {
      GET: "bg-blue-100 text-blue-800 border-blue-200",
      POST: "bg-green-100 text-green-800 border-green-200",
      PUT: "bg-yellow-100 text-yellow-800 border-yellow-200",
      DELETE: "bg-red-100 text-red-800 border-red-200",
    };
    return (
      colors[action as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading audit logs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-4" />
          <p className="text-red-800 text-center">Failed to load audit logs</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  HIPAA Audit Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Monitor and track all system access events
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total Events */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm border border-gray-200 p-6 relative">
            <div className="flex items-center mb-4">
              <Activity className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Events
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="absolute bottom-2 left-0 w-full h-14 opacity-60">
              <ResponsiveContainer>
                <AreaChart data={sampleChartData}>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#2563eb"
                    fill="#93c5fd"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Active Users */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-sm border border-gray-200 p-6 relative">
            <div className="flex items-center mb-4">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Active Users
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.users}
                </p>
              </div>
            </div>
            <div className="absolute bottom-2 left-0 w-full h-14 opacity-60">
              <ResponsiveContainer>
                <AreaChart data={sampleChartData}>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#16a34a"
                    fill="#86efac"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Resources Accessed */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-sm border border-gray-200 p-6 relative">
            <div className="flex items-center mb-4">
              <Database className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Resources Accessed
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.resources.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="absolute bottom-2 left-0 w-full h-14 opacity-60">
              <ResponsiveContainer>
                <AreaChart data={sampleChartData}>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#9333ea"
                    fill="#c4b5fd"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Read Operations */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-sm border border-gray-200 p-6 relative">
            <div className="flex items-center mb-4">
              <Eye className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Read Operations
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.actions.GET || 0}
                </p>
              </div>
            </div>
            <div className="absolute bottom-2 left-0 w-full h-14 opacity-60">
              <ResponsiveContainer>
                <AreaChart data={sampleChartData}>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#ea580c"
                    fill="#fdba74"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users, resources, IPs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 sm:text-sm transition"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={filterAction}
                  onChange={(e) => setFilterAction(e.target.value)}
                  className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm transition"
                >
                  <option value="all">All Actions</option>
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-gray-500" />
                <select
                  value={filterResource}
                  onChange={(e) => setFilterResource(e.target.value)}
                  className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:text-sm transition"
                >
                  <option value="all">All Resources</option>
                  <option value="patients">Patients</option>
                  <option value="vaccinations">Vaccinations</option>
                  <option value="appointments">Appointments</option>
                  <option value="records">Records</option>
                </select>
              </div>

              {/* Clear Filters */}
              {(filterAction !== "all" ||
                filterResource !== "all" ||
                searchTerm) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterAction("all");
                    setFilterResource("all");
                  }}
                  className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Audit Logs ({filteredData.length} entries)
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resource
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entity ID
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {log.username}
                      </div>
                      <div className="text-sm text-gray-500">{log.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getActionBadgeColor(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                      {log.resource}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {log.ip}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {log.entityId.slice(0, 15)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <Search className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No audit logs found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search criteria or filters.
              </p>
            </div>
          )}
        </div>

        {paginatedData.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6 rounded-lg shadow-sm">
            <div className="hidden sm:flex sm:items-center sm:justify-between w-full">
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, filteredData.length)}
                </span>{" "}
                of <span className="font-medium">{filteredData.length}</span>{" "}
                results
              </p>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                    currentPage === 1
                      ? "text-gray-300 bg-gray-100 cursor-not-allowed"
                      : "text-gray-500 bg-white hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToPage(idx + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                      currentPage === idx + 1
                        ? "bg-blue-50 text-blue-600"
                        : "bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                    currentPage === totalPages
                      ? "text-gray-300 bg-gray-100 cursor-not-allowed"
                      : "text-gray-500 bg-white hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Audit;
