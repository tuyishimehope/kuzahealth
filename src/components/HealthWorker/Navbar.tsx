import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import profile from "../../assets/profile.png";

interface DecodedToken {
  email: string;
  // Add other properties if necessary (e.g., name, role, exp)
}

const Navbar = () => {
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Get the token from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Decode the token
        const decoded = jwtDecode<DecodedToken>(token);
        // Set the email from the decoded token
        setEmail(decoded.email); // Adjust if the email is in a different field in your token
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  return (
    <div className="py-4 px-6 flex justify-between w-full">
      <div>
        <h1 className="text-2xl">Dashboard</h1>
      </div>

      <div className="flex h-12 gap-4">
        <img src={profile} alt="profile-image" className="w-12 object-cover" />
        <div>
          <h4>Hello</h4>
          <p>{email || "Kyrie"}</p> {/* Display decoded email, fallback to "Kyrie" */}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
