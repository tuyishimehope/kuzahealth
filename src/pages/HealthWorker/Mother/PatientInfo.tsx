import { Card } from "@/components/ui/card";
import { axiosInstance } from "@/utils/axiosInstance";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Affix,
  Avatar,
  Badge,
  Box,
  Button,
  Group,
  Paper,
  Select,
  Tabs,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import {
  IconArrowRight,
  IconBabyCarriage,
  IconCalendar,
  IconChartBar,
  IconId,
  IconUserCircle,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

import { AppointmentHistoryTab } from "./AppointmentHistoryTab";
import { ChildRecord } from "./ChildRecord";
import { PatientInformationTab } from "./PatientInformationTab";
import { PregnancyRecordTab } from "./PregancyRecordTab";

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
  children?: Child[];
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

const PatientDetailPage = ({
  patient,
  onBack,
}: {
  patient: Patient;
  onBack: () => void;
}) => {
  const theme = useMantineTheme();

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
            className="text-purple-500"
            leftIcon={
              <IconArrowRight style={{ transform: "rotate(180deg)" }} />
            }
            onClick={onBack}
          >
            Back to Patient List
          </Button>
          {/* <Button
            variant="light"
            leftIcon={<IconEdit size={16} />}
            color="purple"
          >
            Edit Patient
          </Button> */}
        </Group>

        <Card>
          <Group position="apart" mb="xl" align="start">
            <Group>
              <Avatar
                size={80}
                radius={80}
                color="purple"
                sx={{ fontSize: 32 }}
              >
                {patient.firstName.charAt(0)}
              </Avatar>
              <Box>
                <Title order={2}>{patient.name}</Title>
                <Group spacing="xs">
                  <Badge
                    variant="filled"
                    color="indigo"
                    leftSection={<IconId size={14} />}
                  >
                    {patient.firstName} {patient.lastName}
                  </Badge>
                </Group>
              </Box>
            </Group>
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
              <PregnancyRecordTab patientId={params.id} />
            </Tabs.Panel>

            <Tabs.Panel value="appointments">
              <AppointmentHistoryTab patientId={params.id} />
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
