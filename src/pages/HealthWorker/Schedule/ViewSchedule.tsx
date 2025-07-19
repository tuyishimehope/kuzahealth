import { axiosInstance } from "@/utils/axiosInstance";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Menu,
  Modal,
  Paper,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
  rem,
  LoadingOverlay,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconCalendar,
  IconClock,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconMapPin,
  IconPhone,
  IconPlus,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface Schedule {
  id: string;
  scheduledTime: string;
  actualStartTime: string | null;
  actualEndTime: string | null;
  visitType: string;
  location: string;
  modeOfCommunication: string;
  status: "Scheduled" | "Completed" | "Cancelled";
  visitNotes: {
    id: string;
    observation: string;
    vitalSigns: string;
    recommendations: string;
    attachments: string[];
  }[];
}

const ViewSchedule = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const filteredSchedules = schedules.filter((schedule) =>
    schedule.visitType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: Schedule["status"]) => {
    switch (status) {
      case "Scheduled":
        return "blue";
      case "Completed":
        return "green";
      case "Cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  const handleViewDetails = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    open();
  };

  const handleDelete = (_id: string) => {
    // Here you should call API to delete schedule
    notifications.show({
      title: "Success",
      message: "Schedule deleted successfully",
      color: "green",
    });

    // Remove deleted schedule from state (example)
    setSchedules((prev) => prev.filter((s) => s.id !== _id));
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    axiosInstance
      .get("/api/visits")
      .then((result) => {
        setSchedules(result.data);
      })
      .catch((error) => {
        console.warn("Error fetching schedules", error);
        setError("Failed to load schedules");
        notifications.show({
          title: "Error",
          message: "Failed to load schedules",
          color: "red",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Box p="md" pos="relative" style={{ minHeight: 300 }}>
      {/* Loading overlay */}
      <LoadingOverlay visible={loading} overlayBlur={2} />

      <motion.div initial="hidden" animate="visible" variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
        }}>
        <Group position="apart" mb="xl">
          <Title order={2}>View Schedules</Title>
          <Button
            leftIcon={<IconPlus size={rem(16)} />}
            onClick={() => navigate("/healthworker/schedule")}
            disabled={loading}
          >
            Add New Schedule
          </Button>
        </Group>

        <Stack spacing="md">
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <TextInput
              placeholder="Search schedules..."
              icon={<IconSearch size={rem(16)} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={loading}
            />
          </motion.div>

          {error && (
            <Text color="red" align="center" mt="md">
              {error}
            </Text>
          )}

          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <Paper shadow="sm" p="md" radius="md" withBorder>
              <Table striped highlightOnHover>
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Appointment Date</th>
                    <th>Schedule Time</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredSchedules.length === 0 && !loading ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: "center", padding: "20px" }}>
                          No schedules found.
                        </td>
                      </tr>
                    ) : (
                      filteredSchedules.map((schedule) => (
                        <motion.tr
                          key={schedule.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.2 }}
                        >
                          <td>{schedule.visitType}</td>
                          <td>{new Date(schedule.scheduledTime).toLocaleDateString()}</td>
                          <td>
                            {new Date(schedule.scheduledTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td>{schedule.location}</td>
                          <td>
                            <Badge color={getStatusColor(schedule.status)}>
                              {schedule.status}
                            </Badge>
                          </td>
                          <td>
                            <Group spacing={4} position="right" noWrap>
                              <ActionIcon
                                color="blue"
                                onClick={() => handleViewDetails(schedule)}
                                disabled={loading}
                              >
                                <IconEye size={rem(16)} />
                              </ActionIcon>
                              <Menu position="bottom-end" withinPortal>
                                <Menu.Target>
                                  <ActionIcon disabled={loading}>
                                    <IconDotsVertical size={rem(16)} />
                                  </ActionIcon>
                                </Menu.Target>
                                <Menu.Dropdown>
                                  <Menu.Item
                                    icon={<IconEdit size={rem(16)} />}
                                    onClick={() => {
                                      /* Handle edit */
                                    }}
                                    disabled={loading}
                                  >
                                    Edit
                                  </Menu.Item>
                                  <Menu.Item
                                    icon={<IconTrash size={rem(16)} />}
                                    color="red"
                                    onClick={() => handleDelete(schedule.id)}
                                    disabled={loading}
                                  >
                                    Delete
                                  </Menu.Item>
                                </Menu.Dropdown>
                              </Menu>
                            </Group>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </Table>
            </Paper>
          </motion.div>
        </Stack>

        <Modal opened={opened} onClose={close} title="Schedule Details" size="lg">
          {selectedSchedule && (
            <Stack spacing="md">
              <Group>
                <IconCalendar size={rem(16)} />
                <Text>Date: {selectedSchedule.actualStartTime || "N/A"}</Text>
              </Group>
              <Group>
                <IconClock size={rem(16)} />
                <Text>Time: {selectedSchedule.scheduledTime}</Text>
              </Group>
              <Group>
                <IconMapPin size={rem(16)} />
                <Text>Location: {selectedSchedule.location}</Text>
              </Group>
              <Group>
                <IconPhone size={rem(16)} />
                <Text>Communication: {selectedSchedule.modeOfCommunication}</Text>
              </Group>
              <Group position="right" mt="xl">
                <Button variant="outline" onClick={close} disabled={loading}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    /* Handle edit */
                  }}
                  disabled={loading}
                >
                  Edit Schedule
                </Button>
              </Group>
            </Stack>
          )}
        </Modal>
      </motion.div>
    </Box>
  );
};

export default ViewSchedule;
