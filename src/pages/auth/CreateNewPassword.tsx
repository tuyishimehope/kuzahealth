import { useNavigate } from "react-router-dom";
import image from "../../assets/forgotpass.png";
import Button from "../../components/Button";
import Input from "../../components/Input";

const CreateNewPassword = () => {
  const navigate  = useNavigate()
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
          <p className="text-3xl text-center font-bÏold">Create New Password</p>
          {/* <p className="text-gray-500 text-sm">
            Fill the form below with your personal information
          </p> */}
        </div>
        <div className="flex flex-col space-y-6 justify-center w-80">
          <div className="flex flex-col space-y-1">
            <label htmlFor="">New Password</label>
            <Input
              type="password"
              placeholder="......"
              className="custom-input"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label htmlFor=""> Confirm Password</label>
            <Input type="password" placeholder="......." />
          </div>

          <div>
            <Button
              name="Continue"
              className="bg-purple-500   w-full my-4 px-6 py-2 text-white rounded-md hover:cursor-pointer"
              onClick={() => navigate("/auth/signin")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNewPassword;
