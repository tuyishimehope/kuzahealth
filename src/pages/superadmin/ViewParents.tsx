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
import logo1 from "@/assets/logo1.png";

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
            <Badge color="red" variant="light">
              Yes
            </Badge>
          ) : (
            <Badge color="green" variant="light">
              No
            </Badge>
          ),
      },
    ],
    []
  );

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // === Header ===
    doc.setFillColor(124, 58, 237); // Purple
    doc.rect(0, 0, pageWidth, 30, "F");

     // White circle background for logo
  const centerX = 20; // circle center X
  const centerY = 15; // circle center Y
  const radius = 12;  // circle radius

  doc.setFillColor(255, 255, 255); // white
  doc.circle(centerX, centerY, radius, "F"); // "F" = fill only

  // Logo (drawn on top of circle)
  doc.addImage(logo1, "PNG", centerX - 10, centerY - 10, 20, 20);


    // Header text (shifted right so it doesn’t overlap logo)
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("Parents Report", 40, 20);

    // === Summary Section ===
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    const currentY = 45;

    doc.text(`Total Parents: ${patients.length}`, 14, currentY);
    doc.text(
      `High-Risk Cases: ${patients.filter((p) => p.highRisk).length}`,
      14,
      currentY + 10
    );
    doc.text(
      `Blood Groups: ${
        [...new Set(patients.map((p) => p.bloodGroup || "-"))].length
      }`,
      14,
      currentY + 20
    );
    doc.text(
      `Report Generated: ${new Date().toLocaleDateString()}`,
      14,
      currentY + 30
    );

    // === Table Data ===
    const tableData = patients.map((p) => [
      p.firstName,
      p.lastName,
      p.phone || "-",
      p.expectedDeliveryDate
        ? new Date(p.expectedDeliveryDate).toLocaleDateString()
        : "-",
      p.bloodGroup || "-",
      p.highRisk ? "Yes" : "No",
    ]);

    autoTable(doc, {
      startY: currentY + 45,
      head: [
        [
          "First Name",
          "Last Name",
          "Phone",
          "EDD",
          "Blood Group",
          "High Risk?",
        ],
      ],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [124, 58, 237],
        textColor: [255, 255, 255],
        halign: "center",
      },
      styles: { fontSize: 9 },
      alternateRowStyles: { fillColor: [245, 243, 255] },
    });

    // === Footer (Page Number) ===
    const pageCount = (doc as any).internal.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth - 30,
        doc.internal.pageSize.height - 10
      );
    }

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
          color="purple"
          className="bg-purple-600 hover:bg-purple-500"
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
