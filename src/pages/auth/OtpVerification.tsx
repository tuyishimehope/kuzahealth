import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import image from "../../assets/forgotpass.png";
import Button from "../../components/Button";
import NumberInput from "../../components/NumberInput";
import auth from "../../assets/auth2.jpeg";
import { axiosInstance } from "@/utils/axiosInstance";
import extractToken from "@/utils/extractToken";
import { toast, Toaster } from "sonner";

// Zod Schema for OTP validation
const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"), // OTP should be exactly 6 digits
});

type OtpFormData = {
  otp: string;
};

const OtpVerification = () => {
  const navigate = useNavigate();
  const [inputValues, setInputValues] = useState(["", "", "", "", "", ""]);
  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  const handleChange = (value: string, index: number) => {
    // Update the value of the OTP at the given index
    const newValues = [...inputValues];
    newValues[index] = value;
    setInputValues(newValues);

    // Update the OTP field value in react-hook-form
    setValue("otp", newValues.join(""), { shouldValidate: true });

    // Focus next input when current input is filled
    if (value !== "" && index < 5) {
      const nextInput = document.getElementById(
        `otp-input-${index + 1}`
      ) as HTMLInputElement;
      nextInput?.focus();
    }
  };

  const onSubmit = async (data: OtpFormData) => {
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
      const otp = data.otp;
      const response = await axiosInstance.post(
        `/api/v1/auth/login?otp=${otp}`,
        { email, password }
      );

      if (response.status === 200) {
        // localStorage.removeItem("user");
        console.log("OTP verified successfully:", response.data);
        localStorage.setItem("token", JSON.stringify(response.data.token));
        //  const token = extractToken(response.data);
        // console.log("Extracted Token:", token);

        toast.success("OTP verified successfully!");
        if (response.data.userType === "ADMIN") {
          navigate("/superadmin/dashboard");
          console.log("Redirecting to admin dashboard", response.data.userType);
          return;
        }
        navigate("/healthworker/dashboard");
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

  return (
    <div className="flex min-h-screen w-full">
      <Toaster />
      <div>
        <img
          src={image}
          alt="image"
          className="h-screen object-cover w-[50vw]"
        />
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen w-[50vw] py-4 align-center space-y-6 px-10">
        <div className="space-y-4">
          <p className="text-3xl text-center font-bold">Forgot Password?</p>
          <img src={auth} alt="auth" />
          <p className="text-gray-400">Please enter the sent OTP!</p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-2 justify-center w-80"
        >
          <div className="flex space-x-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <NumberInput
                key={index}
                id={`otp-input-${index}`}
                value={inputValues[index]}
                onChange={(e) => handleChange(e.target.value, index)}
                maxLength={1}
              />
            ))}
          </div>
          {errors.otp && (
            <p className="text-red-500 text-sm mt-2">{errors.otp.message}</p>
          )}
          <div className="pt-4">
            <p className="text-gray-500">00:12 Sec</p>
            <p className="pt-6">
              Didn't receive code?{" "}
              <span className="text-blue-500">Resend Code</span>
            </p>
          </div>
          <div>
            <Button
              name="Submit"
              className="bg-purple-500 hover:cursor-pointer w-full my-4 px-6 py-2 text-white rounded-md"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpVerification;
