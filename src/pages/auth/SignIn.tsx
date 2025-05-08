import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import image from "../../assets/signin.png";
import google from "../../assets/google.png";

// Define the Zod schema
const signInSchema = z.object({
  email: z.string().email("Invalid email format").nonempty("Email is required"),
  password: z
    .string()
    .min(4, "Password must be at least 4 characters")
    .nonempty("Password is required"),
});

type SignInFormData = z.infer<typeof signInSchema>;

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
  [key: string]: unknown 
}) => {
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

// Custom Button component with animation
const AnimatedButton = ({ 
  children, 
  className, 
  icon, 
  ...props 
}: { 
  children: React.ReactNode; 
  className?: string; 
  icon?: string;
  [key: string]: unknown 
}) => {
  return (
    <motion.button
      className={`flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all ${className}`}
      whileHover={{ scale: 1.02, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
      whileTap={{ scale: 0.98 }}
      variants={itemVariants}
      {...props}
    >
      {icon && <img src={icon} alt="icon" className="w-5 h-5 mr-2" />}
      {children}
    </motion.button>
  );
};

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });
  const navigate = useNavigate();

  const onSubmit = async (data: SignInFormData) => {
    try {
      // Create the user object
      const user = { email: data.email, password: data.password };

      // Save the user object to localStorage
      localStorage.setItem("user", JSON.stringify(user));

      // Add success animation before navigation
      navigate("/healthworker/dashboard");
    } catch (error) {
      const err = error as AxiosError;
      console.error("Error processing sign in:", err.response?.data || err.message);
      // Show error alert
    }
  };

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
          alt="Sign In"
          className="h-screen object-cover w-full"
        />
        <motion.div 
          className="absolute bottom-10 left-10 text-white"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold drop-shadow-lg">Welcome Back</h2>
          <p className="text-lg mt-2 max-w-md drop-shadow-lg">Sign in to continue to your healthcare dashboard</p>
        </motion.div>
      </motion.div>

      {/* Right side - Form with animations */}
      <motion.div 
        className="flex flex-col items-center justify-center p-8 md:p-16 w-full md:w-1/2"
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
          <motion.div className="text-center mb-10" variants={itemVariants}>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h1>
            <p className="text-gray-500">Enter your credentials to access your account</p>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <AnimatedInput
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <AnimatedInput
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />

            <motion.div 
              className="flex justify-end"
              variants={itemVariants}
            >
              <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors">
                Forgot password?
              </a>
            </motion.div>

            <AnimatedButton
              type="submit"
              className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Sign In
            </AnimatedButton>

            <motion.div 
              className="relative my-6"
              variants={itemVariants}
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-gray-50 text-sm text-gray-500">or continue with</span>
              </div>
            </motion.div>

            <AnimatedButton
              type="button"
              icon={google}
              className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Sign in with Google
            </AnimatedButton>
          </form>

          <motion.div 
            className="text-center mt-8"
            variants={itemVariants}
          >
            <p className="text-gray-600">
              Don't have an account?{" "}
              <motion.span
                className="text-indigo-600 font-medium hover:text-indigo-800 cursor-pointer"
                onClick={() => navigate("/auth/signup")}
                whileHover={{ scale: 1.05 }}
              >
                Sign Up
              </motion.span>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignIn;