import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Mail,
  Phone,
  Save,
  User
} from "lucide-react";
import { useState } from "react";

// Skeleton Loader
const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// API Calls
const fetchProfile = async () => {
  const { data } = await axiosInstance.get("/api/v1/auth/profile");
  return data;
};

const updateProfile = async (profile: any) => {
  const { data } = await axiosInstance.put("/api/v1/auth/profile", profile);
  return data;
};

const Profile = () => {
  const queryClient = useQueryClient();

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      alert("Profile updated successfully!");
    },
  });

  const [localProfile, setLocalProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [hasChanges, setHasChanges] = useState(false);

  // Sync local state once when profile is loaded
  if (profile && !localProfile) {
    setLocalProfile(profile);
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setHasChanges(true);
    setLocalProfile((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (localProfile) {
      mutation.mutate(localProfile);
      setHasChanges(false);
    }
  };

  const tabs = [{ id: "profile", name: "Profile", icon: User }];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">
              Manage your preferences and profile information
            </p>
          </div>
          {hasChanges && (
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="space-y-1 bg-white rounded-lg shadow-sm p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-violet-50 text-violet-700 border-r-2 border-violet-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {isLoading && (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-3/4" />
                  <Skeleton className="h-10 w-2/3" />
                  <Skeleton className="h-24 w-full" />
                </div>
              )}

              {isError && (
                <p className="text-red-600">Failed to load profile data.</p>
              )}

              {!isLoading && localProfile && activeTab === "profile" && (
                <>
                  <div className="flex items-center space-x-3 mb-6">
                    <User className="w-6 h-6 text-violet-600" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Profile Settings
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <InputField
                      label="First Name"
                      value={localProfile.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                    />

                    {/* Last Name */}
                    <InputField
                      label="Last Name"
                      value={localProfile.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                    />

                    {/* Username */}
                    <InputField
                      label="Username"
                      value={localProfile.username}
                      onChange={(e) =>
                        handleInputChange("username", e.target.value)
                      }
                    />

                    {/* Email */}
                    <InputField
                      label="Email"
                      type="email"
                      icon={<Mail className="w-5 h-5 text-gray-400" />}
                      value={localProfile.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                    />

                    {/* Phone */}
                    <InputField
                      label="Phone Number"
                      type="tel"
                      icon={<Phone className="w-5 h-5 text-gray-400" />}
                      value={localProfile.phoneNumber}
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                    />

                    {/* Role */}
                    <SelectField
                      label="Role"
                      value={localProfile.role}
                      onChange={(e) =>
                        handleInputChange("role", e.target.value)
                      }
                      options={[
                        "HEALTH_WORKER",
                        "DATA_ANALYST",
                        "ADMIN",
                      ]}
                    />

                    {/* Gender */}
                    <SelectField
                      label="Gender"
                      value={localProfile.gender}
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value)
                      }
                      options={["Male", "Female", "Other"]}
                    />

                    {/* Date of Birth */}
                    <InputField
                      label="Date of Birth"
                      type="date"
                      value={localProfile.dateOfBirth}
                      onChange={(e) =>
                        handleInputChange("dateOfBirth", e.target.value)
                      }
                    />

                    {/* Province */}
                    <InputField
                      label="Province"
                      value={localProfile.province}
                      onChange={(e) =>
                        handleInputChange("province", e.target.value)
                      }
                    />

                    {/* District */}
                    <InputField
                      label="District"
                      value={localProfile.district}
                      onChange={(e) =>
                        handleInputChange("district", e.target.value)
                      }
                    />

                    {/* Sector */}
                    <InputField
                      label="Sector"
                      value={localProfile.sector}
                      onChange={(e) =>
                        handleInputChange("sector", e.target.value)
                      }
                    />

                    {/* Position */}
                    <InputField
                      label="Position"
                      value={localProfile.position}
                      onChange={(e) =>
                        handleInputChange("position", e.target.value)
                      }
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Input Component
const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  icon,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  icon?: React.ReactNode;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <div className="relative">
      {icon && <span className="absolute left-3 top-2.5">{icon}</span>}
      <input
        type={type}
        value={value || ""}
        onChange={onChange}
        className={`w-full ${
          icon ? "pl-10" : "pl-3"
        } pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent`}
      />
    </div>
  </div>
);

// Reusable Select Component
const SelectField = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <select
      value={value || ""}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default Profile;
