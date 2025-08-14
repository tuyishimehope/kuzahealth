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
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

  // Columns without ID
  const columns = useMemo<MRT_ColumnDef<Patient>[]>(
    () => [
      { accessorKey: "firstName", header: "First Name" },
      { accessorKey: "lastName", header: "Last Name" },
      { accessorKey: "phone", header: "Phone" },
      {
        accessorKey: "expectedDeliveryDate",
        header: "EDD",
        Cell: ({ cell }) =>
          cell.getValue<string>()
            ? new Date(cell.getValue<string>()).toLocaleDateString()
            : "-",
      },
      { accessorKey: "bloodGroup", header: "Blood Group" },
      {
        accessorKey: "highRisk",
        header: "High Risk?",
        Cell: ({ cell }) =>
          cell.getValue<boolean>() ? (
            <Badge color="red" variant="light">Yes</Badge>
          ) : (
            <Badge color="green" variant="light">No</Badge>
          ),
      },
    ],
    []
  );

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Parents Report", 14, 15);

    const tableData = patients.map((p) => [
      p.firstName,
      p.lastName,
      p.phone,
      p.expectedDeliveryDate
        ? new Date(p.expectedDeliveryDate).toLocaleDateString()
        : "-",
      p.bloodGroup,
      p.highRisk ? "Yes" : "No",
    ]);

    autoTable(doc, {
      startY: 20,
      head: [["First Name", "Last Name", "Phone", "EDD", "Blood Group", "High Risk?"]],
      body: tableData,
    });

    doc.save("parents-report.pdf");
  };

  const table = useMantineReactTable({
    columns,
    data: patients,
    enableGlobalFilter: true,
    enableSorting: true,
    enableRowSelection: true,
    enableColumnFilters: true,
    positionActionsColumn: "last",
    globalFilterFn: "fuzzy",
    state: { isLoading, globalFilter, rowSelection },
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    mantineTableContainerProps: {
      sx: {
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        borderRadius: theme.radius.md,
        overflow: "hidden",
        backgroundColor: theme.white,
      },
    },
    renderTopToolbarCustomActions: () => (
      <Group spacing="sm">
        <Button
          leftIcon={<IconDownload size={20} />}
          variant="filled"
          color="blue"
          onClick={handleExportPDF}
        >
          Export PDF
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
          <Text my="md">{(error as Error)?.message || "Failed to fetch patients"}</Text>
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
        minHeight: "100vh",
      }}
    >
      <Paper p="sm" shadow="xs" radius="md" sx={{ overflowX: "auto" }}>
        <MantineReactTable table={table} />
      </Paper>
    </Box>
  );
};

export default ViewParents;
