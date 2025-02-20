import { useEffect, useState } from "react";
import profile from "../../assets/profile.png";
import Button from "../../components/Button";
import { IoIosAdd } from "react-icons/io";

interface Patient {
  profile?: string;
  name: string;
  phone1: string;
  phone2: string;
  birthdate: string;
  nationalId: string;
  actions?: string;
}

const ViewPatient = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const url = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(`${url}/api/parents`);
        if (!response.ok) {
          throw new Error("Failed to fetch patients");
        }
        const data = await response.json();
        setPatients(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []); // Only fetch data once when the component mounts

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center text-primaryColor">
        View Patients
      </h1>

      {/* Filter and Sort Section */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search patients..."
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-primaryColor transition duration-200"
          />
          <select className="border border-gray-300 rounded-md p-2">
            <option value="">Sort by</option>
            <option value="name">Name</option>
            <option value="birthdate">Birthdate</option>
            <option value="nationalId">National ID</option>
          </select>
        </div>
        <button className="bg-bgBtnPurple text-white px-4 py-2 rounded-md transition duration-200 hover:bg-bgBtnPurpleHover">
          Add Patient
        </button>
      </div>

      <div className="pb-4 space-y-2">
        <p className="text-xl">Recent Contacts</p>
        <p>Send or request your contact list</p>
        <div className="flex gap-2">
          <img src={profile} alt="profile" className="w-10" />
          <img src={profile} alt="profile" className="w-10" />
          <img src={profile} alt="profile" className="w-10" />
          <img src={profile} alt="profile" className="w-10" />
          <img src={profile} alt="profile" className="w-10" />
          <Button
            name="Add New"
            className="bg-btnSignIn text-white px-4 rounded-full"
            icon={<IoIosAdd />}
          />
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white shadow-lg rounded-lg p-4">
        <table className="min-w-full table-auto">
          <thead className="bg-primaryColor text-white">
            <tr>
              <th className="py-3 px-4">Profile</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Phone 1</th>
              <th className="py-3 px-4">Phone 2</th>
              <th className="py-3 px-4">Birthdate</th>
              <th className="py-3 px-4">National ID</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient, index) => (
              <tr key={index} className="border-b">
                <td className="py-3 px-4 text-center">
                  <img
                    src={patient.profile || profile}
                    alt="Profile"
                    className="w-12 h-12 rounded-full mx-auto"
                  />
                </td>
                <td className="py-3 px-4 text-center text-sm">
                  {patient.name}
                </td>
                <td className="py-3 px-4 text-center text-sm">
                  {patient.phone1}
                </td>
                <td className="py-3 px-4 text-center text-sm">
                  {patient.phone2}
                </td>
                <td className="py-3 px-4 text-center text-sm">
                  {patient.birthdate}
                </td>
                <td className="py-3 px-4 text-center text-sm">
                  {patient.nationalId}
                </td>
                <td className="py-3 px-4 text-center text-sm">
                  <button className="bg-bgBtnPurple text-white px-3 py-1 rounded-md transition duration-200 hover:bg-bgBtnPurpleHover text-sm">
                    {patient.actions}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="mt-4 flex justify-between">
          <span className="text-sm text-gray-500">
            Showing 1 to 10 of {patients.length} patients
          </span>
          <div className="flex gap-2">
            <button className="bg-bgBtnPurple text-white px-4 py-1 rounded-md transition duration-200 hover:bg-bgBtnPurpleHover">
              Previous
            </button>
            <button className="bg-bgBtnPurple text-white px-4 py-1 rounded-md transition duration-200 hover:bg-bgBtnPurpleHover">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPatient;
