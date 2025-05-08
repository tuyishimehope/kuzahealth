import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import image from "../../assets/signup.png";

// Define the Zod schema
const signUpSchema = z.object({
  name: z.string().nonempty("Name is required"),
  dateOfBirth: z.string().nonempty("Date of birth is required"),
  email: z.string().email("Invalid email format").nonempty("Email is required"),
  gender: z.string().nonempty("Gender is required"),
  phoneNumber: z.string().nonempty("Phone number is required"),
  province: z.string().nonempty("Province is required"),
  title: z.string().nonempty("Title is required"),
  district: z.string().nonempty("District is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .nonempty("Password is required"),
  confirmPassword: z.string().nonempty("Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  },
};

// Custom Input component with animation
const AnimatedInput = ({ 
  label, 
  error, 
  ...props 
}: { 
  label: string; 
  error?: string; 
  [key: string]: unknown;
}): JSX.Element => {
  return (
    <motion.div 
      className="flex flex-col space-y-2"
      variants={itemVariants}
    >
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          className={`w-full px-4 py-3 bg-gray-50 border ${
            error ? "border-red-300" : "border-gray-200"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`}
          {...props}
        />
      </div>
      {error && (
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-red-500 text-xs mt-1"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

// Custom Select component with animation
const AnimatedSelect = ({ 
  label, 
  error, 
  options,
  ...props 
}: { 
  label: string; 
  error?: string;
  options: Array<{value: string; label: string}>;
  [key: string]: unknown;
}): JSX.Element => {
  return (
    <motion.div 
      className="flex flex-col space-y-2"
      variants={itemVariants}
    >
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <select
          className={`w-full px-4 py-3 bg-gray-50 border ${
            error ? "border-red-300" : "border-gray-200"
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-red-500 text-xs mt-1"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

// Custom Button component with animation
const AnimatedButton = ({ 
  children, 
  className, 
  ...props 
}: { 
  children: React.ReactNode; 
  className?: string; 
  [key: string]: unknown;
}): JSX.Element => {
  return (
    <motion.button
      className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all ${className}`}
      whileHover={{ scale: 1.02, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
      whileTap={{ scale: 0.98 }}
      variants={itemVariants}
      {...props}
    >
      {children}
    </motion.button>
  );
};

const SignUp = (): JSX.Element => {
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
      // Create the user object - in a real app, this would be sent to an API
      console.log("Form submitted:", data);
      
      // Navigate to the sign in page after successful signup
      navigate("/auth/signin");
    } catch (error) {
      console.error("Error processing sign up:", error);
      // Show error alert
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
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Left side - Image with animation */}
      <motion.div 
        className="hidden md:block w-1/2 relative overflow-hidden"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        />
        <img
          src={image}
          alt="Sign Up"
          className="h-screen object-cover w-full"
        />
        <motion.div 
          className="absolute bottom-10 left-10 text-white"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold drop-shadow-lg">Join Our Platform</h2>
          <p className="text-lg mt-2 max-w-md drop-shadow-lg">Create your account to access healthcare services</p>
        </motion.div>
      </motion.div>

      {/* Right side - Form with animations */}
      <motion.div 
        className="flex flex-col items-center justify-center p-8 md:p-12 w-full md:w-1/2 overflow-y-auto max-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="w-full max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="text-center mb-8" variants={itemVariants}>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Sign Up</h1>
            <p className="text-gray-500">Create your account to get started</p>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatedInput
                label="Full Name"
                type="text"
                placeholder="John Doe"
                error={errors.name?.message}
                {...register("name")}
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

            <motion.div className="pt-4" variants={itemVariants}>
              <AnimatedButton
                type="submit"
                className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Create Account
              </AnimatedButton>
            </motion.div>

            <motion.div 
              className="text-center mt-6"
              variants={itemVariants}
            >
              <p className="text-gray-600">
                Already have an account?{" "}
                <motion.span
                  className="text-indigo-600 font-medium hover:text-indigo-800 cursor-pointer"
                  onClick={() => navigate("/auth/signin")}
                  whileHover={{ scale: 1.05 }}
                >
                  Sign In
                </motion.span>
              </p>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignUp;