import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import {
  Activity,
  Award,
  Download,
  Eye,
  MapPin,
  Search,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

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

// Backend API call
const fetchHealthWorkers = async (): Promise<HealthWorker[]> => {
  const res = await axiosInstance.get("/api/health-workers");
  return res.data;
};

const ViewHealthWorkers = () => {
  const [selectedWorker, setSelectedWorker] = useState<HealthWorker | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [qualificationFilter, setQualificationFilter] = useState("");
  const [serviceAreaFilter, setServiceAreaFilter] = useState("");

  // React Query for data fetching
  const {
    data: healthWorkers = [],
    isLoading,
    isError,
    error,
  } = useQuery<HealthWorker[]>({
    queryKey: ["health-workers"],
    queryFn: fetchHealthWorkers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Helper function to handle null/undefined values
  const getDisplayValue = (
    value: string | null | undefined,
    fallback: string = "Not specified"
  ) => {
    return value && value.trim() ? value : fallback;
  };

  // Filtering logic
  const filteredWorkers = useMemo(() => {
    return healthWorkers.filter((worker) => {
      const matchesGlobal =
        !globalFilter ||
        `${getDisplayValue(worker.first_name)} ${getDisplayValue(
          worker.last_name
        )}`
          .toLowerCase()
          .includes(globalFilter.toLowerCase()) ||
        getDisplayValue(worker.email)
          .toLowerCase()
          .includes(globalFilter.toLowerCase()) ||
        getDisplayValue(worker.phone_number).includes(globalFilter);

      const matchesQualification =
        !qualificationFilter ||
        getDisplayValue(worker.qualification) === qualificationFilter;
      const matchesServiceArea =
        !serviceAreaFilter ||
        getDisplayValue(worker.service_area) === serviceAreaFilter;

      return matchesGlobal && matchesQualification && matchesServiceArea;
    });
  }, [healthWorkers, globalFilter, qualificationFilter, serviceAreaFilter]);

  // Get unique values for filters (excluding null/undefined values)
  const uniqueQualifications = [
    ...new Set(
      healthWorkers
        .map((w) => getDisplayValue(w.qualification))
        .filter((q) => q !== "Not specified")
    ),
  ];
  const uniqueServiceAreas = [
    ...new Set(
      healthWorkers
        .map((w) => getDisplayValue(w.service_area))
        .filter((a) => a !== "Not specified")
    ),
  ];

  // Enhanced PDF export
  const handlePDFExport = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;

    // Header
    pdf.setFillColor(124, 58, 237);
    pdf.rect(0, 0, pageWidth, 30, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(20);
    pdf.text("Health Workers Report", 20, 20);

    // Summary stats
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
    const currentY = 45;
    pdf.text(`Total Health Workers: ${healthWorkers.length}`, 20, currentY);
    pdf.text(
      `Unique Qualifications: ${uniqueQualifications.length}`,
      20,
      currentY + 10
    );
    pdf.text(`Service Areas: ${uniqueServiceAreas.length}`, 20, currentY + 20);
    pdf.text(
      `Report Generated: ${new Date().toLocaleDateString()}`,
      20,
      currentY + 30
    );

    // Table
    const tableData = filteredWorkers.map((worker) => [
      `${getDisplayValue(worker.first_name)} ${getDisplayValue(
        worker.last_name
      )}`,
      getDisplayValue(worker.email),
      getDisplayValue(worker.qualification),
      getDisplayValue(worker.service_area),
      getDisplayValue(worker.phone_number),
      worker.createdAt
        ? new Date(worker.createdAt).toLocaleDateString()
        : "Not available",
    ]);

    autoTable(pdf, {
      head: [
        ["Name", "Email", "Qualification", "Service Area", "Phone", "Created"],
      ],
      body: tableData,
      startY: currentY + 45,
      theme: "grid",
      headStyles: {
        fillColor: [124, 58, 237],
        textColor: [255, 255, 255],
      },
      styles: { fontSize: 8 },
    });

    pdf.save("health-workers-report.pdf");
  };

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-semibold">Error loading data</h3>
            <p className="text-red-600">
              {error?.message || "Failed to fetch health workers"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Health Workers Dashboard
              </h1>
              <p className="text-gray-600">
                Manage and analyze health worker data
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handlePDFExport}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Download size={18} />
                Export PDF Report
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Total Workers</p>
                <p className="text-3xl font-bold">
                  {isLoading ? "..." : healthWorkers.length}
                </p>
              </div>
              <Users className="text-purple-200" size={32} />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Qualifications</p>
                <p className="text-3xl font-bold">
                  {isLoading ? "..." : uniqueQualifications.length}
                </p>
              </div>
              <Award className="text-blue-200" size={32} />
            </div>
          </div>

          <div className="bg-gradient-to-r from-violet-500 to-violet-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-violet-100">Service Areas</p>
                <p className="text-3xl font-bold">
                  {isLoading ? "..." : uniqueServiceAreas.length}
                </p>
              </div>
              <MapPin className="text-violet-200" size={32} />
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100">Active Today</p>
                <p className="text-3xl font-bold">
                  {isLoading ? "..." : Math.floor(healthWorkers.length * 0.7)}
                </p>
              </div>
              <Activity className="text-indigo-200" size={32} />
            </div>
          </div>
        </div>

        {/* Charts */}
        {!isLoading && healthWorkers.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">
                  Top Qualifications
                </h4>
                <div className="space-y-2">
                  {Object.entries(
                    healthWorkers.reduce((acc, worker) => {
                      const qual = getDisplayValue(worker.qualification);
                      acc[qual] = (acc[qual] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  )
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([qualification, count]) => (
                      <div
                        key={qualification}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm text-gray-600">
                          {qualification}
                        </span>
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                          {count}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">
                  Service Areas
                </h4>
                <div className="space-y-2">
                  {Object.entries(
                    healthWorkers.reduce((acc, worker) => {
                      const area = getDisplayValue(worker.service_area);
                      acc[area] = (acc[area] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  )
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([area, count]) => (
                      <div
                        key={area}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm text-gray-600">{area}</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          {count}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                />
              </div>
            </div>

            <select
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={qualificationFilter}
              onChange={(e) => setQualificationFilter(e.target.value)}
            >
              <option value="">All Qualifications</option>
              {uniqueQualifications.map((qual) => (
                <option key={qual} value={qual}>
                  {qual}
                </option>
              ))}
            </select>

            <select
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={serviceAreaFilter}
              onChange={(e) => setServiceAreaFilter(e.target.value)}
            >
              <option value="">All Service Areas</option>
              {uniqueServiceAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          {/* Workers Table */}
          <div className="overflow-hidden rounded-xl border border-gray-200">
            {isLoading ? (
              <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">
                        Worker
                      </th>
                      <th className="px-6 py-4 text-left font-semibold">
                        Qualification
                      </th>
                      <th className="px-6 py-4 text-left font-semibold">
                        Service Area
                      </th>
                      <th className="px-6 py-4 text-left font-semibold">
                        Contact
                      </th>
                      <th className="px-6 py-4 text-left font-semibold">
                        Joined
                      </th>
                      <th className="px-6 py-4 text-left font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredWorkers.map((worker, index) => (
                      <tr
                        key={worker.id}
                        className={`${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-purple-50 transition-colors`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {getDisplayValue(worker.first_name)[0] || "U"}
                              {getDisplayValue(worker.last_name)[0] || "N"}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {getDisplayValue(worker.first_name)}{" "}
                                {getDisplayValue(worker.last_name)}
                              </p>
                              <p className="text-sm text-gray-500">
                                {getDisplayValue(worker.email)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                            {getDisplayValue(worker.qualification)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          {getDisplayValue(worker.service_area)}
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          {getDisplayValue(worker.phone_number)}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {worker.createdAt
                            ? new Date(worker.createdAt).toLocaleDateString()
                            : "Not available"}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedWorker(worker);
                              setShowModal(true);
                            }}
                            className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
                          >
                            <Eye size={16} />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {filteredWorkers.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Users className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-500">
                No health workers found matching your criteria
              </p>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && selectedWorker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  Health Worker Details
                </h2>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {getDisplayValue(selectedWorker.first_name)[0] || "U"}
                    {getDisplayValue(selectedWorker.last_name)[0] || "N"}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {getDisplayValue(selectedWorker.first_name)}{" "}
                      {getDisplayValue(selectedWorker.last_name)}
                    </h3>
                    <p className="text-gray-600">
                      {getDisplayValue(selectedWorker.qualification)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Email
                      </label>
                      <p className="text-gray-900">
                        {getDisplayValue(selectedWorker.email)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Phone Number
                      </label>
                      <p className="text-gray-900">
                        {getDisplayValue(selectedWorker.phone_number)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Service Area
                      </label>
                      <p className="text-gray-900">
                        {getDisplayValue(selectedWorker.service_area)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Created At
                      </label>
                      <p className="text-gray-900">
                        {selectedWorker.createdAt
                          ? new Date(
                              selectedWorker.createdAt
                            ).toLocaleDateString()
                          : "Not available"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Last Updated
                      </label>
                      <p className="text-gray-900">
                        {selectedWorker.updatedAt
                          ? new Date(
                              selectedWorker.updatedAt
                            ).toLocaleDateString()
                          : "Not available"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewHealthWorkers;
