import { Building, Mail, Phone, Save, Upload, User } from "lucide-react";
import { useState } from "react";

const Profile = () => {
  const [profile, setProfile] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@healthcare.org",
    phone: "+1 (555) 123-4567",
    role: "System Administrator",
    department: "Health Services",
    bio: "Healthcare system administrator managing operations and analytics.",
  });

  const [activeTab, setActiveTab] = useState("profile");
  const [hasChanges, setHasChanges] = useState(false);

  // Mock save function
  const handleSave = () => {
    setHasChanges(false);
    // Simulate API call
    setTimeout(() => {
      alert("Settings saved successfully!");
    }, 500);
  };

  const handleInputChange = (
    section: string,
    field: string,
    value: string | boolean
  ) => {
    setHasChanges(true);
    switch (section) {
      case "profile":
        setProfile((prev) => ({ ...prev, [field]: value }));
        break;
    }
  };

  const tabs = [{ id: "profile", name: "Profile", icon: User }];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-1">
                Manage your preferences and system configuration
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
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
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
            <div className="bg-white rounded-lg shadow-sm">
              {/* Profile Settings */}
              {activeTab === "profile" && (
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <User className="w-6 h-6 text-violet-600" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Profile Settings
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center">
                        <User className="w-10 h-10 text-violet-600" />
                      </div>
                      <div className="space-y-2">
                        <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                          <Upload className="w-4 h-4" />
                          <span>Upload Photo</span>
                        </button>
                        <p className="text-sm text-gray-500">
                          JPG, PNG up to 5MB
                        </p>
                      </div>
                    </div>

                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={profile.firstName}
                          onChange={(e) =>
                            handleInputChange(
                              "profile",
                              "firstName",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={profile.lastName}
                          onChange={(e) =>
                            handleInputChange(
                              "profile",
                              "lastName",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            value={profile.email}
                            onChange={(e) =>
                              handleInputChange(
                                "profile",
                                "email",
                                e.target.value
                              )
                            }
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            value={profile.phone}
                            onChange={(e) =>
                              handleInputChange(
                                "profile",
                                "phone",
                                e.target.value
                              )
                            }
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Role
                        </label>
                        <select
                          value={profile.role}
                          onChange={(e) =>
                            handleInputChange("profile", "role", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        >
                          <option value="System Administrator">
                            System Administrator
                          </option>
                          <option value="Health Services Manager">
                            Health Services Manager
                          </option>
                          <option value="Regional Supervisor">
                            Regional Supervisor
                          </option>
                          <option value="Data Analyst">Data Analyst</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Department
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={profile.department}
                            onChange={(e) =>
                              handleInputChange(
                                "profile",
                                "department",
                                e.target.value
                              )
                            }
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={profile.bio}
                        onChange={(e) =>
                          handleInputChange("profile", "bio", e.target.value)
                        }
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
