import { useNavigate } from "react-router-dom";
import image from "../../assets/signup.png";
import Button from "../../components/Button";
import Input from "../../components/Input";

const SignUp = () => {
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
      <div className="flex flex-col items-center justify-center min-h-screen w-[50vw] py-2 align-center space-y-6 px-10">
        <div className="space-y-4">
          <p className="text-3xl text-center font-bold">Sign Up</p>
          <p className="text-gray-500 text-sm">
            Fill the form below with your personal information
          </p>
        </div>
        <div className="flex flex-col space-y-2 justify-center">
          <div className="flex flex-col space-y-1">
            <label htmlFor="">Name</label>
            <Input type="name" placeholder="Enter your name" className="placeholder:text-gray-400"/>
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
            <select className="bg-slate-100 px-4 py-2 rounded-md placeholder:text-gray-300" >
              <option>Choose Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="">Phone Number</label>
            <Input type="number" placeholder="Enter your phone number" />
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="">Province/State</label>
            <select className="bg-slate-100 px-4 py-2 rounded-md">
              <option>Choose Province</option>
              <option>Kigali City</option>
              <option>Western Province</option>
              <option>Southern Province</option>
              <option>Eastern Province</option>
              <option>Northern Province</option>
            </select>
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="">Title/Post</label>
            <Input type="text" placeholder="Enter Your Title" />
          </div>
          <div>
            <div className="flex flex-col space-y-1">
              <label htmlFor="">District/City</label>
              <select className="bg-slate-100 px-4 py-2 rounded-md">
                <option>Choose District</option>

                <option>Bugesera</option>
                <option>Gatsibo</option>
                <option>Kayonza</option>
                <option>Kirehe</option>
                <option>Ngoma</option>
                <option value="">Nyagatare</option>
                <option value="">Rwamagana</option>
                <option value="">Nyarugenge</option>
                <option value="">Kicukiro</option>
                <option value="">Gasabo</option>

                <option value="">Huye</option>
                <option value="">Ruhango</option>
                <option value="">Nyamagabe</option>
                <option value="">Gisagara</option>
                <option value="">Muhanga</option>
                <option value="">Kamonyi</option>
                <option value="">Nyanza</option>
                <option value="">Nyaruguru</option>
                <option value="">Nyamasheke</option>
                <option value="">Rusizi</option>
                <option value="">Karongi</option>
                <option value="">Ngororero</option>
                <option value="">Rustiro</option>
                <option value="">Rubavu</option>
                <option value="">Nyabihu</option>
                <option value="">Rulindo</option>
                <option value="">Gakenke</option>
                <option value="">Gicumbi</option>
              </select>
            </div>
            <div className="flex flex-col space-y-1">
              <label htmlFor="">Password</label>
              <Input type="password" placeholder="Enter Your Password" />
            </div>
            <div className="flex flex-col space-y-1">
              <label htmlFor="">Confirm Password</label>
              <Input type="password" placeholder="Confirm Password" />
            </div>
            <Button
              name="Sign Up"
              className="bg-purple-500 w-full my-4 px-6 py-2 text-white rounded-md"
            />
            <p>
              Already Have An Account?{" "}
              <span
                className="text-blue-600 underline"
                onClick={() => navigate("/auth/signin")}
              >
                Sign In
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
