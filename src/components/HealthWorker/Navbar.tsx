import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { RiMenuLine, RiNotification3Line } from "react-icons/ri";
import profile from "../../assets/profile.png";

interface DecodedToken {
  email: string;
  name?: string;
  // Add other properties if necessary (e.g., role, exp)
}

interface NavbarProps {
  toggleSidebar?: () => void;
  title?: string;
}

const Navbar = ({ toggleSidebar, title = "Dashboard" }: NavbarProps): JSX.Element => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    // Get the token from localStorage
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Decode the token
        const decoded = jwtDecode<DecodedToken>(token);
        // Set the email from the decoded token
        setEmail(decoded.email);
        
        // If name exists in token, use it, otherwise use email username
        if (decoded.name) {
          setName(decoded.name);
        } else {
          const username = decoded.email.split('@')[0];
          setName(username.charAt(0).toUpperCase() + username.slice(1));
        }
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  return (
    <div className="bg-white border-b border-gray-100 py-4 px-6 flex justify-between items-center w-full">
      <div className="flex items-center gap-4">
        {toggleSidebar && (
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <RiMenuLine className="text-gray-600 w-5 h-5" />
          </button>
        )}
        <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
      </div>
      
      <div className="flex items-center gap-5">
        <div className="relative">
          <button className="p-2 rounded-full hover:bg-gray-100 relative">
            <RiNotification3Line className="text-gray-600 w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-purple-500 rounded-full"></span>
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-purple-100">
            <img 
              src={profile} 
              alt="profile" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">Hello</p>
            <p className="text-xs text-gray-500">{name || email || "Kyrie"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;