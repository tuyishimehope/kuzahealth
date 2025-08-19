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
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  summary: string;
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
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [deleteConfirmOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  const [postNoteOpened, { open: openPostNote, close: closePostNote }] = useDisclosure(false);
  const [newVisitNote, setNewVisitNote] = useState<Partial<VisitNote & { visitId: string }>>({
    observation: "",
    vitalSigns: "",
    recommendations: "",
    attachments: [],
    visitId: "",
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchVisitNotesByVisitId = async (visitId: string) => {
  const { data } = await axiosInstance.get(`/api/visit-notes?visitId=${visitId}`);
  return data;
};

const { data: visitNotes = [], isLoading: isNotesLoading } = useQuery<VisitNote[], Error>({
  queryKey: ["visitNotes", selectedSchedule?.id],
  queryFn: () => fetchVisitNotesByVisitId(selectedSchedule!.id),
  enabled: !!selectedSchedule,
});


  const handleAddVisitNote = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setNewVisitNote({ ...newVisitNote, visitId: schedule.id });
    openPostNote();
  };

  const { data: schedules = [], isLoading, isError } = useQuery<Schedule[], Error>({
    queryKey: ["schedules"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/api/visits");
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

  

  const filteredSchedules = schedules.filter((schedule) =>
    schedule.visitType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: Schedule["status"]) => {
    switch (status) {
      case "Scheduled":
        return "violet";
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

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/api/visits/${id}`);
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      closeDelete();
    } catch (error) {
      console.error(error);
      alert("Failed to delete schedule.");
    }
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    openEdit();
  };

  const handleSaveEdit = async () => {
    if (!editingSchedule) return;

    try {
      await axiosInstance.put(
        `/api/visits/${editingSchedule.id}`,
        editingSchedule,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      closeEdit();
    } catch (error) {
      console.error(error);
      alert("Failed to update schedule.");
    }
  };

  return (
    <Box p="md" pos="relative" style={{ minHeight: 300 }}>
      <LoadingOverlay visible={isLoading} overlayBlur={2} />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
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

        {/* Add Post Visit Note Modal */}
        <Modal opened={postNoteOpened} onClose={closePostNote} title="Add Post Visit Note" size="lg">
          <Stack spacing="md">
            <TextInput
              label="Observation"
              value={newVisitNote.observation}
              onChange={(e) => setNewVisitNote({ ...newVisitNote, observation: e.currentTarget.value })}
            />
            <TextInput
              label="Vital Signs"
              value={newVisitNote.vitalSigns}
              onChange={(e) => setNewVisitNote({ ...newVisitNote, vitalSigns: e.currentTarget.value })}
            />
            <TextInput
              label="Recommendations"
              value={newVisitNote.recommendations}
              onChange={(e) => setNewVisitNote({ ...newVisitNote, recommendations: e.currentTarget.value })}
            />
            <TextInput
              label="Attachments (comma separated)"
              value={newVisitNote.attachments?.join(", ")}
              onChange={(e) =>
                setNewVisitNote({ ...newVisitNote, attachments: e.currentTarget.value.split(",").map(a => a.trim()) })
              }
            />
            <Button
              color="violet"
              onClick={async () => {
                try {
                  await axiosInstance.post("/api/visit-notes", newVisitNote);
                  queryClient.invalidateQueries({queryKey:["visitNotes", selectedSchedule?.id]});
                  closePostNote();
                } catch (error) {
                  console.error(error);
                  alert("Failed to add visit note.");
                }
              }}
            >
              Save Visit Note
            </Button>
          </Stack>
        </Modal>

        <Stack spacing="md">
          <TextInput
            placeholder="Search schedules..."
            icon={<IconSearch size={rem(16)} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isLoading}
          />

          {isError && <Text color="red">Failed to load schedules.</Text>}

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
                          {new Date(schedule.scheduledTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </td>
                        <td>{schedule.location}</td>
                        <td>
                          <Badge color={getStatusColor(schedule.status)} className="text-purple-500">
                            {schedule.status}
                          </Badge>
                        </td>
                        <td>
                          <Group spacing={4} position="right" noWrap>
                            <ActionIcon color="violet" onClick={() => handleViewDetails(schedule)}>
                              <IconEye size={rem(16)} />
                            </ActionIcon>

                            <Button size="xs" color="purple" className="bg-purple-600 hover:bg-purple-500" onClick={() => handleAddVisitNote(schedule)}>
                              Add Visit Note
                            </Button>

                            <Menu position="bottom-end" withinPortal>
                              <Menu.Target>
                                <ActionIcon>
                                  <IconDotsVertical size={rem(16)} />
                                </ActionIcon>
                              </Menu.Target>
                              <Menu.Dropdown>
                                <Menu.Item icon={<IconEdit size={rem(16)} />} onClick={() => handleEdit(schedule)}>
                                  Edit
                                </Menu.Item>
                                <Menu.Item icon={<IconTrash size={rem(16)} />} color="red" onClick={openDelete}>
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
        </Stack>

        {/* View Modal */}
        <Modal opened={opened} onClose={close} title="Schedule Details" size="lg">
          {selectedSchedule && (
            <Stack spacing="md">
              <Text>Date: {selectedSchedule.actualStartTime || "N/A"}</Text>
              <Text>Time: {selectedSchedule.scheduledTime}</Text>
              <Text>Location: {selectedSchedule.location}</Text>
              <Text>Communication: {selectedSchedule.modeOfCommunication}</Text>
              <Text>Summary: {selectedSchedule.summary}</Text>

              <Title order={4}>Visit Notes</Title>
              {isNotesLoading ? (
                <Text>Loading visit notes...</Text>
              ) : !visitNotes?.length ? (
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
                    {note.attachments?.length > 0 && (
                      <Text>
                        <strong>Attachments:</strong> {note.attachments.join(", ")}
                      </Text>
                    )}
                  </Paper>
                ))
              )}

              {/* <Button color="green" size="sm" className="bg-purple-600 hover:bg-purple-500" onClick={() => handleAddVisitNote(selectedSchedule)}>
                Add Visit Note
              </Button> */}
            </Stack>
          )}
        </Modal>

        {/* Edit Modal */}
        <Modal opened={editOpened} onClose={closeEdit} title="Edit Schedule" size="lg">
          {editingSchedule && (
            <Stack spacing="md">
              <TextInput
                label="Scheduled Time"
                type="datetime-local"
                value={editingSchedule.scheduledTime}
                onChange={(e) =>
                  setEditingSchedule({ ...editingSchedule, scheduledTime: e.currentTarget.value })
                }
              />
              <TextInput
                label="Visit Type"
                value={editingSchedule.visitType}
                onChange={(e) => setEditingSchedule({ ...editingSchedule, visitType: e.currentTarget.value })}
              />
              <TextInput
                label="Location"
                value={editingSchedule.location}
                onChange={(e) => setEditingSchedule({ ...editingSchedule, location: e.currentTarget.value })}
              />
              <TextInput
                label="Summary"
                value={editingSchedule.summary || ""}
                onChange={(e) => setEditingSchedule({ ...editingSchedule, summary: e.currentTarget.value })}
              />

              {editingSchedule.visitNoteIds?.length > 0 && (
                <TextInput
                  label="Visit Note ID"
                  value={editingSchedule.visitNoteIds[0].id}
                  onChange={(e) =>
                    setEditingSchedule({ ...editingSchedule, visitNoteIds: [{ id: e.currentTarget.value }] })
                  }
                />
              )}

              <Button color="violet" onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </Stack>
          )}
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal opened={deleteConfirmOpened} onClose={closeDelete} title="Confirm Delete">
          <Stack spacing="md">
            <Text>Are you sure you want to delete this schedule? This action cannot be undone.</Text>
            <Group position="right">
              <Button variant="outline" onClick={closeDelete}>
                Cancel
              </Button>
              <Button color="red" onClick={() => selectedSchedule && handleDelete(selectedSchedule.id)}>
                Delete
              </Button>
            </Group>
          </Stack>
        </Modal>
      </motion.div>
    </Box>
  );
};

export default ViewSchedule;
