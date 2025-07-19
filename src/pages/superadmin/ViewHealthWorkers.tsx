import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import {
  ActionIcon,
  Avatar,
  Button,
  Group,
  Modal,
  Stack,
  Text,
  Title,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconEdit, IconEye, IconTrash } from "@tabler/icons-react";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from "mantine-react-table";
import { FaFileExport } from "react-icons/fa";

interface HealthWorker {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  qualification: string;
  service_area: string;
}

const fetchHealthWorkers = async () => {
  const res = await axiosInstance.get("/api/health-workers");
  return res.data;
};

const ViewHealthWorkers = () => {
  const [selectedWorker, setSelectedWorker] = useState<HealthWorker | null>(
    null
  );
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  const [globalFilter, setGlobalFilter] = useState("");

  // Fetch health workers using React Query
  const {
    data: healthWorkers = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<HealthWorker[]>({
    queryKey: ["health-workers"],
    queryFn: fetchHealthWorkers,
  });
  console.log(error);

  const columns = useMemo<MRT_ColumnDef<HealthWorker>[]>(
    () => [
      {
        accessorKey: "fullName",
        header: "Name",
        Cell: ({ row }) => (
          <Group spacing="sm">
            <Avatar size={30} radius={30} />
            <div>
              <Text size="sm" fw={500}>
                {row.original.first_name} {row.original.last_name}
              </Text>
              <Text size="xs" c="dimmed">
                {row.original.email}
              </Text>
            </div>
          </Group>
        ),
      },
      {
        accessorKey: "qualification",
        header: "Qualification",
      },
      {
        accessorKey: "service_area",
        header: "Service Area",
      },
      {
        accessorKey: "phone_number",
        header: "Phone Number",
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        Cell: ({ cell }) =>
          new Date(cell.getValue<string>()).toLocaleDateString(),
      },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
        Cell: ({ cell }) =>
          new Date(cell.getValue<string>()).toLocaleDateString(),
      },
      {
        accessorKey: "actions",
        header: "Actions",
        Cell: ({ row }) => (
          <Group spacing={4}>
            <ActionIcon
              variant="subtle"
              color="blue"
              onClick={() => {
                setSelectedWorker(row.original);
                openModal();
              }}
            >
              <IconEye size={16} />
            </ActionIcon>
            <ActionIcon variant="subtle" color="green">
              <IconEdit size={16} />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
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
    data: healthWorkers,
    enableColumnActions: false,
    enableColumnFilters: false,
    enableGlobalFilter: true,
    positionGlobalFilter: "left",
    state: {
      isLoading: isLoading,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: { pageSize: 10, pageIndex: 0 },
      showGlobalFilter: true,
    },
  });

  const handleDelete = async (id: string) => {
    console.log(id);
    try {
      // await axiosInstance.delete(`/api/health-workers/${id}`);
      notifications.show({
        title: "Success",
        message: `Health worker deleted successfully`,
        color: "green",
      });
      refetch();
    } catch (error) {
      console.log(error);
      notifications.show({
        title: "Error",
        message: `Failed to delete health worker`,
        color: "red",
      });
    }
  };

  if (isError) return <Text>Error loading data</Text>;

  return (
    <Stack p="md" spacing="md">
      <Group position="apart">
        <Title order={2}>Health Workers</Title>
        <Button leftIcon={<FaFileExport size={rem(16)} />}>Export</Button>
      </Group>

      <MantineReactTable table={table} />

      <Modal
        opened={modalOpened}
        onClose={closeModal}
        title="Health Worker Details"
        size="lg"
      >
        {selectedWorker ? (
          <Stack>
            <Group>
              <Avatar size={80} radius={80} />
              <div>
                <Title order={3}>
                  {selectedWorker.first_name || "-"}{" "}
                  {selectedWorker.last_name || "-"}
                </Title>
                <Text c="dimmed">
                  {selectedWorker.qualification || "No qualification"}
                </Text>
              </div>
            </Group>
            <Text>Email: {selectedWorker.email || "-"}</Text>
            <Text>Phone: {selectedWorker.phone_number || "-"}</Text>
            <Text>Service Area: {selectedWorker.service_area || "-"}</Text>
            <Text>
              Created At:{" "}
              {selectedWorker.createdAt
                ? new Date(selectedWorker.createdAt).toLocaleDateString()
                : "N/A"}
            </Text>
            <Text>
              Updated At:{" "}
              {selectedWorker.updatedAt
                ? new Date(selectedWorker.updatedAt).toLocaleDateString()
                : "N/A"}
            </Text>
            <Group position="right" mt="md">
              <Button onClick={closeModal} variant="outline">
                Close
              </Button>
            </Group>
          </Stack>
        ) : (
          <Text>No worker selected</Text>
        )}
      </Modal>
    </Stack>
  );
};

export default ViewHealthWorkers;
