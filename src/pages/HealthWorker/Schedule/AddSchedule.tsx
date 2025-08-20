import { axiosInstance } from "@/utils/axiosInstance";
import extractToken from "@/utils/extractToken";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  Group,
  LoadingOverlay,
  Paper,
  Select,
  Stack,
  TextInput,
  Textarea,
  Title,
  rem
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconAlertCircle,
  IconCalendar,
  IconMapPin,
  IconMessage,
} from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

// Validation Schema
const scheduleSchema = z.object({
  parent_id: z.string().min(1, "Patient selection is required"),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  scheduledTime: z.string().min(1, "Scheduled time is required"),
  visitType: z.string().min(1, "Visit type is required"),
  location: z.string().min(1, "Location is required"),
  modeOfCommunication: z.enum(["phone", "faceToFace", "SMS"], {
    errorMap: () => ({ message: "Please select a communication mode" }),
  }),
  visitNotes: z
    .object({
      observation: z.string().optional(),
      vitalSigns: z.string().optional(),
      recommendations: z.string().optional(),
    })
    .optional(),
});

type ScheduleFormData = z.infer<typeof scheduleSchema>;

interface Parent {
  id: string;
  firstName: string;
  lastName: string;
}

interface HealthWorker {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

// Custom Hooks
export const useCurrentHealthWorker = () => {
  return useQuery({
    queryKey: ["current-health-worker"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const decoded = extractToken(token);
      const response = await axiosInstance.get<HealthWorker[]>(
        "api/health-workers"
      );
      console.log("response", response);
      console.log("decoded", decoded);
      const currentWorker = response.data.find(
        (worker) => worker.email === decoded.email
      );

      if (!currentWorker) throw new Error("Health worker not found");
      return currentWorker;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

const useParents = () => {
  return useQuery({
    queryKey: ["parents"],
    queryFn: async () => {
      const response = await axiosInstance.get<Parent[]>("api/parents");
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

const useCreateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ScheduleFormData & { healthWorkerId: string }) => {
      const now = new Date().toISOString();
      const payload = {
        scheduledTime: new Date(data.scheduledTime).toISOString(),
        actualStartTime: now,
        actualEndTime: now,
        visitType: data.visitType,
        location: data.location,
        modeOfCommunication: data.modeOfCommunication,
        summary: data.summary,
        healthWorkerId: data.healthWorkerId,
        parent_id: data.parent_id,
        visitNotes: data.visitNotes ? [data.visitNotes] : [],
      };

      return axiosInstance.post("/api/visits", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      notifications.show({
        title: "Success",
        message: "Schedule created successfully",
        color: "green",
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to create schedule";
      notifications.show({
        title: "Error",
        message,
        color: "red",
      });
    },
  });
};

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

const AddSchedule = () => {
  const queryClient = useQueryClient();

  // Data fetching
  const {
    data: healthWorker,
    isLoading: loadingWorker,
    error: workerError,
  } = useCurrentHealthWorker();
  const {
    data: parents = [],
    isLoading: loadingParents,
    error: parentsError,
  } = useParents();
  const createScheduleMutation = useCreateSchedule();

  // Form setup
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    mode: "onChange",
    defaultValues: {
      parent_id: "",
      summary: "",
      scheduledTime: "",
      visitType: "",
      location: "",
      modeOfCommunication: "faceToFace" as const,
      visitNotes: {
        observation: "",
        vitalSigns: "",
        recommendations: "",
      },
    },
  });

  // Memoized parent options
  const parentOptions = useMemo(
    () =>
      parents.map(({ id, firstName, lastName }) => ({
        value: id,
        label: `${firstName} ${lastName}`,
      })),
    [parents]
  );

  const communicationOptions = [
    { value: "phone", label: "Phone Call" },
    { value: "faceToFace", label: "Face to Face" },
    { value: "SMS", label: "SMS" },
  ];

  const onSubmit = async (data: ScheduleFormData) => {
    if (!healthWorker) return;

    try {
      await createScheduleMutation.mutateAsync({
        ...data,
        healthWorkerId: healthWorker.id,
      });
      reset();
    } catch (error) {
      console.log(error);
      // Error handled in mutation
    }
  };

  const handleReset = () => {
    reset();
    notifications.show({
      title: "Form Reset",
      message: "All fields have been cleared",
      color: "purple",
    });
  };

  // Loading state
  if (loadingWorker || loadingParents) {
    return (
      <Box p="md" pos="relative" mih={400}>
        <LoadingOverlay visible overlayBlur={2} />
        <Title order={2} mb="xl">
          Add New Schedule
        </Title>
        <Paper shadow="sm" p="xl" radius="md" withBorder h={300} />
      </Box>
    );
  }

  // Error state
  if (workerError || parentsError) {
    return (
      <Box p="md">
        <Title order={2} mb="xl">
          Add New Schedule
        </Title>
        <Alert
          icon={<IconAlertCircle size={rem(16)} />}
          title="Error Loading Data"
          color="red"
          variant="light"
        >
          {workerError?.message ||
            parentsError?.message ||
            "Failed to load required data"}
          <Button
            variant="outline"
            size="xs"
            mt="sm"
            onClick={() => queryClient.invalidateQueries()}
          >
            Retry
          </Button>
        </Alert>
      </Box>
    );
  }

  return (
    <Box p="md">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Group position="apart" mb="lg">
          <Title order={2} className="text-purple-700">
            Add New Schedule
          </Title>
        </Group>

        <Paper
          shadow="xl"
          p="xl"
          radius="lg"
          withBorder
          pos="relative"
          className="bg-white"
        >
          <LoadingOverlay
            visible={createScheduleMutation.isPending}
            overlayBlur={3}
          />

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing="lg">
              {/* Patient Selection */}
              <motion.div variants={itemVariants}>
                <Controller
                  name="parent_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Mother Name"
                      placeholder="Search and select patient"
                      data={parentOptions}
                      searchable
                      clearable
                      required
                      radius="md"
                      size="md"
                      nothingFound="No matching mother"
                      maxDropdownHeight={200} // sets max height for dropdown
                      withinPortal // ensures dropdown overlays correctly
                      classNames={{ input: "bg-gray-50 hover:bg-gray-100" }}
                    />
                  )}
                />
              </motion.div>

              {/* Summary and Scheduled Time */}
              <Group grow align="flex-start" spacing="md">
                <motion.div variants={itemVariants} style={{ flex: 2 }}>
                  <Controller
                    name="summary"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        label="Visit Summary"
                        placeholder="Describe the purpose and details of this visit"
                        icon={<IconMessage size={rem(16)} />}
                        minRows={4}
                        error={errors.summary?.message}
                        required
                        radius="md"
                        size="md"
                        classNames={{ input: "bg-gray-50 hover:bg-gray-100" }}
                      />
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants} style={{ flex: 1 }}>
                  <Controller
                    name="scheduledTime"
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        {...field}
                        label="Scheduled Date & Time"
                        type="datetime-local"
                        icon={<IconCalendar size={rem(16)} />}
                        error={errors.scheduledTime?.message}
                        required
                        radius="md"
                        size="md"
                        classNames={{ input: "bg-gray-50 hover:bg-gray-100" }}
                      />
                    )}
                  />
                </motion.div>
              </Group>

              {/* Visit Type and Location */}
              <Group grow spacing="md">
                <motion.div variants={itemVariants}>
                  <Controller
                    name="visitType"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        label="Visit Type"
                        placeholder="Select visit type"
                        data={[
                          {
                            value: "Routine Checkup",
                            label: "Routine Checkup",
                          },
                          { value: "Follow-up", label: "Follow-up" },
                          { value: "Emergency", label: "Emergency" },
                          { value: "Consultation", label: "Consultation" },
                          { value: "Vaccination", label: "Vaccination" },
                        ]}
                        error={errors.visitType?.message}
                        required
                        radius="md"
                        size="md"
                        classNames={{ input: "bg-gray-50 hover:bg-gray-100" }}
                      />
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Controller
                    name="location"
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        {...field}
                        label="Location"
                        placeholder="e.g., Health Center A, Patient Home"
                        icon={<IconMapPin size={rem(16)} />}
                        error={errors.location?.message}
                        required
                        radius="md"
                        size="md"
                        classNames={{ input: "bg-gray-50 hover:bg-gray-100" }}
                      />
                    )}
                  />
                </motion.div>
              </Group>

              {/* Communication Mode */}
              <motion.div variants={itemVariants}>
                <Controller
                  name="modeOfCommunication"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Mode of Communication"
                      placeholder="Select communication method"
                      data={communicationOptions}
                      error={errors.modeOfCommunication?.message}
                      required
                      radius="md"
                      size="md"
                      classNames={{ input: "bg-gray-50 hover:bg-gray-100" }}
                    />
                  )}
                />
              </motion.div>

              {/* Action Buttons */}
              <motion.div variants={itemVariants}>
                <Group position="right" mt="md" spacing="sm">
                  <Button
                    variant="light"
                    onClick={handleReset}
                    className="bg-purple-50 text-purple-700 hover:bg-purple-100"
                    disabled={createScheduleMutation.isPending}
                  >
                    Reset Form
                  </Button>
                  <Button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-500 text-white"
                    loading={createScheduleMutation.isPending}
                    disabled={!isValid}
                  >
                    Create Schedule
                  </Button>
                </Group>
              </motion.div>
            </Stack>
          </form>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default AddSchedule;
