import AnimatedButton from "@/components/form/AnimatedButton";
import AnimatedInput from "@/components/form/AnimatedInput";
import { axiosInstance } from "@/utils/axiosInstance";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

export interface Patient {
  firstName: string;
  lastName: string;
  email?: string;
  expectedDeliveryDate: string;
  phone: string;
  bloodGroup: string;
  maritalStatus: string;
  emergencyContactFullName: string;
  emergencyContactNumber: string;
  emergencyContactRelationship: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
}

const patientSchema = z.object({
  firstName: z.string().nonempty("First name is required"),
  lastName: z.string().nonempty("Last name is required"),
  email: z.string().email("Invalid email").optional(),
  expectedDeliveryDate: z.string().nonempty("Expected delivery date is required"),
  phone: z.string().nonempty("Phone number is required"),
  bloodGroup: z.string().nonempty("Blood group is required"),
  maritalStatus: z.string().nonempty("Marital status is required"),
  emergencyContactFullName: z.string().nonempty("Emergency contact name is required"),
  emergencyContactNumber: z.string().nonempty("Emergency contact number is required"),
  emergencyContactRelationship: z.string().nonempty("Emergency contact relationship is required"),
  district: z.string().nonempty("District is required"),
  sector: z.string().nonempty("Sector is required"),
  cell: z.string().nonempty("Cell is required"),
  village: z.string().nonempty("Village is required"),
});

type PatientFormData = z.infer<typeof patientSchema>;

const AddParent = (): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
  });

  const navigate = useNavigate();

  const onSubmit = async (data: PatientFormData) => {
    try {
      await axiosInstance.post("/api/v1/patients", data);
      toast.success("Patient added successfully!");
      navigate("/patients");
    } catch (error: any) {
      console.error(error);
      toast.error(`Failed to add patient: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Mother</h1>
          <p className="text-gray-600 max-w-md mx-auto">Fill in the Mother information below</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-8 rounded-2xl shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatedInput
              label="First Name"
              placeholder="Alice"
              error={errors.firstName?.message}
              {...register("firstName")}
            />
            <AnimatedInput
              label="Last Name"
              placeholder="Smith"
              error={errors.lastName?.message}
              {...register("lastName")}
            />
            <AnimatedInput
              label="Email"
              type="email"
              placeholder="alice.smith@gmail.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <AnimatedInput
              label="Phone"
              placeholder="+1234567890"
              error={errors.phone?.message}
              {...register("phone")}
            />
            <AnimatedInput
              label="Expected Delivery Date"
              type="date"
              error={errors.expectedDeliveryDate?.message}
              {...register("expectedDeliveryDate")}
            />
            <AnimatedInput
              label="Blood Group"
              placeholder="O+"
              error={errors.bloodGroup?.message}
              {...register("bloodGroup")}
            />
            <AnimatedInput
              label="Marital Status"
              placeholder="Single"
              error={errors.maritalStatus?.message}
              {...register("maritalStatus")}
            />
            <AnimatedInput
              label="Emergency Contact Name"
              placeholder="John Smith"
              error={errors.emergencyContactFullName?.message}
              {...register("emergencyContactFullName")}
            />
            <AnimatedInput
              label="Emergency Contact Number"
              placeholder="+0987654321"
              error={errors.emergencyContactNumber?.message}
              {...register("emergencyContactNumber")}
            />
            <AnimatedInput
              label="Emergency Contact Relationship"
              placeholder="Husband"
              error={errors.emergencyContactRelationship?.message}
              {...register("emergencyContactRelationship")}
            />
            <AnimatedInput
              label="District"
              placeholder="Kigali"
              error={errors.district?.message}
              {...register("district")}
            />
            <AnimatedInput
              label="Sector"
              placeholder="Gasabo"
              error={errors.sector?.message}
              {...register("sector")}
            />
            <AnimatedInput
              label="Cell"
              placeholder="Kacyiru"
              error={errors.cell?.message}
              {...register("cell")}
            />
            <AnimatedInput
              label="Village"
              placeholder="Umudugudu A"
              error={errors.village?.message}
              {...register("village")}
            />
          </div>

          <div className="mt-6 flex gap-4">
            <AnimatedButton type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-lg">
              Add Patient
            </AnimatedButton>
        
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddParent;
