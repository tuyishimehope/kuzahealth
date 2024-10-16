import Button from "../../components/Button";
import Input from "../../components/Input";
import { useState } from "react";

const AddSchedule = () => {
  const [formData, setFormData] = useState({
    patientName: "",
    phoneNumber: "",
    reason: "",
    appointmentDate: "",
    scheduleTime: "",
    patientLocation: "",
    communicationMode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };
  return (
    <div className="flex flex-col min-h-screen items-center p-6">
      <p className="text-2xl underline pb-10">Add Schedule</p>
      <form className="space-y-4 w-full max-w-md" onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-2">
          <label htmlFor="patientName">Patient Names</label>
          <Input
            type="text"
            placeholder="Enter patient name"
            className="px-2 py-2 border-2 border-slate-200 placeholder:text-slate-400"
            value={formData.patientName}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="phoneNumber">Phone Number</label>
          <Input
            type="text"
            placeholder="Enter phone number"
            className="px-2 py-2 border-2 border-slate-200 placeholder:text-slate-400"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="reason">Reason/Subject</label>
          <Input
            type="text"
            placeholder="Enter reason"
            className="px-2 py-2 border-2 border-slate-200 placeholder:text-slate-400"
            value={formData.reason}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="appointmentDate">Appointment Date</label>
          <Input
            type="date"
            className="px-2 py-2 border-2 border-slate-200 placeholder:text-slate-400"
            value={formData.appointmentDate}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="scheduleTime">Schedule Time</label>
          <Input
            type="time"
            className="px-2 py-2 border-2 border-slate-200 placeholder:text-slate-400"
            value={formData.scheduleTime}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="patientLocation">Patient Location</label>
          <Input
            type="text"
            placeholder="Enter patient location"
            className="px-2 py-2 border-2 border-slate-200 placeholder:text-slate-400"
            value={formData.patientLocation}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label>Mode of Communication</label>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Input
                type="radio"
                value="phone"
                className="mr-2"
                onChange={handleChange}
              />
              <label htmlFor="phone">Phone Call</label>
            </div>
            <div className="flex items-center">
              <Input
                type="radio"
                value="faceToFace"
                className="mr-2"
                onChange={handleChange}
              />
              <label htmlFor="faceToFace">Face to Face</label>
            </div>
          </div>
        </div>
        <Button
          name="Submit"
          className="bg-btnSignIn text-white hover:text-white px-6 py-3 w-full mt-6 rounded-full"
        />
      </form>
    </div>
  );
};

export default AddSchedule;
