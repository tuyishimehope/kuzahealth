import { axiosInstance } from "@/utils/axiosInstance";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  LoadingOverlay,
  Menu,
  Modal,
  Paper,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconPlus,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
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
  visitNoteIds: { id: string }[];
}
interface VisitNote {
  id: string;
  observation: string;
  vitalSigns: string;
  recommendations: string;
  attachments: string[];
}
const ViewSchedule = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [opened, { open, close }] = useDisclosure(false);
  const navigate = useNavigate();

  //  const { data: notes } = await axiosInstance.get(
  //               `/api/visit-notes/${appointment.visitNoteId}`
  //             );

  const {
    data: schedules = [],
    isLoading,
    isError,
  } = useQuery<Schedule[], Error>({
    queryKey: ["schedules"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/api/visits");
      return data;
    },
    // onError: (error) => {
    //   console.warn("Error fetching schedules", error);
    //   notifications.show({
    //     title: "Error",
    //     message: "Failed to load schedules",
    //     color: "red",
    //   });
    // },
    staleTime: 1000 * 60 * 5,
  });

  // Fetch visit notes for the selected schedule
  const { data: visitNotes = [], isLoading: isNotesLoading } = useQuery<
    VisitNote[],
    Error
  >({
    queryKey: ["visitNotes", selectedSchedule?.id],
    queryFn: async () => {
      if (!selectedSchedule) return [];
      const { data } = await axiosInstance.get(
        `/api/visit-notes/${selectedSchedule.id}`
      );
      return data;
    },
  });

  const filteredSchedules = schedules.filter((schedule) =>
    schedule.visitType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: Schedule["status"]) => {
    switch (status) {
      case "Scheduled":
        return "purple";
      case "Completed":
        return "green";
      case "Cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  const handleViewDetails = (schedule: Schedule) => {
    console.log(schedule);
    setSelectedSchedule(schedule);
    open();
  };

  function handleDelete(id: string): void {
    console.log("id", id);
    // throw new Error("Function not implemented.");
  }

  return (
    <Box p="md" pos="relative" style={{ minHeight: 300 }}>
      {/* Loading overlay */}
      <LoadingOverlay visible={isLoading} overlayBlur={2} />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
        }}
      >
        <Group position="apart" mb="xl">
          <Title order={2}>View Schedules</Title>
          <Button
            leftIcon={<IconPlus size={rem(16)} />}
            onClick={() => navigate("/healthworker/schedule")}
            className="bg-purple-600 hover:bg-purple-500"
            disabled={isLoading}
          >
            Add New Schedule
          </Button>
        </Group>

        <Stack spacing="md">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <TextInput
              placeholder="Search schedules..."
              icon={<IconSearch size={rem(16)} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isLoading}
            />
          </motion.div>

          {isError && (
            <Text color="red" align="center" mt="md">
              {isError}
            </Text>
          )}

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <Paper shadow="sm" p="md" radius="md" withBorder>
              <Table striped highlightOnHover>
                <thead>
                  <tr>
                    <th>Visit Type</th>
                    <th>Appointment Date</th>
                    <th>Schedule Time</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredSchedules.length === 0 && !isLoading ? (
                      <tr>
                        <td
                          colSpan={6}
                          style={{ textAlign: "center", padding: "20px" }}
                        >
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
                          <td>
                            {new Date(
                              schedule.scheduledTime
                            ).toLocaleDateString()}
                          </td>
                          <td>
                            {new Date(
                              schedule.scheduledTime
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td>{schedule.location}</td>
                          <td>
                            <Badge
                              color={getStatusColor(schedule.status)}
                              className="text-purple-500"
                            >
                              {schedule.status}
                            </Badge>
                          </td>
                          <td>
                            <Group spacing={4} position="right" noWrap>
                              <ActionIcon
                                color="purple"
                                onClick={() => handleViewDetails(schedule)}
                                className="text-purple-400"
                                disabled={isLoading}
                              >
                                <IconEye size={rem(16)} />
                              </ActionIcon>
                              <Menu position="bottom-end" withinPortal>
                                <Menu.Target>
                                  <ActionIcon disabled={isLoading}>
                                    <IconDotsVertical size={rem(16)} />
                                  </ActionIcon>
                                </Menu.Target>
                                <Menu.Dropdown>
                                  <Menu.Item
                                    icon={<IconEdit size={rem(16)} />}
                                    onClick={() => {
                                      /* Handle edit */
                                    }}
                                    disabled={isLoading}
                                  >
                                    Edit
                                  </Menu.Item>
                                  <Menu.Item
                                    icon={<IconTrash size={rem(16)} />}
                                    color="red"
                                    onClick={() => handleDelete(schedule.id)}
                                    disabled={isLoading}
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

        <Modal
          opened={opened}
          onClose={close}
          title="Schedule Details"
          size="lg"
        >
          {selectedSchedule && (
            <Stack spacing="md">
              <Group>
                <Text>Date: {selectedSchedule.actualStartTime || "N/A"}</Text>
              </Group>
              <Group>
                <Text>Time: {selectedSchedule.scheduledTime}</Text>
              </Group>
              <Group>
                <Text>Location: {selectedSchedule.location}</Text>
              </Group>
              <Group>
                <Text>
                  Communication: {selectedSchedule.modeOfCommunication}
                </Text>
              </Group>

              <Stack spacing="sm" mt="md">
                <Title order={4}>Visit Notes</Title>
                {isNotesLoading ? (
                  <Text>Loading notes...</Text>
                ) : visitNotes.length === 0 ? (
                  <Text>No visit notes available.</Text>
                ) : (
                  visitNotes.map((note) => (
                    <Paper key={note.id} p="sm" shadow="xs" withBorder>
                      <Text>
                        <strong>Observation:</strong> {note.observation}
                      </Text>
                      <Text>
                        <strong>Vital Signs:</strong> {note.vitalSigns}
                      </Text>
                      <Text>
                        <strong>Recommendations:</strong> {note.recommendations}
                      </Text>
                      {note.attachments.length > 0 && (
                        <Text>
                          <strong>Attachments:</strong>{" "}
                          {note.attachments.join(", ")}
                        </Text>
                      )}
                    </Paper>
                  ))
                )}
              </Stack>
            </Stack>
          )}
        </Modal>
      </motion.div>
    </Box>
  );
};

export default ViewSchedule;
