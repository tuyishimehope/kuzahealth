import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import image from "../../assets/signin.png";
import Button from "../../components/Button";
import Input from "../../components/Input";
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

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });
  const navigate = useNavigate();

  const url = import.meta.env.VITE_BASE_URL;

  const onSubmit = async (data: SignInFormData) => {
    try {
      // Create the user object
      const user = { email: data.email, password: data.password };

      // Save the user object to localStorage
      localStorage.setItem("user", JSON.stringify(user));

      // Send OTP to the email
      const response = await axios.post(`${url}/api/v1/auth/send-otp`, {
        email: data.email,
      });

      console.log("OTP sent:", response.data);
      alert("OTP sent to your email");

      // Navigate to OTP verification page
      navigate("/auth/otpverification");
    } catch (error) {
      const err = error as AxiosError; // Explicitly assert error type
      console.error("Error sending OTP:", err.response?.data || err.message);
      alert("Failed to send OTP. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      <div>
        <img
          src={image}
          alt="Sign In"
          className="h-screen object-cover w-[50vw]"
        />
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen w-[50vw] py-4 space-y-6 px-10">
        <div className="space-y-4">
          <p className="text-3xl text-center font-bold">Sign In</p>
          <p className="text-gray-500 text-sm">
            Enter your email and password to receive an OTP
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4 w-80"
        >
          {/* Email Input */}
          <div className="flex flex-col space-y-1">
            <label htmlFor="email">Email</label>
            <Input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="flex flex-col space-y-1">
            <label htmlFor="password">Password</label>
            <Input
              type="password"
              placeholder="Enter your password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <Button
            name="Send OTP"
            className="bg-btnSignIn w-full my-4 px-6 py-2 text-white rounded-full"
          />
        </form>
        <p className="text-gray-400 text-center">or</p>
        <Button
          name="Sign In With Google"
          className="bg-white flex items-center justify-center w-full my-4 px-6 py-2 text-black rounded-full border-2 border-slate-100"
          icon={google}
        />
        <p className="text-center">
          Don’t Have An Account?{" "}
          <span
            className="text-blue-600 underline hover:cursor-pointer"
            onClick={() => navigate("/auth/signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
