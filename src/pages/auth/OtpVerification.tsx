import { axiosInstance } from "@/utils/axiosInstance";
import type { ChangeEvent, KeyboardEvent, MouseEvent } from "react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface ButtonProps {
  name: React.ReactNode; 
  disabled?: boolean;
  className?: string;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

interface CountdownTimerProps {
  onExpiry: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ onExpiry }) => {
  const MAX_TIME = 60 * 5;
  const [secondsLeft, setSecondsLeft] = useState<number>(MAX_TIME);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onExpiry();
      return;
    }

    const intervalId = window.setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [secondsLeft, onExpiry]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const isExpiring = secondsLeft <= 60; // Last minute warning

  return (
    <div
      className={`flex items-center space-x-2 text-sm ${
        isExpiring ? "text-red-500" : "text-gray-600"
      }`}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>
        Time remaining: {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
};

interface NumberInputProps {
  id: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  maxLength?: number;
  className?: string;
  disabled?: boolean;
}

const NumberInput: React.FC<NumberInputProps> = ({
  id,
  value,
  onChange,
  onKeyDown,
  maxLength,
  className,
  disabled,
}) => {
  return (
    <input
      id={id}
      type="text"
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      maxLength={maxLength}
      className={className}
      disabled={disabled}
      inputMode="numeric"
      pattern="[0-9]*"
    />
  );
};

const Button: React.FC<ButtonProps> = ({
  name,
  disabled,
  className,
  onClick,
}) => {
  return (
    <button onClick={onClick} disabled={disabled} className={className}>
      {name}
    </button>
  );
};

const OtpVerification = () => {
  const [inputValues, setInputValues] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState("");
  const navigator = useNavigate();

  const handleChange = (e: { target: { value: any } }, index: number) => {
    const value = e.target.value;

    // Only allow numeric input
    if (value && !/^\d$/.test(value)) return;

    const newValues = [...inputValues];
    newValues[index] = value;
    setInputValues(newValues);
    setError(""); // Clear error when user types

    // Auto-focus management
    if (value !== "" && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (e: { key: string }, index: number) => {
    // Handle backspace to move to previous input
    if (e.key === "Backspace" && inputValues[index] === "" && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: {
    preventDefault: () => void;
    clipboardData: { getData: (arg0: string) => any };
  }) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const numericData = pastedData.replace(/\D/g, "").slice(0, 6);

    if (numericData.length === 6) {
      const newValues = numericData.split("");
      setInputValues(newValues);

      // Focus the last input
      const lastInput = document.getElementById("otp-input-5");
      lastInput?.focus();
    }
  };

  const handleSubmit = async () => {
    try {
      // Retrieve user data from localStorage
      const storedUser = localStorage.getItem("user");
      let email = "";
      let password = "";

      if (storedUser) {
        try {
          const { email: storedEmail, password: storedPassword } =
            JSON.parse(storedUser);
          email = storedEmail || "";
          password = storedPassword || "";
        } catch (error) {
          console.error("Error parsing user data from localStorage:", error);
        }
      }

      console.log("Email:", email);
      console.log("Password:", password);

      // Submit OTP for verification
      const otp = inputValues.join("");
      const response = await axiosInstance.post(
        `/api/v1/auth/login?otp=${otp}`,
        {
          email: email,
          password: password,
        }
      );

      if (response.status === 200) {
        // localStorage.removeItem("user");
        console.log("OTP verified successfully:", response.data);
        localStorage.setItem("token", JSON.stringify(response.data.token));
        //  const token = extractToken(response.data);
        // console.log("Extracted Token:", token);

        toast.success("OTP verified successfully!");
        if (response.data.userType === "ADMIN") {
          navigator("/superadmin/dashboard");
          console.log("Redirecting to admin dashboard", response.data.userType);
          return;
        }
        navigator("/healthworker/dashboard");
        console.log(
          "Redirecting to health worker dashboard",
          response.data.userType
        );
      } else {
        toast.error("Invalid OTP, please try again.");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      toast.error("There was an error verifying the OTP.");
    }
  };

  const handleResendOtp = async () => {
    try {
      setResendLoading(true);

      const storedUser = localStorage.getItem("user");
      let email = "";
      let password = "";

      if (storedUser) {
        try {
          const { email: storedEmail, password: storedPassword } =
            JSON.parse(storedUser);
          email = storedEmail || "";
          password = storedPassword || "";
        } catch (error) {
          console.error("Error parsing user data from localStorage:", error);
        }
      }
      // Create the user object
      const user = { email: email, password: password };

      // localStorage.setItem("user", JSON.stringify(user));
      axiosInstance
        .post("/api/v1/auth/send-otp", user)
        .then((response: { data: any }) => {
          setLoading(false);
          console.log("OTP sent successfully:", response.data);
          toast.success("OTP sent successfully! Please check your email.");
        })
        .catch((error: any) => {
          setLoading(false);
          console.error("Error sending OTP:", error);
          toast.error(
            error.response.data.message ||
              "Failed to send OTP. Please try again."
          );
        });

      alert("New OTP sent successfully! Please check your email.");

      // Reset timer and states
      setIsExpired(false);
      setCanResend(false);

      // Clear current inputs
      setInputValues(["", "", "", "", "", ""]);
      setError("");

      // Focus first input
      setTimeout(() => {
        const firstInput = document.getElementById("otp-input-0");
        firstInput?.focus();
      }, 100);
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleTimerExpiry = () => {
    setIsExpired(true);
    setCanResend(true);
    setError("OTP has expired. Please request a new one.");
  };

  const handleBackToLogin = () => {
    navigator("/auth/signin")
  };

  // Auto-focus first input on mount
  useEffect(() => {
    const firstInput = document.getElementById("otp-input-0");
    firstInput?.focus();
  }, []);

  const isFormValid = inputValues.join("").length === 6;

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Left side - Image Placeholder */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-500 to-purple-600">
        <div className="flex items-center justify-center w-full">
          <div className="text-center text-white space-y-4">
            <div className="w-32 h-32 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-8">
              <svg
                className="w-16 h-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold">Secure Verification</h2>
            <p className="text-lg opacity-90">Your security is our priority</p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 py-8 px-6 sm:px-10">
        <div className="w-full max-w-md space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              Verify Your Email
            </h1>

            <div className="space-y-2">
              <p className="text-gray-600">
                We've sent a 6-digit verification code to
              </p>
              <p className="text-sm text-gray-500">
                Enter the code below to continue
              </p>
            </div>
          </div>

          {/* OTP Input Section */}
          <div className="space-y-6">
            {/* OTP Input Fields */}
            <div className="space-y-4">
              <div
                className="flex justify-center space-x-3"
                onPaste={handlePaste}
              >
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="relative">
                    <NumberInput
                      id={`otp-input-${index}`}
                      value={inputValues[index]}
                      onChange={(e: any) => handleChange(e, index)}
                      onKeyDown={(e: any) => handleKeyDown(e, index)}
                      maxLength={1}
                      className={`
                        w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg
                        transition-all duration-200 focus:outline-none
                        ${
                          isExpired
                            ? "border-red-300 bg-red-50 text-red-400 cursor-not-allowed"
                            : inputValues[index]
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700 transform scale-105 shadow-md"
                            : "border-gray-300 hover:border-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                        }
                      `}
                      disabled={isExpired || loading}
                    />
                  </div>
                ))}
              </div>

              {error && (
                <div className="flex items-center justify-center space-x-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Timer and Resend Section */}
            <div className="space-y-4">
              <div className="flex justify-center">
                {!isExpired && <CountdownTimer onExpiry={handleTimerExpiry} />}
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Didn't receive the code?
                </p>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={!canResend || resendLoading}
                  className={`
                    inline-flex items-center space-x-2 text-sm font-medium
                    transition-all duration-200 px-3 py-1 rounded-md
                    ${
                      canResend && !resendLoading
                        ? "text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 cursor-pointer"
                        : "text-gray-400 cursor-not-allowed"
                    }
                  `}
                >
                  {resendLoading ? (
                    <>
                      <svg
                        className="w-4 h-4 animate-spin"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      <span>Resend Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="space-y-4">
              <Button
                name={
                  loading ? (
                    <div className="flex items-center space-x-2">
                      <svg
                        className="w-4 h-4 animate-spin"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    "Verify Code"
                  )
                }
                disabled={loading || isExpired || !isFormValid}
                onClick={handleSubmit}
                className={`
                  w-full py-3 px-6 text-white font-medium rounded-lg
                  transition-all duration-200 flex items-center justify-center
                  ${
                    loading || isExpired || !isFormValid
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  }
                `}
              />

              {/* Helpful hints */}
              <div className="text-center space-y-2">
                <p className="text-xs text-gray-500">
                  💡 Tip: You can paste the entire code at once
                </p>
                {!isFormValid && inputValues.some((val) => val !== "") && (
                  <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-md">
                    Please enter all 6 digits to continue
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Back to Login Link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <button
              onClick={handleBackToLogin}
              className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-50"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>Back to Sign In</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
