import Button from "../../components/Button";

const ViewSchedule = () => {
  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-6 flex justify-between">
        <h1 className="text-3xl font-bold mb-2">View Schedule</h1>
        <div className="flex flex-col md:flex-row md:items-center">
          <input
            type="text"
            placeholder="Search..."
            className="border border-gray-300 rounded-lg p-2 mb-4 md:mb-0 md:mr-2 w-full md:w-1/3"
          />
          <Button
            name="Search"
            className="bg-bgBtnPurple text-white px-4 py-2 rounded-lg"
          />
        </div>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Card for Appointments */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Appointments</h2>
          <p className="text-gray-600">View all upcoming appointments.</p>
          <Button
            name="View Appointments"
            className="mt-2 bg-bgBtnPurple text-white px-4 py-2 rounded-lg"
          />
        </div>

        {/* Card for Review Reports */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Review Reports</h2>
          <p className="text-gray-600">Access patient review reports.</p>
          <Button
            name="View Reports"
            className="mt-2 bg-bgBtnPurple text-white px-4 py-2 rounded-lg"
          />
        </div>

        {/* Card for Update Info */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Update Info</h2>
          <p className="text-gray-600">Update your schedule information.</p>
          <Button
            name="Update Info"
            className="mt-2 bg-bgBtnPurple text-white px-4 py-2 rounded-lg"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Full Names
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Appointment Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Example Row */}
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">John Doe</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2024-10-18</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Kigali</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Confirmed</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <Button
                  name="Edit"
                  className="bg-bgBtnPurple text-white px-4 py-1 rounded-lg"
                />
              </td>
            </tr>
            {/* More rows can be added here */}
          </tbody>
        </table>
        {/* Pagination can be added here */}
        <div className="p-4 flex justify-between">
          <span className="text-gray-600">Showing 1 to 10 of 50 entries</span>
          <div>
            <Button name="Previous" className="bg-bgBtnPurple text-white px-4 py-2 rounded-lg" />
            <Button name="Next" className="bg-bgBtnPurple text-white px-4 py-2 rounded-lg ml-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSchedule;
