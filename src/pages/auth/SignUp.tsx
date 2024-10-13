import { useNavigate } from "react-router-dom";
import image from "../../assets/signup.png";
import Button from "../../components/Button";
import Input from "../../components/Input";

const SignUp = () => {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-screen w-full">
      <div>
        <img src={image} alt="image" className="h-screen object-cover w-[50vw]" />
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen w-[50vw] py-4 align-center space-y-6 px-10">
        <div  className="space-y-4">
          <p className="text-3xl text-center font-bold">Sign Up</p>
          <p className="text-gray-500 text-sm">Fill the form below with your personal information</p>
        </div>
        <div className="flex flex-col space-y-2 justify-center">
          <div className="flex flex-col space-y-1">
            <label htmlFor="">Name</label>
            <Input type="name" placeholder="Enter your name" />
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="">Date Of Birth</label>
            <Input type="date" placeholder="Enter your date of birth" />
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="">Email</label>
            <Input
              type="email"
              placeholder="Enter your email"
              className="custom-input"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="">Gender</label>
            <Input type="boolean" placeholder="Enter Your Gender" />
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="">Phone Number</label>
            <Input type="number" placeholder="Enter your phone number" />
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="">Province/State</label>
            <Input type="text" placeholder="Enter Your Province" />
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="">Title/Post</label>
            <Input type="text" placeholder="Enter Your Title" />
          </div>
          <div>
            <div className="flex flex-col space-y-1">
              <label htmlFor="">District/City</label>
              <Input type="text" placeholder="Enter Your City" />
            </div>
            <div className="flex flex-col space-y-1">
              <label htmlFor="">Password</label>
              <Input type="password" placeholder="Enter Your Password" />
            </div>
            <div className="flex flex-col space-y-1">
              <label htmlFor="">Confirm Password</label>
              <Input type="password" placeholder="Confirm Password" />
            </div>
            <Button name="Sign Up" className="bg-purple-500 w-full my-4 px-6 py-2 text-white rounded-md" />
            <p>
              Already Have An Account? <span className="text-blue-600 underline" onClick={() => navigate("/auth/signin")}>Sign In</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
