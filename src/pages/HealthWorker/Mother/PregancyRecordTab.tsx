import { axiosInstance } from "@/utils/axiosInstance";
import {
  Activity,
  AlertCircle,
  Baby,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Filter,
  Heart,
  MapPin,
  Phone,
  Search,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

// Types matching your backend data structure
interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface PregnancyRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
  gravity: string;
  parity: number;
  last_menstrual_period: string;
  medical_history: string;
  pregancy_complications: string;
  parent: Patient;
}

// Status determination based on pregnancy stage
const getPregnancyStatus = (lmpDate: string) => {
  const lmp = new Date(lmpDate);
  const now = new Date();
  const weeksDiff = Math.floor(
    (now.getTime() - lmp.getTime()) / (1000 * 60 * 60 * 24 * 7)
  );

  if (weeksDiff < 0) return { status: "Scheduled", weeks: 0 };
  if (weeksDiff > 40) return { status: "Completed", weeks: weeksDiff };
  return { status: "Active", weeks: weeksDiff };
};

// Enhanced Status Badge
const PregnancyStatusBadge = ({ lmpDate }: { lmpDate: string }) => {
  const { status, weeks } = getPregnancyStatus(lmpDate);

  const variants = {
    Completed: {
      icon: CheckCircle,
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-200",
      label: "Delivered",
    },
    Active: {
      icon: Heart,
      bg: "bg-pink-100",
      text: "text-pink-800",
      border: "border-pink-200",
      label: `${weeks} weeks`,
    },
    Scheduled: {
      icon: Clock,
      bg: "bg-blue-100",
      text: "text-blue-800",
      border: "border-blue-200",
      label: "Upcoming",
    },
  };

  const variant = variants[status as keyof typeof variants];
  const IconComponent = variant.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${variant.bg} ${variant.text} ${variant.border}`}
    >
      <IconComponent className="w-3 h-3" />
      {variant.label}
    </span>
  );
};

// Pregnancy Record Card Component
const PregnancyRecordCard = ({ record }: { record: PregnancyRecord }) => {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateDueDate = (lmpDate: string) => {
    const lmp = new Date(lmpDate);
    const dueDate = new Date(lmp);
    dueDate.setDate(dueDate.getDate() + 280); // 40 weeks
    return dueDate;
  };

  const dueDate = calculateDueDate(record.last_menstrual_period);

  return (
    <div className="border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
              <Baby className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {record.parent.firstName} {record.parent.lastName}
              </h3>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Created: {formatDate(record.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {record.gravity}
                </span>
              </div>
            </div>
          </div>
          <PregnancyStatusBadge lmpDate={record.last_menstrual_period} />
        </div>

        {/* Key Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Last Menstrual Period
              </span>
            </div>
            <p className="text-sm text-blue-800">
              {formatDate(record.last_menstrual_period)}
            </p>
          </div>

          <div className="bg-pink-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Heart className="w-4 h-4 text-pink-600" />
              <span className="text-sm font-medium text-pink-900">
                Expected Due Date
              </span>
            </div>
            <p className="text-sm text-pink-800">
              {formatDate(dueDate.toISOString())}
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">Parity</span>
            </div>
            <p className="text-sm text-green-800">
              {record.parity} previous births
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Phone:</span>
            <span className="font-medium text-gray-900">
              {record.parent.phone}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Email:</span>
            <span className="font-medium text-gray-900">
              {record.parent.email}
            </span>
          </div>
        </div>

        {/* Expand/Collapse Button */}
        <div className="border-t border-gray-100 pt-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            <Eye className="w-4 h-4" />
            {expanded ? "Hide" : "View"} Medical Details
          </button>
        </div>
      </div>

      {/* Expanded Medical Details */}
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Medical History
                </h4>
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <p className="text-sm text-gray-700">
                    {record.medical_history}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Pregnancy Complications
                </h4>
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <p className="text-sm text-gray-700">
                    {record.pregancy_complications}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Record ID: {record.id}</span>
              <span>Last updated: {formatDateTime(record.updatedAt)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced Loading Component
const LoadingCard = () => (
  <div className="border border-gray-200 rounded-xl bg-white p-6 animate-pulse">
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="h-16 bg-gray-200 rounded-lg"></div>
        <div className="h-16 bg-gray-200 rounded-lg"></div>
        <div className="h-16 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  </div>
);

// Enhanced Error Component
const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="text-center py-12">
    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <AlertCircle className="w-8 h-8 text-red-600" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      Failed to load pregnancy records
    </h3>
    <p className="text-gray-600 mb-6 max-w-md mx-auto">
      There was an error fetching the pregnancy records. Please check your
      connection and try again.
    </p>
    <button
      onClick={onRetry}
      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
    >
      Try Again
    </button>
  </div>
);

// Enhanced Empty State
const EmptyState = () => (
  <div className="text-center py-16">
    <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <Baby className="w-10 h-10 text-pink-600" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      No pregnancy records found
    </h3>
    <p className="text-gray-600 max-w-md mx-auto">
      There are no pregnancy records available for this patient yet. Records
      will appear here once they are created.
    </p>
  </div>
);

// Search and Filter Bar
const SearchFilterBar = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}) => (
  <div className="flex flex-col sm:flex-row gap-4 mb-6">
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        placeholder="Search by patient name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      />
    </div>
    <div className="flex items-center gap-2">
      <Filter className="w-4 h-4 text-gray-400" />
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      >
        <option value="">All Records</option>
        <option value="Active">Active Pregnancies</option>
        <option value="Completed">Completed</option>
        <option value="Scheduled">Upcoming</option>
      </select>
    </div>
  </div>
);

// Main Component
export const PregnancyRecordTab = ({
  patientId,
}: {
  patientId: string | undefined;
}) => {
  const [pregnancyRecords, setPregnancyRecords] = useState<PregnancyRecord[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchPregnancyRecords = async () => {
    if (!patientId) {
      setError("Patient ID is required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(
        `/api/pregnancy-records/parent/${patientId}`
      );
      setPregnancyRecords(response.data);
    } catch (err: any) {
      setError("Failed to fetch pregnancy records");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPregnancyRecords();
  }, [patientId]);

  // Filter records based on search term and status
  const filteredRecords = pregnancyRecords.filter((record) => {
    const matchesSearch =
      searchTerm === "" ||
      `${record.parent.firstName} ${record.parent.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "" ||
      getPregnancyStatus(record.last_menstrual_period).status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Pregnancy Records
        </h1>
        <p className="text-gray-600 text-lg">
          Comprehensive pregnancy history and medical records
        </p>
      </div>

      {/* Search and Filter */}
      {!loading && !error && pregnancyRecords.length > 0 && (
        <SearchFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
      )}

      {/* Loading State */}
      {loading && (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && <ErrorState onRetry={fetchPregnancyRecords} />}

      {/* Empty State */}
      {!loading && !error && pregnancyRecords.length === 0 && <EmptyState />}

      {/* Records List */}
      {!loading && !error && pregnancyRecords.length > 0 && (
        <>
          {filteredRecords.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No records match your search
              </h3>
              <p className="text-gray-600">
                Try adjusting your search terms or filters
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredRecords
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((record) => (
                  <PregnancyRecordCard key={record.id} record={record} />
                ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
