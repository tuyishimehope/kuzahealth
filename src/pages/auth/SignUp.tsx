import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import type { Variants } from "framer-motion";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle2,
  User,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  Users,
} from "lucide-react";
import image from "../../assets/signup.png";

import { axiosInstance } from "@/utils/axiosInstance";
import { Toaster, toast } from "sonner";

// Enhanced Zod schema with better validation
const signUpSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must be less than 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "First name should only contain letters"),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must be less than 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "Last name should only contain letters"),
    dateOfBirth: z
      .string()
      .min(1, "Date of birth is required")
      .refine((date) => {
        const birthDate = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        return age >= 18 && age <= 100;
      }, "You must be between 18 and 100 years old"),
    email: z
      .string()
      .email("Please enter a valid email address")
      .min(1, "Email is required")
      .max(100, "Email must be less than 100 characters"),
    gender: z.string().min(1, "Please select your gender"),
    phoneNumber: z
      .string()
      .min(1, "Phone number is required")
      .regex(
        /^(\+250|0)[0-9]{9}$/,
        "Please enter a valid Rwandan phone number"
      ),
    province: z.string().min(1, "Please select your province"),
    title: z
      .string()
      .min(2, "Title must be at least 2 characters")
      .max(100, "Title must be less than 100 characters"),
    district: z.string().min(1, "Please select your district"),
    sector: z
      .string()
      .min(2, "Sector must be at least 2 characters")
      .max(50, "Sector must be less than 50 characters"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const loadingVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.2 },
  },
};

