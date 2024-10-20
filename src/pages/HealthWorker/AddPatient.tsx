import Button from "../../components/Button";
import Input from "../../components/Input";

const AddPatient = () => {
  return (
    <div className="flex flex-col min-h-screen items-center bg-gray-50 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Register Patient</h1>
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">

        <div className="space-y-4">
          {["First Name", "Middle Name", "Last Name", "District", "Sector", "Address", "Phone Number", "Email"].map((field, index) => (
            <div key={index} className="flex flex-col space-y-1">
              <label className="text-sm font-semibold text-gray-600">{field}</label>
              <Input
                type="text"
                placeholder={`Enter ${field.toLowerCase()}`}
                className="px-4 py-3 border border-gray-300 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-150"
              />
            </div>
          ))}
        </div>
        

        <Button 
          name="Submit" 
          className="bg-btnSignIn text-white hover:bg-purple-600 transition duration-150 px-6 py-3 w-full mt-6 rounded-full shadow-md"
        />
      </div>
    </div>
  );
};

export default AddPatient;
