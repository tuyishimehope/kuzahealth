import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { axiosInstance } from "@/utils/axiosInstance";
import {
  Affix,
  Avatar,
  Badge,
  Box,
  Button,
  Group,
  Paper,
  Select,
  SimpleGrid,
  Tabs,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";
import {
  IconArrowRight,
  IconBabyCarriage,
  IconCalendar,
  IconChartBar,
  IconEdit,
  IconId,
  IconUserCircle,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { showNotification } from "@mantine/notifications";

// import { useNavigate } from 'react-router-dom';

// Extend the Patient type to include children
type Patient = {
  id: string;
  name?: string;
  status?: string;
  lastVisit?: string;
  birthdate?: string;
  nationalId?: string;
  phone1?: string;
  phone2?: string;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  expectedDeliveryDate: string;
  bloodGroup: string;
  maritalStatus: string;
  emergencyContactNumber: string;
  emergencyContactFullName: string;
  emergencyContactRelationship: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  pregnancyRecord: [];
  highRisk: false;
  children?: Child[]; // Add children array
};

// Define Child type
type Child = {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  deliveryDate: string;
  birthWeight: string;
  birthHeight: string;
  birthTime: string;
  deliveryLocation: string;
  assignedDoctor: string;
};

// Rest of the existing components...

// New Child Form Component

const childSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.enum(["male", "female", "other"]),
  deliveryDate: z.string().min(1, "Delivery date is required"),
  birthWeight: z.string().optional(),
  birthHeight: z.string().optional(),
  birthTime: z.string().optional(),
  deliveryLocation: z.string().optional(),
  assignedDoctor: z.string().optional(),
});

type ChildFormData = z.infer<typeof childSchema>;

