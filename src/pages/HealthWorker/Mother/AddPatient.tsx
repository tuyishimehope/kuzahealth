import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { IoChevronForwardOutline, IoSaveOutline } from "react-icons/io5";
import { FaInfoCircle } from "react-icons/fa";

// Define Zod schema for form validation
const motherSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[0-9\s-()]+$/, "Invalid phone number format"),
  bloodGroup: z
    .string()
    .min(1, "Blood group is required")
    .refine((val) => ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(val), {
      message: "Invalid blood group",
    }),
  emergencyContactName: z.string().min(1, "Emergency contact name is required"),
  emergencyContactRelation: z.string().min(1, "Relationship is required"),
  emergencyContactPhone: z
    .string()
    .min(1, "Emergency contact phone is required")
    .regex(/^\+?[0-9\s-()]+$/, "Invalid phone number format"),
  address: z.string().min(1, "Address is required"),
  district: z.string().min(1, "District is required"),
  sector: z.string().min(1, "Sector is required"),
  cell: z.string().min(1, "Cell is required"),
  village: z.string().min(1, "Village is required"),
});

// Define type from schema
type MotherFormData = z.infer<typeof motherSchema>;

const AddMotherForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Initialize form with react-hook-form and zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MotherFormData>({
    resolver: zodResolver(motherSchema),
    defaultValues: {
      patientId: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      bloodGroup: "",
      emergencyContactName: "",
      emergencyContactRelation: "",
      emergencyContactPhone: "",
      address: "Kigali, Rwanda", // Default value
      district: "",
      sector: "",
      cell: "",
      village: "",
    },
  });

  // Blood group options
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Handle form submission
  const onSubmit = async (data: MotherFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      console.log("Form data submitted:", data);
      
      // Show success message
      setSubmitSuccess(true);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        reset();
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Custom form input component
  const FormInput = ({ 
    label, 
    name, 
    type = "text", 
    register, 
    error, 
    options = null,
    placeholder = ""
  }: {
    label: string;
    name: keyof MotherFormData;
    type?: string;
    register:  any ;
    error?: string;
    options?: string[] | null;
    placeholder?: string;
  }) => (
    <div className="mb-4">
      <label htmlFor={name} className="block text-gray-700 font-medium mb-1">
        {label}:
      </label>
      
      {options ? (
        <select
          id={name}
          {...register(name)}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          {...register(name)}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <FaInfoCircle className="mr-1" size={14} />
          {error}
        </p>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold text-purple-800">Add Mother</h1>
        <div className="ml-4 flex items-center text-gray-500 text-sm">
          <span>Patient Management</span>
          <IoChevronForwardOutline className="mx-1" />
          <span className="text-purple-600">Add Mother</span>
        </div>
      </div>

      {submitSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-green-100 text-green-700 p-4 rounded-md flex items-center"
        >
          <IoSaveOutline size={20} className="mr-2" />
          Patient information has been successfully saved!
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <div className="md:col-span-2 p-4 bg-purple-50 rounded-md mb-6">
          <h2 className="text-lg font-semibold text-purple-700 mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <FormInput
              label="ID"
              name="patientId"
              register={register}
              error={errors.patientId?.message}
              placeholder="Patient ID"
            />
            <FormInput
              label="Blood Group"
              name="bloodGroup"
              register={register}
              error={errors.bloodGroup?.message}
              options={bloodGroups}
            />
            <FormInput
              label="First Name"
              name="firstName"
              register={register}
              error={errors.firstName?.message}
              placeholder="First name"
            />
            <FormInput
              label="Last Name"
              name="lastName"
              register={register}
              error={errors.lastName?.message}
              placeholder="Last name"
            />
            <FormInput
              label="Phone Number"
              name="phoneNumber"
              register={register}
              error={errors.phoneNumber?.message}
              placeholder="+250 XXXXXXXX"
            />
          </div>
        </div>

        <div className="md:col-span-2 p-4 bg-purple-50 rounded-md mb-6">
          <h2 className="text-lg font-semibold text-purple-700 mb-4">Emergency Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <FormInput
              label="Emergency Contact Full Name"
              name="emergencyContactName"
              register={register}
              error={errors.emergencyContactName?.message}
              placeholder="Full name"
            />
            <FormInput
              label="Emergency Contact Relation"
              name="emergencyContactRelation"
              register={register}
              error={errors.emergencyContactRelation?.message}
              placeholder="e.g., Spouse, Parent, Sibling"
            />
            <FormInput
              label="Emergency Contact Phone Number"
              name="emergencyContactPhone"
              register={register}
              error={errors.emergencyContactPhone?.message}
              placeholder="+250 XXXXXXXX"
            />
          </div>
        </div>

        <div className="md:col-span-2 p-4 bg-purple-50 rounded-md mb-6">
          <h2 className="text-lg font-semibold text-purple-700 mb-4">Location Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <div className="md:col-span-2">
              <FormInput
                label="Address"
                name="address"
                register={register}
                error={errors.address?.message}
                placeholder="Full address"
              />
            </div>
            <FormInput
              label="District"
              name="district"
              register={register}
              error={errors.district?.message}
              placeholder="e.g., Kicukiro"
            />
            <FormInput
              label="Sector"
              name="sector"
              register={register}
              error={errors.sector?.message}
              placeholder="e.g., Nyarugunga"
            />
            <FormInput
              label="Cell"
              name="cell"
              register={register}
              error={errors.cell?.message}
              placeholder="e.g., Nonko"
            />
            <FormInput
              label="Village"
              name="village"
              register={register}
              error={errors.village?.message}
              placeholder="e.g., Kavumu"
            />
          </div>
        </div>

        <div className="md:col-span-2 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className={`px-8 py-3 rounded-md font-medium flex items-center ${
              isSubmitting
                ? "bg-purple-300 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            } text-white transition-colors duration-200`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <IoSaveOutline className="mr-2" size={20} />
                Save
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default AddMotherForm;