const SignUp = (): JSX.Element => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formStep, setFormStep] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
  });

  const watchedFields = watch();
  const isFormValid =
    Object.keys(errors).length === 0 &&
    watchedFields.firstName &&
    watchedFields.lastName &&
    watchedFields.email &&
    watchedFields.password &&
    watchedFields.confirmPassword;

  const onSubmit = async (data: SignUpFormData): Promise<void> => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setFormStep("submitting");

    try {
      const username = `${data.firstName}${data.lastName}`
        .toLowerCase()
        .replace(/\s+/g, "");
      const role = "HEALTH_WORKER";

      const payload = {
        ...data,
        username,
        role,
        phoneNumber: data.phoneNumber.startsWith("+250")
          ? data.phoneNumber
          : `+250${data.phoneNumber.replace(/^0/, "")}`,
      };

      console.log("Registration payload:", payload);

      const response = await axiosInstance.post(
        "/api/v1/auth/register",
        payload
      );

      console.log("User registered successfully:", response.data);
      setFormStep("success");

      toast.success("Registration Successful!", {
        description: "Please check your email for verification instructions.",
        duration: 5000,
        icon: <CheckCircle2 className="w-5 h-5" />,
      });

      setTimeout(() => {
        navigate("/auth/signin", {
          state: {
            email: data.email,
            message:
              "Registration successful! Please sign in with your credentials.",
          },
        });
      }, 2000);
    } catch (error: any) {
      setFormStep("error");

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Registration failed. Please try again.";

      console.error("Registration error:", error);

      toast.error("Registration Failed", {
        description:
          typeof errorMessage === "string"
            ? errorMessage
            : "Please check your information and try again.",
        duration: 6000,
        icon: <AlertCircle className="w-5 h-5" />,
      });

      setTimeout(() => setFormStep("idle"), 2000);
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1000);
    }
  };

  const togglePasswordVisibility = (field: "password" | "confirmPassword") => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleBackToSignIn = () => {
    if (isSubmitting) return;
    navigate("/auth/signin");
  };

  // Enhanced options with better data
  const genderOptions = [
    { value: "", label: "Select Gender" },
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
    { value: "OTHER", label: "Other" },
  ];

  const provinceOptions = [
    { value: "", label: "Select Province" },
    { value: "KIGALI", label: "Kigali City" },
    { value: "WESTERN", label: "Western Province" },
    { value: "SOUTHERN", label: "Southern Province" },
    { value: "EASTERN", label: "Eastern Province" },
    { value: "NORTHERN", label: "Northern Province" },
  ];

  const districtOptions = [
    { value: "", label: "Select District" },
    // Eastern Province
    { value: "BUGESERA", label: "Bugesera" },
    { value: "GATSIBO", label: "Gatsibo" },
    { value: "KAYONZA", label: "Kayonza" },
    { value: "KIREHE", label: "Kirehe" },
    { value: "NGOMA", label: "Ngoma" },
    { value: "NYAGATARE", label: "Nyagatare" },
    { value: "RWAMAGANA", label: "Rwamagana" },
    // Kigali City
    { value: "NYARUGENGE", label: "Nyarugenge" },
    { value: "KICUKIRO", label: "Kicukiro" },
    { value: "GASABO", label: "Gasabo" },
    // Southern Province
    { value: "HUYE", label: "Huye" },
    { value: "RUHANGO", label: "Ruhango" },
    { value: "NYAMAGABE", label: "Nyamagabe" },
    { value: "GISAGARA", label: "Gisagara" },
    { value: "MUHANGA", label: "Muhanga" },
    { value: "KAMONYI", label: "Kamonyi" },
    { value: "NYANZA", label: "Nyanza" },
    { value: "NYARUGURU", label: "Nyaruguru" },
    // Western Province
    { value: "KARONGI", label: "Karongi" },
    { value: "NGORORERO", label: "Ngororero" },
    { value: "NYABIHU", label: "Nyabihu" },
    { value: "RUBAVU", label: "Rubavu" },
    { value: "RUSIZI", label: "Rusizi" },
    { value: "RUTSIRO", label: "Rutsiro" },
    { value: "NYAMASHEKE", label: "Nyamasheke" },
    // Northern Province
    { value: "BURERA", label: "Burera" },
    { value: "GAKENKE", label: "Gakenke" },
    { value: "GICUMBI", label: "Gicumbi" },
    { value: "MUSANZE", label: "Musanze" },
    { value: "RULINDO", label: "Rulindo" },
  ];

  const renderInputWithIcon = (
    name: keyof SignUpFormData,
    label: string,
    type: string,
    placeholder: string,
    icon: React.ReactNode,
    isPassword = false
  ) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        {icon}
        {label}
      </label>
      <div className="relative">
        <input
          {...register(name)}
          type={
            isPassword
              ? name === "password"
                ? showPassword
                  ? "text"
                  : "password"
                : showConfirmPassword
                ? "text"
                : "password"
              : type
          }
          placeholder={placeholder}
          className={`w-full px-4 py-3 ${
            isPassword ? "pr-12" : ""
          } border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/50 backdrop-blur-sm ${
            errors[name]
              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 hover:border-gray-400"
          }`}
          disabled={isSubmitting}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() =>
              togglePasswordVisibility(name as "password" | "confirmPassword")
            }
            className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700 transition-colors"
            disabled={isSubmitting}
          >
            {(name === "password" ? showPassword : showConfirmPassword) ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
        {watchedFields[name] && !errors[name] && !isPassword && (
          <CheckCircle2 className="absolute right-3 top-3.5 w-5 h-5 text-green-500" />
        )}
      </div>
      <AnimatePresence>
        {errors[name] && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-red-600 flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4" />
            {errors[name]?.message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );

  const renderSelectWithIcon = (
    name: keyof SignUpFormData,
    label: string,
    options: Array<{ value: string; label: string }>,
    icon: React.ReactNode
  ) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        {icon}
        {label}
      </label>
      <div className="relative">
        <select
          {...register(name)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/50 backdrop-blur-sm ${
            errors[name]
              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 hover:border-gray-400"
          }`}
          disabled={isSubmitting}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {watchedFields[name] && !errors[name] && watchedFields[name] !== "" && (
          <CheckCircle2 className="absolute right-10 top-3.5 w-5 h-5 text-green-500" />
        )}
      </div>
      <AnimatePresence>
        {errors[name] && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-red-600 flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4" />
            {errors[name]?.message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "white",
            border: "1px solid #e5e7eb",
          },
        }}
      />

      {/* Left side - Image with enhanced animations */}
      <motion.div
        className="hidden lg:block w-2/5 relative overflow-hidden"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-indigo-600/40 via-purple-600/30 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        />

        <img
          src={image}
          alt="Healthcare Registration"
          className="h-screen object-cover w-full"
        />

        <motion.div
          className="absolute bottom-10 left-10 text-white max-w-md"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold drop-shadow-lg mb-3">
            Join Our Platform
          </h2>
          <p className="text-lg drop-shadow-lg opacity-90 leading-relaxed">
            Create your healthcare professional account and start making a
            difference in patient care.
          </p>
        </motion.div>
      </motion.div>

      {/* Right side - Enhanced form */}
      <motion.div
        className="flex flex-col items-center justify-center p-6 lg:p-12 w-full lg:w-3/5 overflow-y-auto max-h-screen relative"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Loading overlay */}
        <AnimatePresence>
          {isSubmitting && (
            <motion.div
              className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center"
              variants={loadingVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="text-center">
                <motion.div
                  className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <p className="text-gray-600 font-medium">
                  {formStep === "submitting" && "Creating your account..."}
                  {formStep === "success" && "Success! Redirecting..."}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="w-full max-w-4xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="text-center mb-8" variants={itemVariants}>
            <motion.div
              className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Users className="w-8 h-8 text-indigo-600" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Create Account
            </h1>
            <p className="text-gray-500 leading-relaxed max-w-md mx-auto">
              Join our healthcare platform and start providing excellent patient
              care
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            variants={itemVariants}
          >
            {/* Personal Information Section */}
            <motion.div
              className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200"
              variants={itemVariants}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderInputWithIcon(
                  "firstName",
                  "First Name",
                  "text",
                  "Enter your first name",
                  <User className="w-4 h-4" />
                )}
                {renderInputWithIcon(
                  "lastName",
                  "Last Name",
                  "text",
                  "Enter your last name",
                  <User className="w-4 h-4" />
                )}
                {renderInputWithIcon(
                  "dateOfBirth",
                  "Date of Birth",
                  "date",
                  "",
                  <Calendar className="w-4 h-4" />
                )}
                {renderSelectWithIcon(
                  "gender",
                  "Gender",
                  genderOptions,
                  <Users className="w-4 h-4" />
                )}
              </div>
            </motion.div>

            {/* Contact Information Section */}
            <motion.div
              className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200"
              variants={itemVariants}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderInputWithIcon(
                  "email",
                  "Email Address",
                  "email",
                  "you@example.com",
                  <Mail className="w-4 h-4" />
                )}
                {renderInputWithIcon(
                  "phoneNumber",
                  "Phone Number",
                  "tel",
                  "+250 XXX XXX XXX",
                  <Phone className="w-4 h-4" />
                )}
              </div>
            </motion.div>

            {/* Location & Professional Information Section */}
            <motion.div
              className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200"
              variants={itemVariants}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location & Professional Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderSelectWithIcon(
                  "province",
                  "Province/State",
                  provinceOptions,
                  <MapPin className="w-4 h-4" />
                )}
                {renderSelectWithIcon(
                  "district",
                  "District/City",
                  districtOptions,
                  <MapPin className="w-4 h-4" />
                )}
                {renderInputWithIcon(
                  "sector",
                  "Sector",
                  "text",
                  "Enter your sector",
                  <MapPin className="w-4 h-4" />
                )}
                {renderInputWithIcon(
                  "title",
                  "Professional Title",
                  "text",
                  "e.g., Nurse, Doctor, etc.",
                  <Briefcase className="w-4 h-4" />
                )}
              </div>
            </motion.div>

            {/* Security Information Section */}
            <motion.div
              className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200"
              variants={itemVariants}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Account Security
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderInputWithIcon(
                  "password",
                  "Password",
                  "password",
                  "Create a strong password",
                  <Lock className="w-4 h-4" />,
                  true
                )}
                {renderInputWithIcon(
                  "confirmPassword",
                  "Confirm Password",
                  "password",
                  "Confirm your password",
                  <Lock className="w-4 h-4" />,
                  true
                )}
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  <strong>Password Requirements:</strong> At least 8 characters
                  with uppercase, lowercase, and number.
                </p>
              </div>
            </motion.div>

            {/* Submit Buttons */}
            <motion.div
              className="flex flex-col space-y-4 pt-4"
              variants={itemVariants}
            >
              <motion.button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className={`w-full py-4 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-3 ${
                  isFormValid && !isSubmitting
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                whileHover={isFormValid && !isSubmitting ? { scale: 1.02 } : {}}
                whileTap={isFormValid && !isSubmitting ? { scale: 0.98 } : {}}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Users className="w-5 h-5" />
                    Create Account
                  </>
                )}
              </motion.button>

              <motion.button
                type="button"
                onClick={handleBackToSignIn}
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-lg font-medium border-2 transition-all duration-200 ${
                  isSubmitting
                    ? "border-gray-300 text-gray-400 cursor-not-allowed"
                    : "border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                }`}
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              >
                Already have an account? Sign In
              </motion.button>
            </motion.div>
          </motion.form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignUp;
