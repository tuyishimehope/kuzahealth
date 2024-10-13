import Navbar from "../../components/HealthWorker/Navbar";
import Sidebar from "../../components/HealthWorker/Sidebar";

const Dashboard = () => {
  return (
    <div className="flex ">
      <Sidebar />

      <div>
        <Navbar />
        <div></div>
      </div>
    </div>
  );
};

export default Dashboard;
