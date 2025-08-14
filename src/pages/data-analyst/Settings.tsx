import {
  Bell,
  Building,
  Calendar,
  Clock,
  Eye,
  EyeOff,
  Globe,
  Mail,
  MapPin,
  Palette,
  Phone,
  Save,
  Settings as SettingsIcon,
  Shield,
  Upload,
  User,
} from "lucide-react";
import { useState } from "react";

const Settings = () => {
  // Profile Settings State
  const [profile, setProfile] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@healthcare.org",
    phone: "+1 (555) 123-4567",
    role: "System Administrator",
    department: "Health Services",
    bio: "Healthcare system administrator managing operations and analytics.",
  });

  // System Preferences State
  const [preferences, setPreferences] = useState({
    theme: "light",
    language: "en",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    currency: "USD",
  });

  // Notification Settings State
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    visitReminders: true,
    reportAlerts: true,
    systemUpdates: false,
    emergencyAlerts: true,
    weeklyReports: true,
  });
  console.log(notifications)

  // Privacy & Security State
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
    loginAlerts: true,
    dataRetention: "365",
    auditLogs: true,
  });

  // System Configuration State
  const [systemConfig, setSystemConfig] = useState({
    defaultVisitDuration: "60",
    autoAssignVisits: true,
    allowCancellations: true,
    requireVisitNotes: true,
    enableGeolocation: true,
    maxFileSize: "10",
  });

  console.log(systemConfig);

  const [showPassword, setShowPassword] = useState(false);
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
      case "preferences":
        setPreferences((prev) => ({ ...prev, [field]: value }));
        break;
      case "notifications":
        setNotifications((prev) => ({ ...prev, [field]: value }));
        break;
      case "security":
        setSecurity((prev) => ({ ...prev, [field]: value }));
        break;
      case "systemConfig":
        setSystemConfig((prev) => ({ ...prev, [field]: value }));
        break;
    }
  };

  const tabs = [
    { id: "profile", name: "Profile", icon: User },
    { id: "preferences", name: "Preferences", icon: Palette },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "security", name: "Security", icon: Shield },
    { id: "system", name: "System", icon: SettingsIcon },
    { id: "areas", name: "Service Areas", icon: MapPin },
  ];

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
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
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
                    <User className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Profile Settings
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-10 h-10 text-blue-600" />
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences */}
              {activeTab === "preferences" && (
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <Palette className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Preferences
                    </h2>
                  </div>

                  <div className="space-y-8">
                    {/* Appearance */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Appearance
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Theme
                          </label>
                          <div className="flex space-x-4">
                            {["light", "dark", "system"].map((theme) => (
                              <label
                                key={theme}
                                className="flex items-center space-x-2"
                              >
                                <input
                                  type="radio"
                                  value={theme}
                                  checked={preferences.theme === theme}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "preferences",
                                      "theme",
                                      e.target.value
                                    )
                                  }
                                  className="text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700 capitalize">
                                  {theme}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Localization */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Localization
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Language
                          </label>
                          <div className="relative">
                            <Globe className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <select
                              value={preferences.language}
                              onChange={(e) =>
                                handleInputChange(
                                  "preferences",
                                  "language",
                                  e.target.value
                                )
                              }
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="en">English</option>
                              <option value="es">Spanish</option>
                              <option value="fr">French</option>
                              <option value="de">German</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Timezone
                          </label>
                          <div className="relative">
                            <Clock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <select
                              value={preferences.timezone}
                              onChange={(e) =>
                                handleInputChange(
                                  "preferences",
                                  "timezone",
                                  e.target.value
                                )
                              }
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="America/New_York">
                                Eastern Time
                              </option>
                              <option value="America/Chicago">
                                Central Time
                              </option>
                              <option value="America/Denver">
                                Mountain Time
                              </option>
                              <option value="America/Los_Angeles">
                                Pacific Time
                              </option>
                              <option value="UTC">UTC</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date Format
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <select
                              value={preferences.dateFormat}
                              onChange={(e) =>
                                handleInputChange(
                                  "preferences",
                                  "dateFormat",
                                  e.target.value
                                )
                              }
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Time Format
                          </label>
                          <div className="flex space-x-4">
                            {["12h", "24h"].map((format) => (
                              <label
                                key={format}
                                className="flex items-center space-x-2"
                              >
                                <input
                                  type="radio"
                                  value={format}
                                  checked={preferences.timeFormat === format}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "preferences",
                                      "timeFormat",
                                      e.target.value
                                    )
                                  }
                                  className="text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">
                                  {format === "12h" ? "12 Hour" : "24 Hour"}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeTab === "notifications" && (
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <Bell className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Notification Settings
                    </h2>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Delivery Methods
                      </h3>
                      <div className="space-y-4">
                        {[
                          {
                            key: "emailNotifications",
                            label: "Email Notifications",
                            desc: "Receive notifications via email",
                          },
                          {
                            key: "smsNotifications",
                            label: "SMS Notifications",
                            desc: "Receive notifications via text message",
                          },
                          {
                            key: "pushNotifications",
                            label: "Push Notifications",
                            desc: "Receive browser push notifications",
                          },
                        ].map(({ key, label, desc }) => (
                          <div
                            key={key}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">
                                {label}
                              </h4>
                              <p className="text-sm text-gray-500">{desc}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={(e) =>
                                  handleInputChange(
                                    "notifications",
                                    key,
                                    e.target.checked
                                  )
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Notification Types
                      </h3>
                      <div className="space-y-4">
                        {[
                          {
                            key: "visitReminders",
                            label: "Visit Reminders",
                            desc: "Upcoming visit notifications",
                          },
                          {
                            key: "reportAlerts",
                            label: "Report Alerts",
                            desc: "Important report updates",
                          },
                          {
                            key: "systemUpdates",
                            label: "System Updates",
                            desc: "System maintenance and updates",
                          },
                          {
                            key: "emergencyAlerts",
                            label: "Emergency Alerts",
                            desc: "Critical system alerts",
                          },
                          {
                            key: "weeklyReports",
                            label: "Weekly Reports",
                            desc: "Weekly performance summaries",
                          },
                        ].map(({ key, label, desc }) => (
                          <div
                            key={key}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                          >
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">
                                {label}
                              </h4>
                              <p className="text-sm text-gray-500">{desc}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                onChange={(e) =>
                                  handleInputChange(
                                    "notifications",
                                    key,
                                    e.target.checked
                                  )
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security */}
              {activeTab === "security" && (
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <Shield className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Security & Privacy
                    </h2>
                  </div>

                  <div className="space-y-8">
                    {/* Authentication */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Authentication
                      </h3>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              Two-Factor Authentication
                            </h4>
                            <p className="text-sm text-gray-500">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={security.twoFactorAuth}
                              onChange={(e) =>
                                handleInputChange(
                                  "security",
                                  "twoFactorAuth",
                                  e.target.checked
                                )
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Change Password
                          </label>
                          <div className="space-y-4">
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Current password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                              >
                                {showPassword ? (
                                  <EyeOff className="w-5 h-5" />
                                ) : (
                                  <Eye className="w-5 h-5" />
                                )}
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <input
                                type={showPassword ? "text" : "password"}
                                placeholder="New password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Confirm new password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                              Update Password
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Session Management */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Session Management
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Session Timeout (minutes)
                          </label>
                          <select
                            value={security.sessionTimeout}
                            onChange={(e) =>
                              handleInputChange(
                                "security",
                                "sessionTimeout",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent max-w-xs"
                          >
                            <option value="15">15 minutes</option>
                            <option value="30">30 minutes</option>
                            <option value="60">1 hour</option>
                            <option value="120">2 hours</option>
                            <option value="0">No timeout</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              Login Alerts
                            </h4>
                            <p className="text-sm text-gray-500">
                              Get notified of new login attempts
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={security.loginAlerts}
                              onChange={(e) =>
                                handleInputChange(
                                  "security",
                                  "loginAlerts",
                                  e.target.checked
                                )
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
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

export default Settings;
