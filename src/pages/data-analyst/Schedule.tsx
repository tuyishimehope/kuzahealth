import { axiosInstance } from "@/utils/axiosInstance";
import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Container,
  Group,
  LoadingOverlay,
  Modal,
  Paper,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Timeline,
  Title,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconAlertCircle,
  IconCalendar,
  IconCheck,
  IconClock,
  IconClock2,
  IconDeviceMobile,
  IconEye,
  IconFileExport,
  IconMapPin,
  IconMessage,
  IconNotes,
  IconPhone,
  IconRefresh,
  IconStethoscope,
  IconVideo,
  IconX,
} from "@tabler/icons-react";

import { useQuery } from "@tanstack/react-query";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from "mantine-react-table";
import { useMemo, useState } from "react";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { Patient } from "./ViewParents";
import { HealthWorker } from "../superadmin/ViewHealthWorkers";

export interface Schedule {
  id: string;
  scheduledTime: string;
  actualStartTime: string | null;
  actualEndTime: string | null;
  visitType: string;
  location: string;
  modeOfCommunication: string;
  parentId: string;
  healthWorkerId: string;
  status: "Scheduled" | "Completed" | "Cancelled";
  visitNotes: {
    id: string;
    observation: string;
    vitalSigns: string;
    recommendations: string;
    attachments: string[];
  }[];
}

const fetchSchedules = async (): Promise<Schedule[]> => {
  const res = await axiosInstance.get("/api/visits");
  return res.data;
};
const fetchParent = async (id: string): Promise<Patient> => {
  const res = await axiosInstance.get(`/api/parents/${id}`);
  return res.data; // should be a single object
};
const fetchHealthWorker = async (id: string): Promise<HealthWorker> => {
  const res = await axiosInstance.get(`/api/health-workers/${id}`);
  return res.data; // single object
};

