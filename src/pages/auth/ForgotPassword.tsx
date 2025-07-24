import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  Mail,
  Shield,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { axiosInstance } from "@/utils/axiosInstance";
import axios from "axios";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: LucideIcon;
}

const Input: React.FC<InputProps> = ({
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  disabled,
  icon: Icon,
  ...props
}) => (
  <div className="relative">
    {Icon && (
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
    )}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`
        w-full px-4 py-3 rounded-lg border transition-all duration-200
        ${Icon ? "pl-11" : "pl-4"}
        ${
          error
            ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200"
            : "border-gray-200 bg-white focus:border-indigo-500 focus:ring-indigo-200"
        }
        focus:outline-none focus:ring-2 focus:ring-opacity-50
        disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
        placeholder:text-gray-400
      `}
      {...props}
    />
  </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  disabled,
  loading,
  onClick,
  className = "",
  ...props
}) => {
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm",
    secondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200",
    ghost: "hover:bg-gray-100 text-gray-600",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-6 py-4 text-lg",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${variants[variant]} ${sizes[size]}
        rounded-lg font-medium transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-[0.98] transform
        ${className}
      `}
      {...props}
    >
      <span className="flex items-center justify-center gap-2">
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </span>
    </button>
  );
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Email validation
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post("/api/v1/auth/reset-password-request", {
        email,
      });
      setSubmitted(true);
    } catch (err: unknown) {
      console.log(err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Something went wrong.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  // const itemVariants = {
  //   hidden: { opacity: 0, y: 20 },
  //   visible: {
  //     opacity: 1,
  //     y: 0,
  //     transition: { duration: 0.5, ease: "easeOut" }
  //   }
  // };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Check your email
          </h2>
          <p className="text-gray-600 mb-8">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <Button
            variant="secondary"
            onClick={() => navigate("/auth/reset-password")}
            className="w-full"
          >
            Back to Login
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="flex min-h-screen">
        {/* Left side - Hero Image */}
        <motion.div
          className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 via-purple-600/80 to-blue-700/90 z-10" />
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
            }}
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-center px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Shield className="h-16 w-16 text-white mb-8" />
              <h1 className="text-4xl font-bold text-white mb-6">
                Secure Account Recovery
              </h1>
              <p className="text-xl text-indigo-100 leading-relaxed">
                Don't worry, we've got you covered. Enter your email and we'll
                send you a secure link to reset your password.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Right side - Form */}
        <motion.div
          className="w-full lg:w-1/2 flex items-center justify-center p-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-md w-full space-y-8">
            {/* Header */}
            <motion.div className="text-center lg:text-left">
              <button
                onClick={() => navigate("/auth/signin")}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8 group"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to login
              </button>

              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Forgot your password?
              </h2>
              <p className="text-gray-600">
                No problem. Just enter your email address and we'll send you a
                link to reset it.
              </p>
            </motion.div>

            {/* Form */}
            <motion.form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={error}
                  disabled={loading}
                  icon={Mail}
                  autoComplete="email"
                  autoFocus
                />
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 text-red-600 text-sm"
                    >
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Button
                type="submit"
                loading={loading}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Sending reset link..." : "Send reset link"}
              </Button>
            </motion.form>

            {/* Footer */}
            <motion.div className="text-center">
              <p className="text-gray-600">
                Remember your password?{" "}
                <button
                  onClick={() => navigate("/auth/signin")}
                  className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  Sign in instead
                </button>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
