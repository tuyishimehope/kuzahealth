import { useNavigate } from "react-router-dom";
import logo from "../assets/logo1.png";
import Button from "../components/Button";
import navLinks from "../utils/navLinks";


const NavBar = () => {
  const navigate = useNavigate();
  return (
    <nav className="flex relative z-100  justify-between items-center px-4 py-2 min-w-sm:flex-col">
    <div className="logo">
      <img src={logo} alt="logo" className="w-10" />
    </div>
    <div className="right-nav flex justify-between items-center">
      <ul className="flex space-x-4 mr-10">
        {navLinks.map((link,index) => (
          <li key={index} className="hover:text-purple-300 text-lg text-white hover:cursor-pointer hover:underline hover:transition-all">
            <a href={link.link}>{link.name}</a></li>
        ))}
        
      </ul>
      <Button
        name="Sign In"
        className={`bg-btnSignIn px-4 py-2 rounded-md text-white hover:bg-purple-700`}
        onClick={() => navigate("/auth/signin")}
      
      />
    </div>
  </nav>
  )
}

export default NavBar