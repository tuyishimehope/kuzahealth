import { useNavigate } from "react-router-dom";
import image from "../../assets/forgotpass.png";
import Button from "../../components/Button";
import NumberInput from "../../components/NumberInput";

const OtpVerification = () => {
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
          <p className="text-3xl text-center font-bold">Forgot Password ?</p>
          <p className="text-gray-400">Please enter the sent OTP!!!</p>
        </div>
        <div className="flex flex-col space-y-2 justify-center w-80">
          <div className="flex  space-x-4">
           <NumberInput/>
           <NumberInput/>
           <NumberInput/>
           <NumberInput/>
           
          </div>
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
              className="bg-purple-500 hover:cursor-pointer   w-full my-4 px-6 py-2 text-white rounded-md"
              onClick={() => navigate("/auth/createnewpassword")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
