import { axiosInstance } from "@/utils/axiosInstance";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FaInfoCircle } from "react-icons/fa";
import { IoChevronForwardOutline, IoSaveOutline } from "react-icons/io5";
import { z } from "zod";

// Define Zod schema for form validation
const motherSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().optional(),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[0-9\s-()]+$/, "Invalid phone number format"),
  bloodGroup: z
    .string()
    .min(1, "Blood group is required")
    .refine(
      (val) => ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(val),
      {
        message: "Invalid blood group",
      }
    ),
  expectedDeliveryDate: z.string().min(6, "Enter expected deliver date"),
  isHighRisk: z.boolean().optional(),
  maritalStatus: z.string().min(6, "Status"),
  emergencyContactFullName: z
    .string()
    .min(1, "Emergency contact name is required"),
  emergencyContactRelationship: z.string().min(1, "Relationship is required"),
  emergencyContactNumber: z
    .string()
    .min(1, "Emergency contact phone is required")
    .regex(/^\+?[0-9\s-()]+$/, "Invalid phone number format"),
  district: z.string().min(1, "District is required"),
  sector: z.string().min(1, "Sector is required"),
  cell: z.string().min(1, "Cell is required"),
  village: z.string().min(1, "Village is required"),
});

// Define type from schema
type MotherFormData = z.infer<typeof motherSchema>;

const AddMotherForm: React.FC = () => {
  // Initialize form with react-hook-form and zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading, isSubmitSuccessful, isSubmitting },
    reset,
  } = useForm<MotherFormData>({
    resolver: zodResolver(motherSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      bloodGroup: "",
      maritalStatus: "",
      expectedDeliveryDate: "",
      isHighRisk: false,
      emergencyContactFullName: "",
      emergencyContactRelationship: "",
      emergencyContactNumber: "",
      district: "",
      sector: "",
      cell: "",
      village: "",
    },
  });
  const { t } = useTranslation();
  // Blood group options
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Handle form submission
  const onSubmit = async (data: MotherFormData) => {
    try {
      const response = await axiosInstance.post("api/parents/register", data);

      console.log("Form data submitted:", data);
      console.log("response", response);
      if (response.status === 200 || response.status === 201) {
        reset();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      console.log("");
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
    placeholder = "",
  }: {
    label: string;
    name: keyof MotherFormData;
    type?: string;
    register: any;
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
        <h1 className="text-2xl font-bold text-purple-800">
          {t("motherForm.title")}
        </h1>
        <div className="ml-4 flex items-center text-gray-500 text-sm">
          <span>{t("motherForm.breadcrumb.management")}</span>
          <IoChevronForwardOutline className="mx-1" />
          <span className="text-purple-600">
            {t("motherForm.breadcrumb.addMother")}
          </span>
        </div>
      </div>

      {isSubmitSuccessful && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-green-100 text-green-700 p-4 rounded-md flex items-center"
        >
          <IoSaveOutline size={20} className="mr-2" />
          {t("motherForm.success")}
        </motion.div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-x-6"
      >
        {/* Section: Personal Info */}
        <div className="md:col-span-2 p-4 bg-purple-50 rounded-md mb-6">
          <h2 className="text-lg font-semibold text-purple-700 mb-4">
            {t("motherForm.sections.personalInfo")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <FormInput
              label={t("motherForm.labels.email")}
              name="email"
              register={register}
              error={errors.email?.message}
              placeholder={t("motherForm.placeholders.email")}
            />
            <FormInput
              label={t("motherForm.labels.bloodGroup")}
              name="bloodGroup"
              register={register}
              error={errors.bloodGroup?.message}
              options={bloodGroups}
            />
            <FormInput
              label={t("motherForm.labels.firstName")}
              name="firstName"
              register={register}
              error={errors.firstName?.message}
              placeholder={t("motherForm.placeholders.firstName")}
            />
            <FormInput
              label={t("motherForm.labels.lastName")}
              name="lastName"
              register={register}
              error={errors.lastName?.message}
              placeholder={t("motherForm.placeholders.lastName")}
            />
            <FormInput
              label={t("motherForm.labels.phone")}
              name="phone"
              register={register}
              error={errors.phone?.message}
              placeholder={t("motherForm.placeholders.phone")}
            />
            <FormInput
              label={t("motherForm.labels.maritalStatus")}
              name="maritalStatus"
              register={register}
              error={errors.maritalStatus?.message}
              placeholder={t("motherForm.placeholders.maritalStatus")}
            />
            <FormInput
              label={t("motherForm.labels.expectedDeliveryDate")}
              name="expectedDeliveryDate"
              register={register}
              error={errors.expectedDeliveryDate?.message}
              placeholder={t("motherForm.placeholders.expectedDeliveryDate")}
            />
            <FormInput
              label={t("motherForm.labels.isHighRisk")}
              name="isHighRisk"
              register={register}
              error={errors.isHighRisk?.message}
            />
          </div>
        </div>

        {/* Section: Emergency Contact */}
        <div className="md:col-span-2 p-4 bg-purple-50 rounded-md mb-6">
          <h2 className="text-lg font-semibold text-purple-700 mb-4">
            {t("motherForm.sections.emergencyContact")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <FormInput
              label={t("motherForm.labels.emergencyContactFullName")}
              name="emergencyContactFullName"
              register={register}
              error={errors.emergencyContactFullName?.message}
              placeholder={t("motherForm.placeholders.firstName")}
            />
            <FormInput
              label={t("motherForm.labels.emergencyContactRelationship")}
              name="emergencyContactRelationship"
              register={register}
              error={errors.emergencyContactRelationship?.message}
              placeholder={t(
                "motherForm.placeholders.emergencyContactRelationship"
              )}
            />
            <FormInput
              label={t("motherForm.labels.emergencyContactNumber")}
              name="emergencyContactNumber"
              register={register}
              error={errors.emergencyContactNumber?.message}
              placeholder={t("motherForm.placeholders.phone")}
            />
          </div>
        </div>

        {/* Section: Location Info */}
        <div className="md:col-span-2 p-4 bg-purple-50 rounded-md mb-6">
          <h2 className="text-lg font-semibold text-purple-700 mb-4">
            {t("motherForm.sections.locationInfo")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <FormInput
              label={t("motherForm.labels.district")}
              name="district"
              register={register}
              error={errors.district?.message}
              placeholder={t("motherForm.placeholders.district")}
            />
            <FormInput
              label={t("motherForm.labels.sector")}
              name="sector"
              register={register}
              error={errors.sector?.message}
              placeholder={t("motherForm.placeholders.sector")}
            />
            <FormInput
              label={t("motherForm.labels.cell")}
              name="cell"
              register={register}
              error={errors.cell?.message}
              placeholder={t("motherForm.placeholders.cell")}
            />
            <FormInput
              label={t("motherForm.labels.village")}
              name="village"
              register={register}
              error={errors.village?.message}
              placeholder={t("motherForm.placeholders.village")}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="md:col-span-2 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className={`px-8 py-3 rounded-md font-medium flex items-center ${
              isLoading
                ? "bg-purple-300 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            } text-white transition-colors duration-200`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {t("motherForm.actions.processing")}
              </>
            ) : (
              <>
                <IoSaveOutline className="mr-2" size={20} />
                {t("motherForm.actions.save")}
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default AddMotherForm;
