import { useNavigate } from "react-router-dom";
import image from "../../assets/signin.png";
import Button from "../../components/Button";
import Input from "../../components/Input";
import google from "../../assets/google.png"

const SignIn = () => {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen w-full">
      <div>
        <img
          src={image}
          alt="image"
          className="h-screen object-cover w-[50vw]"
        />
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen w-[50vw] py-4 align-center space-y-6 px-10">
        <div className="space-y-4">
          <p className="text-3xl text-center font-bold">Sign In</p>
          <p className="text-gray-500 text-sm">
            Fill the form below with your personal information
          </p>
        </div>
        <div className="flex flex-col space-y-2 justify-center w-80">
          <div className="flex flex-col space-y-1">
            <label htmlFor="">Email</label>
            <Input
              type="email"
              placeholder="Enter your email"
              className="custom-input"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label htmlFor="">Password</label>
            <Input type="password" placeholder="Enter Your Password" />
          </div>
          <div className="space-x-2 flex mb-4 items-center pt-4 justify-between">
            <div className="space-x-2">
              <Input type="checkbox" />
              <label htmlFor="">Keep Me Logged In</label>
            </div>
            <span
              className="text-sm text-blue-400 hover:cursor-pointer"
              onClick={() => navigate("/auth/forgotpassword")}
            >
              Forgot Password
            </span>
          </div>
          <div>
            <Button
              name="Sign In"
              className="bg-btnSignIn  w-full  my-4 px-6 py-2 text-white rounded-full"
              onClick={() => navigate("/healthworker/dashboard")}
            />
            <p className="text-gray-400 text-center">or</p>
            
            <Button
              name="Sign In With Google"
              className="bg-white flex items-center justify-center w-full my-4 px-6 py-2 text-black rounded-full border-2 border-slate-100 "
              icon={google}
            />
          </div>
          <p className="text-center">
            Dont't Have An Account?{" "}
            <span
              className="text-blue-600 underline hover:cursor-pointer"
              onClick={() => navigate("/auth/signup")}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
