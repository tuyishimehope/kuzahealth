import { axiosInstance } from "@/utils/axiosInstance";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  Title,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconCalendar,
  IconClock,
  IconEye,
  IconMapPin,
  IconPhone,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from "mantine-react-table";
import { useMemo, useState } from "react";
import { RiExportFill } from "react-icons/ri";

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

const fetchSchedules = async (): Promise<Schedule[]> => {
  const res = await axiosInstance.get("/api/visits");
  return res.data;
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
  } = useQuery({
    queryKey: ["schedules"],
    queryFn: fetchSchedules,
  });
  console.log(isError);
  const filteredSchedules = useMemo(() => {
    return schedules.filter((s) =>
      s.visitType.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [schedules, searchQuery]);

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

  const handleDelete = (id: string) => {
    notifications.show({
      title: "Deleted",
      message: "Schedule deleted successfully",
      color: "green",
    });
    console.log(id);
    // Here you would use useMutation + queryClient.invalidateQueries
  };

  const columns = useMemo<MRT_ColumnDef<Schedule>[]>(
    () => [
      {
        accessorKey: "visitType",
        header: "Visit Type",
      },
      {
        accessorKey: "scheduledTime",
        header: "Date",
        Cell: ({ cell }) =>
          new Date(cell.getValue<string>()).toLocaleDateString(),
      },
      {
        accessorKey: "scheduledTimeTime",
        header: "Time",
        Cell: ({ row }) =>
          new Date(row.original.scheduledTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
      },
      {
        accessorKey: "location",
        header: "Location",
      },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ cell }) => (
          <Badge color={getStatusColor(cell.getValue<Schedule["status"]>())}>
            {String(cell.getValue())}
          </Badge>
        ),
      },
      {
        accessorKey: "actions",
        header: "Actions",
        Cell: ({ row }) => (
          <Group spacing={4}>
            <ActionIcon
              color="blue"
              onClick={() => handleViewDetails(row.original)}
            >
              <IconEye size={16} />
            </ActionIcon>
            <ActionIcon
              color="red"
              onClick={() => handleDelete(row.original.id)}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Group>
        ),
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: filteredSchedules,
    state: { isLoading },
    enableGlobalFilter: false,
    enableSorting: true,
    enableColumnFilters: false,
    enablePagination: true,
    initialState: {
      pagination: { pageSize: 10, pageIndex: 0 },
    },
  });

  return (
    <Box p="md">
      <Group position="apart" mb="md">
        <Title order={2}>View Schedules</Title>
        <Button leftIcon={<RiExportFill size={rem(16)} />}>Export</Button>
      </Group>

      <TextInput
        placeholder="Search by Visit Type"
        icon={<IconSearch size={16} />}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.currentTarget.value)}
        mb="md"
      />

      <MantineReactTable table={table} />

      <Modal
        opened={modalOpened}
        onClose={close}
        title="Schedule Details"
        size="lg"
      >
        {selectedSchedule && (
          <Stack spacing="md">
            <Group>
              <IconCalendar size={16} />
              <Text>
                Date:{" "}
                {new Date(selectedSchedule.scheduledTime).toLocaleDateString()}
              </Text>
            </Group>
            <Group>
              <IconClock size={16} />
              <Text>
                Time:{" "}
                {new Date(selectedSchedule.scheduledTime).toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </Text>
            </Group>
            <Group>
              <IconMapPin size={16} />
              <Text>Location: {selectedSchedule.location}</Text>
            </Group>
            <Group>
              <IconPhone size={16} />
              <Text>Communication: {selectedSchedule.modeOfCommunication}</Text>
            </Group>
            <Group position="right" mt="md">
              <Button variant="outline" onClick={close}>
                Close
              </Button>
              <Button>Edit Schedule</Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Box>
  );
};

export default Schedule;
