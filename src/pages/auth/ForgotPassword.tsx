import { useNavigate } from "react-router-dom";
import image from "../../assets/forgotpass.png";
import Button from "../../components/Button";
import Input from "../../components/Input";

const ForgotPassword = () => {
  const navigate = useNavigate()
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
          <p className="text-3xl text-center font-bold">Forgot Password ?</p>
          <p className="text-gray-400">
            Don’t worry ! It happens. Please enter the phone number/email we
            will send you the OTP.
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

          <div>
            <Button
              name="Continue"
              className="bg-purple-500  hover:cursor-pointer w-full my-4 px-6 py-2 text-white rounded-md"
              onClick={() => navigate("/auth/otpverification")}
            />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