const AddChildForm = ({
  motherLastName,
  onAddChild,
  onCancel,
}: {
  motherLastName: string;
  onAddChild: (data: ChildFormData) => void;
  onCancel: () => void;
}) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChildFormData>({
    resolver: zodResolver(childSchema),
    defaultValues: {
      lastName: motherLastName,
    },
  });

  const onSubmit = (data: ChildFormData) => {
    onAddChild(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        label="First Name"
        {...register("firstName")}
        error={errors.firstName?.message}
      />
      <TextInput
        label="Last Name"
        {...register("lastName")}
        error={errors.lastName?.message}
      />

      <Controller
        name="gender"
        control={control} // make sure you get this from useForm()
        render={({ field }) => (
          <Select
            label="Gender"
            data={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
            {...field}
            error={errors.gender?.message}
          />
        )}
      />

      <TextInput
        type="date"
        label="Delivery Date"
        {...register("deliveryDate")}
        error={errors.deliveryDate?.message}
      />

      <TextInput label="Birth Weight (kg)" {...register("birthWeight")} />
      <TextInput label="Birth Height (cm)" {...register("birthHeight")} />
      <TextInput label="Birth Time" type="time" {...register("birthTime")} />
      <TextInput label="Delivery Location" {...register("deliveryLocation")} />
      <TextInput label="Assigned Doctor" {...register("assignedDoctor")} />

      <Group position="right" mt="lg">
        <Button
          variant="outline"
          type="button"
          onClick={() => {
            reset();
            onCancel();
          }}
        >
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </Group>
    </form>
  );
};

// Child record display component
const ChildRecord = ({ child }: { child: Child }) => {
  return (
    <Paper
      p="md"
      mb="md"
      radius="md"
      shadow="xs"
      withBorder
      sx={{ backgroundColor: "#fefefe" }}
    >
      <Group position="apart">
        <Group spacing="xs">
          <Avatar size="lg" radius="xl" color="grape">
            {child.firstName.charAt(0)}
          </Avatar>
          <Box>
            <Text size="lg" weight={600}>
              {child.firstName} {child.lastName}
            </Text>
            <Text size="sm" color="dimmed">
              Born on: {new Date(child.deliveryDate).toLocaleDateString()}
            </Text>
          </Box>
        </Group>
        <Badge size="lg" color={child.gender === "FEMALE" ? "pink" : "blue"}>
          {child.gender}
        </Badge>
      </Group>

      <SimpleGrid cols={2} mt="md" spacing="xs">
        {child.birthWeight && (
          <Text size="sm">
            <b>Weight:</b> {child.birthWeight} kg
          </Text>
        )}
        {child.birthHeight && (
          <Text size="sm">
            <b>Height:</b> {child.birthHeight} cm
          </Text>
        )}
        {child.birthTime && (
          <Text size="sm">
            <b>Time:</b> {child.birthTime}
          </Text>
        )}
        {child.deliveryLocation && (
          <Text size="sm">
            <b>Location:</b> {child.deliveryLocation}
          </Text>
        )}
      </SimpleGrid>
    </Paper>
  );
};

// Updated PatientDetailPage with Children Tab
const PatientDetailPage = ({
  patient,
  onBack,
}: {
  patient: Patient;
  onBack: () => void;
}) => {
  const theme = useMantineTheme();
  // const navigate = useNavigate();

  // State for children records

  const [showAddForm, setShowAddForm] = useState(false);
  const [children, setChildren] = useState<Child[]>([]);
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [loading, setLoading] = useState(false);
  const params = useParams();

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/infants/mother/${patient.id}`
        );
        setChildren(response.data || []);
      } catch (error) {
        console.error("Failed to fetch children:", error);
      } finally {
        setLoadingChildren(false);
      }
    };

    fetchChildren();
  }, [patient.id]);

  const handleAddChild = async (formData: ChildFormData) => {
    const { id: motherId } = params;

    setLoading(true); // you can create a state: const [loading, setLoading] = useState(false)

    try {
      const response = await axiosInstance.post(`/api/infants`, {
        ...formData,
        motherId, // assuming the backend needs the motherId
      });

      const newChild = response.data;

      // Update state with new child
      setChildren((prev) => [...prev, newChild]);

      // Feedback
      showNotification({
        title: "Success",
        message: "Child added successfully",
        color: "green",
      });

      // Close form
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding child:", error);

      showNotification({
        title: "Error",
        message: "Failed to add child. Please try again.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      p="md"
      sx={{
        background: theme.fn.linearGradient(45, "#f6f9fc", "#edf2f7"),
        minHeight: "100vh",
      }}
    >
      <Box mb="xl" maw={1000} mx="auto">
        <Group position="apart" mb="lg">
          <Button
            variant="subtle"
            leftIcon={
              <IconArrowRight style={{ transform: "rotate(180deg)" }} />
            }
            onClick={onBack}
          >
            Back to Patient List
          </Button>
          <Button
            variant="light"
            leftIcon={<IconEdit size={16} />}
            color="blue"
          >
            Edit Patient
          </Button>
        </Group>

        <Card>
          <Group position="apart" mb="xl" align="start">
            <Group>
              <Avatar size={80} radius={80} color="blue" sx={{ fontSize: 32 }}>
                {/* {patient.name.charAt(0)} */}
              </Avatar>
              <Box>
                <Title order={2}>{patient.name}</Title>
                <Group spacing="xs">
                  <Badge
                    variant="filled"
                    color="indigo"
                    leftSection={<IconId size={14} />}
                  >
                    {patient.id}
                  </Badge>
                  {/* <StatusBadge status={patient.status} /> */}
                </Group>
              </Box>
            </Group>

            <Box>
              <Text size="sm" color="dimmed">
                Last Visit
              </Text>
              <Text fw={500}>
                {/* {new Date(patient.lastVisit).toLocaleDateString()} */}
              </Text>
            </Box>
          </Group>

          <Tabs defaultValue="information">
            <Tabs.List mb="md">
              <Tabs.Tab value="information" icon={<IconUserCircle size={16} />}>
                Patient Information
              </Tabs.Tab>
              <Tabs.Tab value="medical" icon={<IconChartBar size={16} />}>
                Medical History
              </Tabs.Tab>
              <Tabs.Tab value="appointments" icon={<IconCalendar size={16} />}>
                Appointment History
              </Tabs.Tab>
              {/* New Tab for Children */}
              <Tabs.Tab value="children" icon={<IconBabyCarriage size={16} />}>
                Children
              </Tabs.Tab>
            </Tabs.List>

            {/* Existing Tab Panels */}
            <Tabs.Panel value="information">
              <PatientInformationTab patient={patient} />
            </Tabs.Panel>

            <Tabs.Panel value="medical">
              <Text color="dimmed" align="center">
                Medical history information would appear here.
              </Text>
            </Tabs.Panel>

            <Tabs.Panel value="appointments">
              <Text color="dimmed" align="center">
                Appointment history would appear here.
              </Text>
            </Tabs.Panel>

            {/* New Children Tab Panel */}
            <Tabs.Panel value="children">
              <Affix position={{ bottom: 20, right: 20 }}>
                <Button
                  leftIcon={<IconBabyCarriage />}
                  color="green"
                  onClick={() => setShowAddForm(true)}
                  disabled={loading}
                >
                  Add Child
                </Button>
              </Affix>

              {loadingChildren ? (
                <Text align="center" color="dimmed">
                  Loading children...
                </Text>
              ) : children.length === 0 ? (
                <Text align="center" color="dimmed">
                  No children found for this patient.
                </Text>
              ) : (
                children.map((child) => (
                  <ChildRecord key={child.id} child={child} />
                ))
              )}
              {showAddForm && (
                <Paper p="md" mt="md" shadow="xs" withBorder radius="md">
                  <Title order={4} mb="sm">
                    Add Child Record
                  </Title>
                  <AddChildForm
                    motherLastName={patient.lastName}
                    onAddChild={handleAddChild}
                    onCancel={() => setShowAddForm(false)}
                  />
                </Paper>
              )}
            </Tabs.Panel>
          </Tabs>
        </Card>
      </Box>
    </Box>
  );
};

export const PatientInformationTab = ({ patient }: { patient: Patient }) => {
  return (
    <Card className="p-6 space-y-8">
      {/* Personal Details */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="First Name" value={patient.firstName} />
          <Field label="Last Name" value={patient.lastName} />
          <Field label="Email" value={patient.email} />
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

// Reusable field component
const Field = ({ label, value }: { label: string; value: string }) => (
  <div>
    <Label className="text-muted-foreground">{label}</Label>
    <p className="mt-1">{value || "—"}</p>
  </div>
);

// Update the parent component to include sample children data
const PatientInfo = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [selectedPatient, setSelectedPatient] = useState<Patient>();

  console.log("params", params);

  useEffect(() => {
    axiosInstance
      .get("/api/parents/" + params.id)
      .then((result) => {
        console.log("result", result);
        setSelectedPatient(result.data);
      })
      .catch((error) => {
        console.error("error", error);
      });
  }, [params.id]);

  const handleBackToList = () => {
    console.log("Back clicked");
    navigate("/healthworker/view-patient");
  };

  if (!selectedPatient) {
    return (
      <Box p="md">
        <Text>Loading patient data...</Text>
      </Box>
    );
  }

  return (
    <PatientDetailPage patient={selectedPatient} onBack={handleBackToList} />
  );
};

export default PatientInfo;
