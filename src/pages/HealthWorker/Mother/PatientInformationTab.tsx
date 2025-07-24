import { Card } from "@mantine/core";
import { Separator } from "@radix-ui/react-separator";
import type { Patient } from "./ViewPatient";
import { Label } from "recharts";

// Reusable field component
const Field = ({ label, value }: { label: string; value: string }) => (
  <div>
    <Label className="text-muted-foreground">{label}</Label>
    <p className="mt-1">{value || "—"}</p>
  </div>
);

export const PatientInformationTab = ({ patient }: { patient: Patient }) => {
  return (
    <Card className="p-6 space-y-8">
      {/* Personal Details */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="First Name" value={patient.firstName} />
          <Field label="Last Name" value={patient.lastName} />
          <Field label="Email" value={patient.email || ""} />
          <Field label="Phone" value={patient.phone} />
        </div>
      </section>

      <Separator />

      {/* Pregnancy Info */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Pregnancy Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Expected Delivery Date"
            value={new Date(patient.expectedDeliveryDate).toLocaleDateString()}
          />
          <Field label="Blood Group" value={patient.bloodGroup} />
          <Field label="Marital Status" value={patient.maritalStatus} />
        </div>
      </section>

      <Separator />

      {/* Emergency Contact */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Emergency Contact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Contact Name"
            value={patient.emergencyContactFullName}
          />
          <Field
            label="Relationship"
            value={patient.emergencyContactRelationship}
          />
          <Field label="Phone" value={patient.emergencyContactNumber} />
        </div>
      </section>

      <Separator />

      {/* Location */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Location</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="District" value={patient.district} />
          <Field label="Sector" value={patient.sector} />
          <Field label="Cell" value={patient.cell} />
          <Field label="Village" value={patient.village} />
        </div>
      </section>
    </Card>
  );
};
