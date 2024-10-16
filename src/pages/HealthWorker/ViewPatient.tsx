import { useState } from "react";

const ViewPatient = () => {
  const [patients] = useState([
    // Sample data (replace this with real data)
    { profile: "profile1.png", name: "Alice Johnson", phone1: "+250 123456789", phone2: "+250 987654321", birthdate: "1990-01-01", nationalId: "123456789", actions: "View/Edit" },
    { profile: "profile2.png", name: "Bob Smith", phone1: "+250 123456789", phone2: "+250 987654321", birthdate: "1985-05-12", nationalId: "987654321", actions: "View/Edit" },
    // Add more patient data as needed
  ]);
  
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center text-primaryColor">View Patients</h1>
      
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
                  <img src={patient.profile} alt="Profile" className="w-12 h-12 rounded-full mx-auto" />
                </td>
                <td className="py-3 px-4 text-center">{patient.name}</td>
                <td className="py-3 px-4 text-center">{patient.phone1}</td>
                <td className="py-3 px-4 text-center">{patient.phone2}</td>
                <td className="py-3 px-4 text-center">{patient.birthdate}</td>
                <td className="py-3 px-4 text-center">{patient.nationalId}</td>
                <td className="py-3 px-4 text-center">
                  <button className="bg-bgBtnPurple text-white px-3 py-1 rounded-md transition duration-200 hover:bg-bgBtnPurpleHover">
                    {patient.actions}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="mt-4 flex justify-between">
          <span className="text-sm text-gray-500">Showing 1 to 10 of {patients.length} patients</span>
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
