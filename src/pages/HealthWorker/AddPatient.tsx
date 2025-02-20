import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { toast } from "react-toastify"; // Import toast for notifications
import "react-toastify/dist/ReactToastify.css"; // Import styles for react-toastify

// Zod schema for form validation
const schema = z.object({
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  expected_delivery_date: z
    .string()
    .min(1, { message: "Expected delivery date is required" }),
  is_high_risk: z.boolean(),
});

type ParentFormData = z.infer<typeof schema>;

const AddPatient = () => {
  const [loading, setLoading] = useState(false); // State to manage loading spinner

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ParentFormData>({
    resolver: zodResolver(schema), // Integrate Zod with React Hook Form
  });
  const url = import.meta.env.VITE_BASE_URL;
  // Handle form submission
  const onSubmit = async (data: ParentFormData) => {
    setLoading(true); // Show the loading spinner

    try {
      const response = await fetch(`${url}/api/parents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit the form");
      }

      const result = await response.json();
      console.log("Form submitted successfully:", result);

      // Show success toast notification
      toast.success("Patient registered successfully!");
      reset();

      // Handle success (e.g., show a success message or redirect)
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error submitting form, please try again.");
      // Handle error (e.g., show an error message)
    } finally {
      setLoading(false); // Hide the loading spinner
    }
  };

  const patientFields: {
    label: string;
    placeholder?: string;
    name: keyof ParentFormData; // Ensures correct type
    type: "text" | "email" | "checkbox";
  }[] = [
    {
      label: "First Name",
      placeholder: "Enter first name",
      name: "first_name",
      type: "text",
    },
    {
      label: "Last Name",
      placeholder: "Enter last name",
      name: "last_name",
      type: "text",
    },
    {
      label: "Email",
      placeholder: "Enter email",
      name: "email",
      type: "email",
    },
    {
      label: "Phone Number",
      placeholder: "Enter phone number",
      name: "phone",
      type: "text",
    },
    {
      label: "Address",
      placeholder: "Enter address",
      name: "address",
      type: "text",
    },
    {
      label: "Expected Delivery Date",
      placeholder: "Enter expected delivery date",
      name: "expected_delivery_date",
      type: "text",
    },
    { label: "Is High Risk", name: "is_high_risk", type: "checkbox" },
  ];

  return (
    <div className="flex flex-col min-h-screen items-center bg-gray-50 py-2">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Register Patient
      </h1>
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {patientFields.map((field, index) => (
            <div key={index} className="flex flex-col space-y-1">
              <label className="text-sm font-semibold text-gray-600">
                {field.label}
              </label>
              {field.type === "checkbox" ? (
                <input
                  type="checkbox"
                  {...register(field.name)}
                  className="h-4 w-4 text-purple-500 border-gray-300 rounded focus:ring-2 focus:ring-purple-400"
                />
              ) : (
                <Input
                  type={field.type}
                  {...register(field.name)}
                  placeholder={field.placeholder}
                  className="px-4 py-3 border border-gray-300 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-150"
                />
              )}
              {errors[field.name] && (
                <span className="text-red-500 text-sm">
                  {errors[field.name as keyof ParentFormData]?.message}
                </span>
              )}
            </div>
          ))}
          <Button
            name={
              loading ? (
                <span className="animate-spin">Submitting...</span>
              ) : (
                "Submit"
              )
            }
            className="bg-btnSignIn text-white hover:bg-purple-600 transition duration-150 px-6 py-3 w-full mt-6 rounded-full shadow-md"
            disabled={loading}
          />
        </form>
      </div>
    </div>
  );
};

// Toast container to show notifications globally
export const ToastContainer = () => (
  <div>
    <ToastContainer />
  </div>
);

export default AddPatient;
