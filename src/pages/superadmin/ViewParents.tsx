import { axiosInstance } from "@/utils/axiosInstance";
import {
  Badge,
  Box,
  Button,
  Group,
  Paper,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from "mantine-react-table";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  expectedDeliveryDate: string;
  bloodGroup: string;
  maritalStatus: string;
  emergencyContactFullName: string;
  emergencyContactNumber: string;
  emergencyContactRelationship: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  highRisk: boolean;
  createdAt: string;
  updatedAt: string;
}

const fetchPatients = async () => {
  const response = await axiosInstance.get("/api/parents");
  return response.data;
};

const ViewParents = () => {
  const theme = useMantineTheme();
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedStatus] = useState<"all" | Patient["maritalStatus"]>("all");
  const [rowSelection, setRowSelection] = useState({});

  const {
    data: patients = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Patient[]>({
    queryKey: ["patients"],
    queryFn: fetchPatients,
  });

  const columns = useMemo<MRT_ColumnDef<Patient>[]>(
    () => [
      { accessorKey: "id", header: "ID", size: 100 },
      { accessorKey: "firstName", header: "First Name", size: 120 },
      { accessorKey: "lastName", header: "Last Name", size: 120 },
      { accessorKey: "phone", header: "Phone", size: 140 },
      {
        accessorKey: "expectedDeliveryDate",
        header: "EDD",
        size: 120,
        Cell: ({ cell }) =>
          new Date(cell.getValue<string>()).toLocaleDateString(),
      },
      { accessorKey: "bloodGroup", header: "Blood Group", size: 100 },
      {
        accessorKey: "highRisk",
        header: "High Risk?",
        size: 100,
        Cell: ({ cell }) =>
          cell.getValue<boolean>() ? (
            <Badge color="red">Yes</Badge>
          ) : (
            <Badge color="green">No</Badge>
          ),
      },
    ],
    []
  );

  const filteredData = useMemo(() => {
    return selectedStatus === "all"
      ? patients
      : patients.filter((p) => p.maritalStatus === selectedStatus);
  }, [patients, selectedStatus]);

  const table = useMantineReactTable({
    columns,
    data: filteredData,
    enableGlobalFilter: true,
    enableSorting: true,
    enableRowSelection: true,
    enableRowActions: true,
    positionActionsColumn: "last",
    globalFilterFn: "fuzzy",
    state: {
      isLoading,
      globalFilter,
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    renderTopToolbarCustomActions: () => (
      <Group ml="xs">
        <Button
          leftIcon={<IconDownload size={20} />}
          variant="light"
          color="blue"
          onClick={() => console.log("Export data")}
        >
          Export
        </Button>
      </Group>
    ),
  });

  if (isError) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Paper p="xl" withBorder shadow="md" radius="md" sx={{ maxWidth: 500 }}>
          <Title order={3} color="red">
            We've hit rough waters!
          </Title>
          <Text my="md">
            {(error as Error)?.message || "Failed to fetch patients"}
          </Text>
          <Button color="red" onClick={() => refetch()}>
            Try Again
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      p="md"
      sx={{
        background: theme.fn.linearGradient(45, "#f6f9fc", "#edf2f7"),
        height: "100vh",
      }}
    >
      <MantineReactTable table={table} />
    </Box>
  );
};

export default ViewParents;
