import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import type { Variants } from "framer-motion";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import image from "../../assets/signin.png";
import { axiosInstance } from "@/utils/axiosInstance";
import { Toaster, toast } from "sonner";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address").min(1, "Email is required"),
  password: z
    .string()
    .min(4, "Password must be at least 4 characters")
    .min(1, "Password is required"),
});

type SignInFormData = z.infer<typeof signInSchema>;

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
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
    transition: { duration: 0.3 }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.2 }
  }
};

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formStep, setFormStep] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onChange", // Real-time validation
  });

  const watchedEmail = watch("email");
  const watchedPassword = watch("password");
  const isFormValid = watchedEmail && watchedPassword && !errors.email && !errors.password;

  const onSubmit = async (data: SignInFormData) => {
    if (isSubmitting) return; // Prevent double submission

    setIsSubmitting(true);
    setFormStep('submitting');

    try {
      // Create the user object
      const user = { email: data.email, password: data.password };

      // Store user data temporarily
      localStorage.setItem("user", JSON.stringify(user));

      // API call with proper error handling
      const response = await axiosInstance.post("/api/v1/auth/send-otp", user);
      
      console.log("OTP sent successfully:", response.data);
      
      // Success state with animation
      setFormStep('success');
      
      toast.success("OTP sent successfully!", {
        description: "Please check your email for the verification code.",
        duration: 4000,
        icon: <CheckCircle2 className="w-5 h-5" />,
      });

      // Delay navigation for better UX
      setTimeout(() => {
        navigate("/auth/otp-verification", { 
          state: { email: data.email } // Pass email to next page
        });
      }, 1500);

    } catch (error) {
      setFormStep('error');
      
      const axiosError = error as AxiosError<{ message?: string }>;
      const errorMessage = axiosError.response?.data?.message || 
                          axiosError.message || 
                          "Failed to send OTP. Please try again.";
      
      console.error("Error sending OTP:", error);
      
      toast.error("Sign In Failed", {
        description: errorMessage,
        duration: 5000,
        icon: <AlertCircle className="w-5 h-5" />,
      });

      // Reset form step after error
      setTimeout(() => setFormStep('idle'), 2000);
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1000); // Keep loading state briefly for better UX
    }
  };

  const handleBackToHome = () => {
    if (isSubmitting) return; // Prevent navigation during submission
    navigate("/");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'white',
            border: '1px solid #e5e7eb',
          },
        }}
      />
      
      {/* Left side - Image with enhanced animations */}
      <motion.div
        className="hidden md:block w-1/2 relative overflow-hidden"
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
          alt="Healthcare Sign In"
          className="h-screen object-cover w-full"
        />
        
        <motion.div
          className="absolute bottom-10 left-10 text-white max-w-md"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold drop-shadow-lg mb-3">Welcome Back</h2>
          <p className="text-lg drop-shadow-lg opacity-90 leading-relaxed">
            Sign in to access your healthcare dashboard and continue providing excellent patient care.
          </p>
        </motion.div>
      </motion.div>

      {/* Right side - Enhanced form */}
      <motion.div
        className="flex flex-col items-center justify-center p-6 md:p-16 w-full md:w-1/2 relative"
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
                  {formStep === 'submitting' && "Sending OTP..."}
                  {formStep === 'success' && "Success! Redirecting..."}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="w-full max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="text-center mb-10" variants={itemVariants}>
            <motion.div
              className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Lock className="w-8 h-8 text-indigo-600" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h1>
            <p className="text-gray-500 leading-relaxed">
              Enter your credentials to access your healthcare dashboard
            </p>
          </motion.div>

          <motion.form 
            onSubmit={handleSubmit(onSubmit)} 
            className="space-y-6"
            variants={itemVariants}
          >
            {/* Email Input with enhanced styling */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <div className="relative">
                <input
                  {...register("email")}
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                    errors.email 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  disabled={isSubmitting}
                />
                {watchedEmail && !errors.email && (
                  <CheckCircle2 className="absolute right-3 top-3.5 w-5 h-5 text-green-500" />
                )}
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm text-red-600 flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password Input with enhanced styling */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/50 backdrop-blur-sm ${
                    errors.password 
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700 transition-colors"
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm text-red-600 flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Forgot Password Link */}
            <motion.div className="flex justify-end" variants={itemVariants}>
              <motion.a
                href="/auth/forgot-password"
                className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Forgot password?
              </motion.a>
            </motion.div>

            {/* Submit Button with enhanced states */}
            <motion.button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                isFormValid && !isSubmitting
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              whileHover={isFormValid && !isSubmitting ? { scale: 1.02 } : {}}
              whileTap={isFormValid && !isSubmitting ? { scale: 0.98 } : {}}
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </motion.button>

            {/* Back to Home Button */}
            <motion.button
              type="button"
              onClick={handleBackToHome}
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg font-medium border-2 transition-all duration-200 ${
                isSubmitting
                  ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                  : 'border-indigo-600 text-indigo-600 hover:bg-indigo-50'
              }`}
              whileHover={!isSubmitting ? { scale: 1.02 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
            >
              Back to Home
            </motion.button>
          </motion.form>

          {/* Sign Up Link */}
          <motion.div className="text-center mt-8" variants={itemVariants}>
            <p className="text-gray-600">
              Don't have an account?{" "}
              <motion.button
                onClick={() => !isSubmitting && navigate("/auth/signup")}
                disabled={isSubmitting}
                className={`font-medium transition-colors ${
                  isSubmitting
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-indigo-600 hover:text-indigo-800'
                }`}
                whileHover={!isSubmitting ? { scale: 1.05 } : {}}
                whileTap={!isSubmitting ? { scale: 0.95 } : {}}
              >
                Sign Up
              </motion.button>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignIn;