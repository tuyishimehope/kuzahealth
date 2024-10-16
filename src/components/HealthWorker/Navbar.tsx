import profile from "../../assets/profile.png";

const Navbar = () => {
  return (
    <div className=" py-4 px-6 flex justify-between w-full g">
      <div>
        <h1 className="text-2xl">Dashboard</h1>
      </div>

      <div className="flex h-12 gap-4">
        <img src={profile} alt="profile-image" className="w-12 object-cover" />
        <div>
          <h4>Hello</h4>
          <p>Kyrie</p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