const Schedule = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [modalOpened, { open, close }] = useDisclosure(false);

  const {
    data: schedules = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["schedules"],
    queryFn: fetchSchedules,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch selected parent when a schedule is selected
  const { data: parent } = useQuery<Patient>({
    queryKey: ["parent", selectedSchedule?.parentId],
    queryFn: () => fetchParent(selectedSchedule!.parentId),
    enabled: !!selectedSchedule?.parentId, // only run if ID exists
    staleTime: 5 * 60 * 1000,
  });

  // Fetch selected health worker
  const { data: healthWorker } = useQuery<HealthWorker>({
    queryKey: ["healthWorker", selectedSchedule?.healthWorkerId],
    queryFn: () => fetchHealthWorker(selectedSchedule!.healthWorkerId),
    enabled: !!selectedSchedule?.healthWorkerId, // only run if ID exists
    staleTime: 5 * 60 * 1000,
  });

  const filteredSchedules = useMemo(
    () =>
      schedules.filter(
        (s) =>
          s.visitType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.status.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [schedules, searchQuery]
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

  const getStatusIcon = (status: Schedule["status"]) => {
    switch (status) {
      case "Scheduled":
        return <IconClock2 size={14} />;
      case "Completed":
        return <IconCheck size={14} />;
      case "Cancelled":
        return <IconX size={14} />;
      default:
        return <IconClock size={14} />;
    }
  };

  const getCommunicationIcon = (mode: string) => {
    const lowerMode = mode.toLowerCase();
    if (lowerMode.includes("video")) return <IconVideo size={16} />;
    if (lowerMode.includes("phone") || lowerMode.includes("call"))
      return <IconPhone size={16} />;
    if (lowerMode.includes("message") || lowerMode.includes("text"))
      return <IconMessage size={16} />;
    return <IconDeviceMobile size={16} />;
  };

  const getScheduleStats = () => {
    const total = schedules.length;
    const scheduled = schedules.filter((s) => s.status === "Scheduled").length;
    const completed = schedules.filter((s) => s.status === "Completed").length;
    const cancelled = schedules.filter((s) => s.status === "Cancelled").length;
    return { total, scheduled, completed, cancelled };
  };

  const stats = getScheduleStats();

  const handleViewDetails = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    open();
  };

  const handleExportToPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(107, 33, 168); // Purple color
    doc.text("Medical Schedules Report", 14, 20);

    // Date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);

    const tableData = filteredSchedules.map((s) => [
      s.visitType,
      new Date(s.scheduledTime).toLocaleDateString(),
      new Date(s.scheduledTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      s.location,
      s.modeOfCommunication,
      s.status,
    ]);

    autoTable(doc, {
      startY: 35,
      head: [
        ["Visit Type", "Date", "Time", "Location", "Communication", "Status"],
      ],
      body: tableData,
      theme: "striped",
      headStyles: {
        fillColor: [147, 51, 234], // Purple
        textColor: [255, 255, 255],
        fontSize: 10,
      },
      bodyStyles: {
        fontSize: 9,
      },
      alternateRowStyles: {
        fillColor: [248, 244, 255], // Light purple
      },
    });

    doc.save(`medical_schedules_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const columns = useMemo<MRT_ColumnDef<Schedule>[]>(
    () => [
      {
        accessorKey: "visitType",
        header: "Visit Type",
        size: 200,
        Cell: ({ cell }) => (
          <Group spacing="sm">
            <ThemeIcon variant="light" color="purple" size="sm">
              <IconStethoscope size={14} />
            </ThemeIcon>
            <Text size="sm" fw={500}>
              {cell.getValue<string>()}
            </Text>
          </Group>
        ),
      },
      {
        accessorKey: "scheduledTime",
        header: "Date & Time",
        size: 180,
        Cell: ({ cell }) => {
          const date = new Date(cell.getValue<string>());
          return (
            <Stack spacing={2}>
              <Group spacing={4}>
                <IconCalendar size={14} color="gray" />
                <Text size="sm" fw={500}>
                  {date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
              </Group>
              <Group spacing={4}>
                <IconClock size={14} color="gray" />
                <Text size="xs" c="dimmed">
                  {date.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </Group>
            </Stack>
          );
        },
      },
      {
        accessorKey: "location",
        header: "Location",
        Cell: ({ cell }) => (
          <Group spacing="sm">
            <IconMapPin size={14} color="gray" />
            <Text size="sm">{cell.getValue<string>()}</Text>
          </Group>
        ),
      },
      {
        accessorKey: "modeOfCommunication",
        header: "Communication",
        Cell: ({ cell }) => {
          const mode = cell.getValue<string>();
          return (
            <Group spacing="sm">
              {getCommunicationIcon(mode)}
              <Text size="sm">{mode}</Text>
            </Group>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ cell }) => {
          const status = cell.getValue<Schedule["status"]>();
          return (
            <Badge
              variant="light"
              color={getStatusColor(status)}
              leftSection={getStatusIcon(status)}
              size="md"
              radius="md"
            >
              {status}
            </Badge>
          );
        },
      },
      {
        accessorKey: "actions",
        header: "Actions",
        enableColumnFilter: false,
        enableSorting: false,
        size: 80,
        Cell: ({ row }) => (
          <Tooltip label="View details" position="top">
            <ActionIcon
              variant="light"
              color="purple"
              size="md"
              radius="md"
              onClick={() => handleViewDetails(row.original)}
            >
              <IconEye size={16} />
            </ActionIcon>
          </Tooltip>
        ),
      },
    ],
    [handleViewDetails]
  );

  const table = useMantineReactTable({
    columns,
    data: filteredSchedules,
    state: { isLoading },
    enableGlobalFilter: false,
    enableSorting: true,
    enableColumnFilters: true,
    enablePagination: true,
    enableRowSelection: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableHiding: false,
    initialState: {
      pagination: { pageSize: 15, pageIndex: 0 },
      density: "md",
    },
    mantineTableProps: {
      striped: true,
      highlightOnHover: true,
      withBorder: false,
      sx: {
        "& thead tr th": {
          backgroundColor: "#f8f4ff",
          color: "#6b21a8",
          fontWeight: 600,
        },
        "& tbody tr:hover": {
          backgroundColor: "#faf5ff",
        },
      },
    },
    mantinePaperProps: {
      shadow: "sm",
      radius: "md",
      sx: {
        overflow: "hidden",
      },
    },
    mantineTopToolbarProps: {
      sx: {
        backgroundColor: "#fafafa",
        borderBottom: "1px solid #e5e5e5",
      },
    },
    mantineBottomToolbarProps: {
      sx: {
        backgroundColor: "#fafafa",
        borderTop: "1px solid #e5e5e5",
      },
    },
  });

  if (isError) {
    return (
      <Container size="lg" py="xl">
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Error Loading Schedules"
          color="red"
          variant="light"
        >
          <Group position="apart">
            <Text size="sm">
              {error instanceof Error
                ? error.message
                : "Failed to load schedules data"}
            </Text>
            <Button
              variant="light"
              color="red"
              size="xs"
              leftIcon={<IconRefresh size={14} />}
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </Group>
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl" py="md">
      <Stack spacing="xl">
        {/* Header Section */}
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Group position="apart" mb="md">
            <div>
              <Title order={2} c="purple.8" mb={4}>
                Medical Schedules
              </Title>
              <Text size="sm" c="dimmed">
                Manage and track all medical visit schedules
              </Text>
            </div>

            <Button
              leftIcon={<IconFileExport size={16} />}
              onClick={handleExportToPDF}
              variant="gradient"
              gradient={{ from: "purple", to: "violet", deg: 45 }}
              disabled={filteredSchedules.length === 0}
              loading={isLoading}
            >
              Export PDF
            </Button>
          </Group>

          {/* Statistics Cards */}
          <Group spacing="md">
            <Badge
              variant="light"
              color="purple"
              size="lg"
              leftSection={<RiCalendarScheduleLine size={16} />}
            >
              {stats.total} Total
            </Badge>
            <Badge
              variant="light"
              color="blue"
              size="lg"
              leftSection={<IconClock2 size={16} />}
            >
              {stats.scheduled} Scheduled
            </Badge>
            <Badge
              variant="light"
              color="green"
              size="lg"
              leftSection={<IconCheck size={16} />}
            >
              {stats.completed} Completed
            </Badge>
            <Badge
              variant="light"
              color="red"
              size="lg"
              leftSection={<IconX size={16} />}
            >
              {stats.cancelled} Cancelled
            </Badge>
          </Group>
        </Card>

        {/* Search Section */}
        <TextInput
          placeholder="Search by visit type, location, or status..."
          icon={<RiCalendarScheduleLine size={16} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          size="md"
          radius="md"
          sx={{
            "& .mantine-TextInput-input": {
              border: "2px solid #e5e7eb",
              "&:focus": {
                borderColor: "#9333ea",
              },
            },
          }}
        />

        {/* Table Section */}
        <Paper shadow="sm" radius="md" pos="relative">
          <LoadingOverlay visible={isLoading} overlayBlur={2} />
          <MantineReactTable table={table} />
        </Paper>

        {/* Detail Modal */}
        <Modal
          opened={modalOpened}
          onClose={close}
          title={
            <Group spacing="sm">
              <RiCalendarScheduleLine size={24} color="purple" />
              <Title order={3} c="purple.8">
                Schedule Details
              </Title>
            </Group>
          }
          size="lg"
          radius="md"
          shadow="xl"
          centered
        >
          {selectedSchedule ? (
            <Stack spacing="lg">
              {/* Schedule Header */}
              <Card withBorder radius="md" p="lg" bg="purple.0">
                <Group position="apart" mb="md">
                  <div>
                    <Title order={4} c="purple.8">
                      {selectedSchedule.visitType}
                    </Title>
                    <Text size="sm" c="dimmed">
                      Medical Visit Schedule
                    </Text>
                  </div>
                  <Badge
                    variant="light"
                    color={getStatusColor(selectedSchedule.status)}
                    leftSection={getStatusIcon(selectedSchedule.status)}
                    size="lg"
                  >
                    {selectedSchedule.status}
                  </Badge>
                </Group>
              </Card>

              {/* Parent Information */}
              {parent && (
                <Card withBorder radius="md" p="md">
                  <Title order={4} c="purple.7" mb="md">
                    Parent Information
                  </Title>
                  <Stack spacing="sm">
                    <Text>
                      <b>Name:</b> {parent?.firstName}
                    </Text>
                    <Text>
                      <b>Phone:</b> {parent.phone}
                    </Text>
                    <Text>
                      <b>Address:</b> {parent.lastName}
                    </Text>
                  </Stack>
                </Card>
              )}

              {/* Health Worker Information */}
              {healthWorker && (
                <Card withBorder radius="md" p="md">
                  <Title order={4} c="purple.7" mb="md">
                    Health Worker Information
                  </Title>
                  <Stack spacing="sm">
                    <Text>
                      <b>Name:</b> {healthWorker.first_name}
                    </Text>
                    <Text>
                      <b>Phone:</b> {healthWorker.phone_number}
                    </Text>
                    <Text>
                      <b>Last Name:</b> {healthWorker.last_name}
                    </Text>
                  </Stack>
                </Card>
              )}

              {/* Schedule Information */}
              <Card withBorder radius="md" p="md">
                <Title order={4} c="purple.7" mb="md">
                  Schedule Information
                </Title>
                <Stack spacing="md">
                  <Group spacing="sm">
                    <IconCalendar size={18} color="purple" />
                    <Text fw={500}>Date:</Text>
                    <Text c="dimmed">
                      {new Date(
                        selectedSchedule.scheduledTime
                      ).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                  </Group>
                  <Group spacing="sm">
                    <IconClock size={18} color="purple" />
                    <Text fw={500}>Time:</Text>
                    <Text c="dimmed">
                      {new Date(
                        selectedSchedule.scheduledTime
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </Text>
                  </Group>
                  <Group spacing="sm">
                    <IconMapPin size={18} color="purple" />
                    <Text fw={500}>Location:</Text>
                    <Text c="dimmed">{selectedSchedule.location}</Text>
                  </Group>
                  <Group spacing="sm">
                    {getCommunicationIcon(selectedSchedule.modeOfCommunication)}
                    <Text fw={500}>Communication:</Text>
                    <Text c="dimmed">
                      {selectedSchedule.modeOfCommunication}
                    </Text>
                  </Group>
                </Stack>
              </Card>

              {/* Timeline for actual times */}
              {(selectedSchedule.actualStartTime ||
                selectedSchedule.actualEndTime) && (
                <Card withBorder radius="md" p="md">
                  <Title order={4} c="purple.7" mb="md">
                    Visit Timeline
                  </Title>
                  <Timeline
                    active={selectedSchedule.actualEndTime ? 2 : 1}
                    bulletSize={24}
                    lineWidth={2}
                  >
                    <Timeline.Item
                      bullet={<IconClock size={12} />}
                      title="Scheduled"
                      c="purple"
                    >
                      <Text c="dimmed" size="sm">
                        {new Date(
                          selectedSchedule.scheduledTime
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </Timeline.Item>

                    {selectedSchedule.actualStartTime && (
                      <Timeline.Item
                        bullet={<IconCheck size={12} />}
                        title="Started"
                        c="green"
                      >
                        <Text c="dimmed" size="sm">
                          {new Date(
                            selectedSchedule.actualStartTime
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Text>
                      </Timeline.Item>
                    )}

                    {selectedSchedule.actualEndTime && (
                      <Timeline.Item
                        bullet={<IconCheck size={12} />}
                        title="Completed"
                        c="green"
                      >
                        <Text c="dimmed" size="sm">
                          {new Date(
                            selectedSchedule.actualEndTime
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Text>
                      </Timeline.Item>
                    )}
                  </Timeline>
                </Card>
              )}

              {/* Visit Notes */}
              {selectedSchedule.visitNotes?.length > 0 && (
                <Card withBorder radius="md" p="md">
                  <Title order={4} c="purple.7" mb="md">
                    <Group spacing="sm">
                      <IconNotes size={18} />
                      Visit Notes
                    </Group>
                  </Title>
                  <Stack spacing="md">
                    {selectedSchedule.visitNotes.map((note) => (
                      <Box key={note.id} p="sm" bg="gray.0">
                        <Stack spacing="xs">
                          {note.observation && (
                            <div>
                              <Text size="sm" fw={500} c="purple.7">
                                Observation:
                              </Text>
                              <Text size="sm">{note.observation}</Text>
                            </div>
                          )}
                          {note.vitalSigns && (
                            <div>
                              <Text size="sm" fw={500} c="purple.7">
                                Vital Signs:
                              </Text>
                              <Text size="sm">{note.vitalSigns}</Text>
                            </div>
                          )}
                          {note.recommendations && (
                            <div>
                              <Text size="sm" fw={500} c="purple.7">
                                Recommendations:
                              </Text>
                              <Text size="sm">{note.recommendations}</Text>
                            </div>
                          )}
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                </Card>
              )}

              {/* Actions */}
              <Group position="right" mt="md">
                <Button onClick={close} variant="light" color="gray">
                  Close
                </Button>
              </Group>
            </Stack>
          ) : (
            <Center py="xl">
              <Text c="dimmed">No schedule selected</Text>
            </Center>
          )}
        </Modal>
      </Stack>
    </Container>
  );
};

export default Schedule;
