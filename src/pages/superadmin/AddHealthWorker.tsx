import AnimatedButton from "@/components/form/AnimatedButton";
import AnimatedInput from "@/components/form/AnimatedInput";
import AnimatedSelect from "@/components/form/AnimatedSelect";
import { axiosInstance } from "@/utils/axiosInstance";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Variants } from "framer-motion";
import { motion } from "framer-motion";

import { Phone, Shield, User } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

// Define the Zod schema
const signUpSchema = z
  .object({
    firstName: z.string().nonempty("Name is required"),
    lastName: z.string().nonempty("Name is required"),
    username: z.string().nonempty("username is required").optional(),
    dateOfBirth: z.string().nonempty("Date of birth is required"),
    email: z
      .string()
      .email("Invalid email format")
      .nonempty("Email is required"),
    gender: z.string().nonempty("Gender is required"),
    phoneNumber: z.string().nonempty("Phone number is required"),
    province: z.string().nonempty("Province is required"),
    title: z.string().nonempty("Title is required"),
    district: z.string().nonempty("District is required"),
    sector: z.string().nonempty("Sector is required"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .nonempty("Password is required"),
    confirmPassword: z.string().nonempty("Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const AddHealthWorker = (): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });
  const navigate = useNavigate();

  const onSubmit = async (data: SignUpFormData): Promise<void> => {
    try {
      const username = `${data.firstName}${data.lastName}`;
      const role = "HEALTH_WORKER";
      console.log("username", username);
      const payload = { ...data, username, role };
      console.log("payload", payload);

      console.log("Form submitted:", data);
      axiosInstance
        .post("/api/v1/auth/register", payload)
        .then((response) => {
          console.log("User signed up successfully:", response.data);
          toast.success(
            "Sign up successful! Please check your email for verification."
          );

          navigate("/auth/signin");
        })
        .catch((error) => {
          console.error("Error signing up:", error);
          toast.error(
            `Sign up failed. Please try again,${error.response.data}`
          );
        });
    } catch (error) {
      console.error("Error processing sign up:", error);
      toast.error("An error occurred during sign up. Please try again.");
    }
  };

  // Gender options
  const genderOptions = [
    { value: "", label: "Choose Gender" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

  // Province options
  const provinceOptions = [
    { value: "", label: "Choose Province" },
    { value: "kigali", label: "Kigali City" },
    { value: "western", label: "Western Province" },
    { value: "southern", label: "Southern Province" },
    { value: "eastern", label: "Eastern Province" },
    { value: "northern", label: "Northern Province" },
  ];

  // District options
  const districtOptions = [
    { value: "", label: "Choose District" },
    { value: "bugesera", label: "Bugesera" },
    { value: "gatsibo", label: "Gatsibo" },
    { value: "kayonza", label: "Kayonza" },
    { value: "kirehe", label: "Kirehe" },
    { value: "ngoma", label: "Ngoma" },
    { value: "nyagatare", label: "Nyagatare" },
    { value: "rwamagana", label: "Rwamagana" },
    { value: "nyarugenge", label: "Nyarugenge" },
    { value: "kicukiro", label: "Kicukiro" },
    { value: "gasabo", label: "Gasabo" },
    { value: "huye", label: "Huye" },
    { value: "ruhango", label: "Ruhango" },
    { value: "nyamagabe", label: "Nyamagabe" },
    { value: "gisagara", label: "Gisagara" },
    { value: "muhanga", label: "Muhanga" },
    // Additional districts can be added
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-violet-100 rounded-full mb-4">
            <User className="w-8 h-8 text-violet-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Register Health Worker
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Create a new account for healthcare professionals to access the
            system
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800">
                Personal Information
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Please fill in all required fields marked with *
              </p>
            </div>

            <div className="p-8">
              {/* Personal Details Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatedInput
                  label="First Name"
                  type="text"
                  placeholder="John "
                  error={errors.firstName?.message}
                  {...register("firstName")}
                />
                <AnimatedInput
                  label="Last Name"
                  type="text"
                  placeholder=" Doe"
                  error={errors.lastName?.message}
                  {...register("lastName")}
                />

                <AnimatedInput
                  label="Date of Birth"
                  type="date"
                  error={errors.dateOfBirth?.message}
                  {...register("dateOfBirth")}
                />

                <AnimatedInput
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  error={errors.email?.message}
                  {...register("email")}
                />
              </div>

              {/* Contact & Location Section */}
              <div className="border-t border-gray-100 pt-8 mb-8">
                <h3 className="text-lg font-medium text-gray-800 mb-6 flex items-center gap-2">
                  <Phone size={20} className="text-gray-500" />
                  Contact & Location Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AnimatedSelect
                    label="Gender"
                    options={genderOptions}
                    error={errors.gender?.message}
                    {...register("gender")}
                  />

                  <AnimatedInput
                    label="Phone Number"
                    type="tel"
                    placeholder="+250 ..."
                    error={errors.phoneNumber?.message}
                    {...register("phoneNumber")}
                  />

                  <AnimatedSelect
                    label="Province/State"
                    options={provinceOptions}
                    error={errors.province?.message}
                    {...register("province")}
                  />

                  <AnimatedInput
                    label="Title/Post"
                    type="text"
                    placeholder="Your Position"
                    error={errors.title?.message}
                    {...register("title")}
                  />

                  <AnimatedSelect
                    label="District/City"
                    options={districtOptions}
                    error={errors.district?.message}
                    {...register("district")}
                  />
                  <AnimatedInput
                    label="Sector"
                    error={errors.district?.message}
                    {...register("sector")}
                  />
                </div>
              </div>

              {/* Security Section */}
              <div className="border-t border-gray-100 pt-8 mb-8">
                <h3 className="text-lg font-medium text-gray-800 mb-6 flex items-center gap-2">
                  <Shield size={20} className="text-gray-500" />
                  Security Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AnimatedInput
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    error={errors.password?.message}
                    {...register("password")}
                  />

                  <AnimatedInput
                    label="Confirm Password"
                    type="password"
                    placeholder="••••••••"
                    error={errors.confirmPassword?.message}
                    {...register("confirmPassword")}
                  />
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 mb-8">
                <h4 className="text-sm font-medium text-violet-800 mb-2">
                  Password Requirements:
                </h4>
                <ul className="text-xs text-violet-700 space-y-1">
                  <li>• At least 6 characters long</li>
                  <li>• Include both letters and numbers</li>
                  <li>• Use special characters for added security</li>
                </ul>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100 ">
                <motion.div className="flex-1 pt-4" variants={itemVariants}>
                  <AnimatedButton
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 px-8 rounded-lg hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Create Health Worker Account
                  </AnimatedButton>
                </motion.div>
                <button
                  type="button"
                  className=" px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            By creating an account, you agree to our Terms of Service and
            Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddHealthWorker;
