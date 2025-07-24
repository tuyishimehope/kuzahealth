import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  AlertCircle,
  CheckCircle,
  XCircle,
  Download,
  Eye,
} from "lucide-react";
import { axiosInstance } from "@/utils/axiosInstance";

// Types
interface VisitNote {
  id: string;
  observation: string;
  vitalSigns: string;
  recommendations: string;
  attachments: string[];
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
  visitNotes: VisitNote[];
}

// Status Badge Component
const StatusBadge = ({ status }: { status: Schedule["status"] }) => {
  const variants = {
    Completed: {
      icon: CheckCircle,
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-200",
    },
    Scheduled: {
      icon: Clock,
      bg: "bg-blue-100",
      text: "text-blue-800",
      border: "border-blue-200",
    },
    Cancelled: {
      icon: XCircle,
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-200",
    },
  };

  const variant = variants[status];
  const IconComponent = variant.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${variant.bg} ${variant.text} ${variant.border}`}
    >
      <IconComponent className="w-3 h-3" />
      {status}
    </span>
  );
};

// Appointment Card Component
const AppointmentCard = ({ appointment }: { appointment: Schedule }) => {
  const [expanded, setExpanded] = useState(false);

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDuration = (start: string, end: string) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diff = Math.round(
      (endTime.getTime() - startTime.getTime()) / (1000 * 60)
    );
    return `${diff} minutes`;
  };

  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {appointment.visitType}
            </h3>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDateTime(appointment.scheduledTime)}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {appointment.location}
              </span>
            </div>
          </div>
          <StatusBadge status={appointment.status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Mode:</span>
            <span className="font-medium">
              {appointment.modeOfCommunication}
            </span>
          </div>

          {appointment.actualStartTime && appointment.actualEndTime && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">
                {getDuration(
                  appointment.actualStartTime,
                  appointment.actualEndTime
                )}
              </span>
            </div>
          )}
        </div>

        {appointment.visitNotes.length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              <Eye className="w-4 h-4" />
              {expanded ? "Hide" : "View"} Visit Notes
            </button>
          </div>
        )}
      </div>

      {expanded && appointment.visitNotes.length > 0 && (
        <div className="border-t border-gray-100 bg-gray-50 p-4">
          {appointment.visitNotes.map((note) => (
            <div key={note.id} className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                  Observations
                </h4>
                <p className="text-sm text-gray-700">{note.observation}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                  Vital Signs
                </h4>
                <p className="text-sm text-gray-700">{note.vitalSigns}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                  Recommendations
                </h4>
                <p className="text-sm text-gray-700">{note.recommendations}</p>
              </div>

              {note.attachments.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    Attachments
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {note.attachments.map((attachment, index) => (
                      <button
                        key={index}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-white border border-gray-200 rounded hover:bg-gray-50"
                      >
                        <Download className="w-3 h-3" />
                        {attachment}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Loading Component
const LoadingCard = () => (
  <div className="border border-gray-200 rounded-lg bg-white p-4 animate-pulse">
    <div className="space-y-3">
      <div className="flex justify-between">
        <div className="h-5 bg-gray-200 rounded w-1/3"></div>
        <div className="h-6 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  </div>
);

// Error Component
const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="text-center py-8">
    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      Failed to load appointments
    </h3>
    <p className="text-gray-600 mb-4">
      There was an error fetching your appointment history.
    </p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      Try Again
    </button>
  </div>
);

// Empty State Component
const EmptyState = () => (
  <div className="text-center py-12">
    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      No appointments found
    </h3>
    <p className="text-gray-600">You don't have any appointment history yet.</p>
  </div>
);

// Main Component
export const AppointmentHistoryTab = ({ patientId }: { patientId: string | undefined}) => {
  const [appointments, setAppointments] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await axiosInstance.get("/api/visits/patient/" + patientId);
      setAppointments(data.data);
    } catch (err) {
      setError("Failed to fetch appointments");
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Appointment History
        </h1>
        <p className="text-gray-600">
          View your past and upcoming appointments
        </p>
      </div>

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      )}

      {error && <ErrorState onRetry={fetchAppointments} />}

      {!loading && !error && appointments.length === 0 && <EmptyState />}

      {!loading && !error && appointments.length > 0 && (
        <div className="space-y-4">
          {appointments
            .sort(
              (a, b) =>
                new Date(b.scheduledTime).getTime() -
                new Date(a.scheduledTime).getTime()
            )
            .map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
        </div>
      )}
    </div>
  );
};
