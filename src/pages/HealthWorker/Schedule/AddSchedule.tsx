import { axiosInstance } from "@/utils/axiosInstance";
import extractToken from "@/utils/extractToken";
import {
  Box,
  Button,
  Group,
  Paper,
  Select,
  Stack,
  TextInput,
  Textarea,
  Title,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCalendar, IconMapPin, IconMessage } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ScheduleFormValues {
  scheduledTime: string;
  visitType: string;
  location: string;
  modeOfCommunication: string;
  healthWorkerId: string;
  parent_id: string;
  summary: string;
  actualStartTime: string;
  actualEndTime: string;
  visitNotes?: {
    observation: string;
    vitalSigns: string;
    recommendations: string;
    attachments: string[];
  }[];
}

const AddSchedule = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [healthWorkerId, setHealthWorkerId] = useState();
  const [allParent, setAllParent] = useState([]);

  const form = useForm<ScheduleFormValues>();

  const handleSubmit = async (values: ScheduleFormValues) => {
    setIsSubmitting(true);
    try {
      const now = new Date().toISOString();
      const payload = {
        scheduledTime: new Date(values.scheduledTime).toISOString(),
        actualStartTime: now,
        actualEndTime: now,
        visitType: values.visitType,
        location: values.location,
        modeOfCommunication: values.modeOfCommunication,
        summary: values.summary,
        healthWorkerId: healthWorkerId,
        parent_id: values.parent_id,
        visitNotes: values.visitNotes,
      };

      console.log("Final Payload:", payload);
      await axiosInstance.post("/api/visits", payload);

      notifications.show({
        title: "Success",
        message: "Schedule has been created successfully",
        color: "green",
      });

      form.reset();
    } catch (error) {
      console.error("Submit Error", error);
      notifications.show({
        title: "Error",
        message: "Failed to create schedule",
        color: "red",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decode = extractToken(token!);
    console.log("decode", decode);
    axiosInstance
      .get("api/health-workers")
      .then((result) => {
        // console.log("result", result);
        const healthWorkerId = result.data.find(
          (healthWorker: any) => healthWorker.email === decode.email
        );
        // console.log("healthWorkerId", healthWorkerId.id);
        setHealthWorkerId(healthWorkerId.id);
      })
      .catch((error) => {
        console.log("error", error);
      });

    axiosInstance
      .get("api/parents")
      .then((result) => {
        // console.log("result", result);
        setAllParent(result.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <Box p="md">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Group position="apart" mb="xl">
          <Title order={2}>Add New Schedule</Title>
        </Group>

        <Paper shadow="sm" p="xl" radius="md" withBorder>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack spacing="md">
              <motion.div variants={itemVariants}>
                <Select
                  required
                  label="Patient Name"
                  placeholder="Select Patient Name"
                  data={allParent.map(({ id, firstName, lastName }) => ({
                    value: id,
                    label: `${firstName} ${lastName}`,
                  }))}
                  {...form.getInputProps("parent_id")}
                />
              </motion.div>

              <Group grow>
                <Textarea
                  required
                  label="Visit Summary"
                  placeholder="Enter visit summary"
                  icon={<IconMessage size={rem(16)} />}
                  minRows={3}
                  {...form.getInputProps("summary")}
                />

                <TextInput
                  required
                  label="Scheduled Date and Time"
                  type="datetime-local"
                  icon={<IconCalendar size={rem(16)} />}
                  {...form.getInputProps("scheduledTime")}
                />
              </Group>

              <motion.div variants={itemVariants}>
                <TextInput
                  required
                  label="Patient Location"
                  placeholder="Enter patient location"
                  icon={<IconMapPin size={rem(16)} />}
                  {...form.getInputProps("patientLocation")}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Select
                  required
                  label="Mode of Communication"
                  placeholder="Select communication mode"
                  data={[
                    { value: "phone", label: "Phone Call" },
                    { value: "faceToFace", label: "Face to Face" },
                    { value: "SMS", label: "SMS" },
                  ]}
                  {...form.getInputProps("modeOfCommunication")}
                />
              </motion.div>
              <TextInput
                required
                label="Visit Type"
                placeholder="e.g., Dental Checkup"
                {...form.getInputProps("visitType")}
              />

              <TextInput
                required
                label="Location"
                placeholder="e.g., Health Center A"
                {...form.getInputProps("location")}
              />

              <Textarea
                label="Observation"
                minRows={3}
                {...form.getInputProps("visitNotes.0.observation")}
              />

              <Textarea
                label="Vital Signs"
                minRows={2}
                {...form.getInputProps("visitNotes.0.vitalSigns")}
              />

              <Textarea
                label="Recommendations"
                minRows={2}
                {...form.getInputProps("visitNotes.0.recommendations")}
              />

              <motion.div variants={itemVariants}>
                <Group position="right" mt="xl">
                  <Button
                    variant="outline"
                    onClick={() => form.reset()}
                    disabled={isSubmitting}
                  >
                    Reset
                  </Button>
                  <Button type="submit" loading={isSubmitting}>
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
