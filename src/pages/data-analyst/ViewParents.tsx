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
  Loader,
  Stack,
  ActionIcon,
  Tooltip,
  ThemeIcon,
} from "@mantine/core";
import { 
  IconDownload, 
  IconRefresh, 
  IconUsers, 
  IconAlertTriangle,
  IconUserPlus 
} from "@tabler/icons-react";
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

const fetchPatients = async (): Promise<Patient[]> => {
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
    isFetching,
  } = useQuery<Patient[]>({
    queryKey: ["patients"],
    queryFn: fetchPatients,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  // Statistics
  const stats = useMemo(() => {
    const totalPatients = patients.length;
    const highRiskCount = patients.filter(p => p.highRisk).length;
    const upcomingDeliveries = patients.filter(p => {
      if (!p.expectedDeliveryDate) return false;
      const edd = new Date(p.expectedDeliveryDate);
      const now = new Date();
      const diffTime = edd.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 30;
    }).length;

    return { totalPatients, highRiskCount, upcomingDeliveries };
  }, [patients]);

  const columns = useMemo<MRT_ColumnDef<Patient>[]>(
    () => [
      { 
        accessorKey: "firstName", 
        header: "First Name",
        size: 120,
      },
      { 
        accessorKey: "lastName", 
        header: "Last Name",
        size: 120,
      },
      { 
        accessorKey: "phone", 
        header: "Phone",
        size: 130,
        Cell: ({ cell }) => (
          <Text size="sm" color="dimmed">
            {cell.getValue<string>()}
          </Text>
        ),
      },
      {
        accessorKey: "expectedDeliveryDate",
        header: "Expected Delivery",
        size: 140,
        Cell: ({ cell }) => {
          const date = cell.getValue<string>();
          if (!date) return <Text size="sm" color="dimmed">-</Text>;
          
          const edd = new Date(date);
          const now = new Date();
          const diffTime = edd.getTime() - now.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          let color = "gray";
          if (diffDays < 0) color = "red";
          else if (diffDays <= 7) color = "orange";
          else if (diffDays <= 30) color = "yellow";
          
          return (
            <Stack spacing={2}>
              <Text size="sm" weight={500}>
                {edd.toLocaleDateString()}
              </Text>
              {diffDays >= 0 && (
                <Text size="xs" color={color}>
                  {diffDays} days
                </Text>
              )}
            </Stack>
          );
        },
      },
      { 
        accessorKey: "bloodGroup", 
        header: "Blood Group",
        size: 100,
        Cell: ({ cell }) => (
          <Badge 
            variant="outline" 
            color="violet" 
            size="sm"
          >
            {cell.getValue<string>()}
          </Badge>
        ),
      },
      {
        accessorKey: "highRisk",
        header: "Risk Level",
        size: 100,
        Cell: ({ cell }) => {
          const isHighRisk = cell.getValue<boolean>();
          return (
            <Badge 
              color={isHighRisk ? "red" : "teal"} 
              variant={isHighRisk ? "filled" : "light"}
              size="sm"
              leftSection={isHighRisk ? <IconAlertTriangle size={12} /> : undefined}
            >
              {isHighRisk ? "High Risk" : "Normal"}
            </Badge>
          );
        },
      },
    ],
    []
  );

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.setTextColor(102, 51, 153); // Purple color
    doc.text("Parents Report", 14, 20);
    
    // Stats
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Total Patients: ${stats.totalPatients} | High Risk: ${stats.highRiskCount} | Upcoming Deliveries: ${stats.upcomingDeliveries}`, 14, 30);

    const tableData = patients.map((p) => [
      p.firstName,
      p.lastName,
      p.phone,
      p.expectedDeliveryDate
        ? new Date(p.expectedDeliveryDate).toLocaleDateString()
        : "-",
      p.bloodGroup,
      p.highRisk ? "High Risk" : "Normal",
    ]);

    autoTable(doc, {
      startY: 40,
      head: [["First Name", "Last Name", "Phone", "Expected Delivery", "Blood Group", "Risk Level"]],
      body: tableData,
      theme: "striped",
      headStyles: { 
        fillColor: [102, 51, 153], // Purple header
        textColor: 255,
      },
      alternateRowStyles: { fillColor: [249, 246, 255] }, // Light purple
    });

    doc.save(`parents-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const table = useMantineReactTable({
    columns,
    data: patients,
    enableGlobalFilter: true,
    enableSorting: true,
    enableRowSelection: true,
    enableColumnFilters: true,
    enableDensityToggle: true,
    enableFullScreenToggle: true,
    positionActionsColumn: "last",
    globalFilterFn: "fuzzy",
    initialState: {
      density: "md",
      // pagination: { pageSize: 25 },
    },
    state: { 
      isLoading, 
      globalFilter, 
      rowSelection,
      showProgressBars: isFetching,
    },
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    mantineTableContainerProps: {
      sx: {
        borderRadius: theme.radius.lg,
        overflow: "hidden",
      },
    },
    mantineTableHeadCellProps: {
      sx: {
        backgroundColor: theme.colors.violet[0],
        color: theme.colors.violet[8],
        fontWeight: 600,
        borderBottom: `2px solid ${theme.colors.violet[2]}`,
      },
    },
    mantineTableBodyRowProps: ({ row }) => ({
      sx: {
        backgroundColor: row.index % 2 === 0 ? theme.white : theme.colors.gray[0],
        '&:hover': {
          backgroundColor: theme.colors.violet[0],
        },
      },
    }),
    renderTopToolbarCustomActions: () => (
      <Group spacing="sm">
        <Button
          leftIcon={<IconDownload size={18} />}
          variant="filled"
          color="violet"
          onClick={handleExportPDF}
          disabled={patients.length === 0}
          sx={{
            // background: theme.fn.linearGradient(45, theme.colors.violet[6], theme.colors.purple[6]),
          }}
        >
          Export PDF
        </Button>
        <Tooltip label="Refresh data">
          <ActionIcon
            variant="light"
            color="violet"
            onClick={() => refetch()}
            loading={isFetching}
            size="lg"
          >
            <IconRefresh size={18} />
          </ActionIcon>
        </Tooltip>
        <Button
          leftIcon={<IconUserPlus size={18} />}
          variant="outline"
          color="violet"
        >
          Add Parent
        </Button>
      </Group>
    ),
  });

  // Loading state
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          // background: theme.fn.linearGradient(135, theme.colors.violet[0], theme.colors.purple[0]),
        }}
      >
        <Stack align="center" spacing="md">
          <Loader size="lg" color="violet" />
          <Text size="lg" color="violet.7">Loading parents data...</Text>
        </Stack>
      </Box>
    );
  }

  // Error state
  if (isError) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: theme.fn.linearGradient(135, theme.colors.red[0], theme.colors.orange[0]),
          padding: theme.spacing.md,
        }}
      >
        <Paper 
          p="xl" 
          withBorder 
          shadow="lg" 
          radius="lg" 
          sx={{ 
            maxWidth: 500,
            background: theme.white,
          }}
        >
          <Stack align="center" spacing="md">
            <ThemeIcon size="xl" color="red" variant="light">
              <IconAlertTriangle size={32} />
            </ThemeIcon>
            <Title order={3} color="red.7" align="center">
              Oops! Something went wrong
            </Title>
            <Text color="dimmed" align="center">
              {(error as Error)?.message || "Failed to fetch patients data"}
            </Text>
            <Group>
              <Button 
                color="red" 
                variant="filled"
                leftIcon={<IconRefresh size={16} />}
                onClick={() => refetch()}
                loading={isFetching}
              >
                Try Again
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      p="lg"
      sx={{
        // background: theme.fn.linearGradient(135, theme.colors.violet[0], theme.colors.purple[0]),
        minHeight: "100vh",
      }}
    >
      <Stack spacing="lg">
        {/* Header */}
        <Group position="apart" align="center">
          <Group spacing="sm">
            <ThemeIcon size="xl" color="violet" variant="gradient" gradient={{ from: 'violet', to: 'purple' }}>
              <IconUsers size={24} />
            </ThemeIcon>
            <div>
              <Title order={1} color="violet.8">
                Parents Management
              </Title>
              <Text color="dimmed" size="sm">
                Manage and monitor expectant mothers
              </Text>
            </div>
          </Group>
        </Group>

        {/* Stats Cards */}
        <Group grow>
          <Paper p="md" radius="lg" withBorder shadow="sm">
            <Group position="apart">
              <div>
                <Text size="xs" color="dimmed" transform="uppercase" weight={600}>
                  Total Patients
                </Text>
                <Text size="xl" weight={700} color="violet.7">
                  {stats.totalPatients}
                </Text>
              </div>
              <ThemeIcon size="lg" color="violet" variant="light">
                <IconUsers size={20} />
              </ThemeIcon>
            </Group>
          </Paper>

          <Paper p="md" radius="lg" withBorder shadow="sm">
            <Group position="apart">
              <div>
                <Text size="xs" color="dimmed" transform="uppercase" weight={600}>
                  High Risk Cases
                </Text>
                <Text size="xl" weight={700} color="red.6">
                  {stats.highRiskCount}
                </Text>
              </div>
              <ThemeIcon size="lg" color="red" variant="light">
                <IconAlertTriangle size={20} />
              </ThemeIcon>
            </Group>
          </Paper>

          <Paper p="md" radius="lg" withBorder shadow="sm">
            <Group position="apart">
              <div>
                <Text size="xs" color="dimmed" transform="uppercase" weight={600}>
                  Due This Month
                </Text>
                <Text size="xl" weight={700} color="orange.6">
                  {stats.upcomingDeliveries}
                </Text>
              </div>
              <ThemeIcon size="lg" color="orange" variant="light">
                <IconDownload size={20} />
              </ThemeIcon>
            </Group>
          </Paper>
        </Group>

        {/* Main Table */}
        <Paper 
          shadow="lg" 
          radius="lg" 
          sx={{ 
            overflow: "hidden",
            background: theme.white,
          }}
        >
          {patients.length === 0 ? (
            <Box p="xl">
              <Stack align="center" spacing="md">
                <ThemeIcon size="xl" color="violet" variant="light">
                  <IconUsers size={32} />
                </ThemeIcon>
                <Title order={3} color="violet.7">
                  No patients found
                </Title>
                <Text color="dimmed" align="center">
                  Get started by adding your first patient to the system
                </Text>
                <Button color="violet" leftIcon={<IconUserPlus size={16} />}>
                  Add First Patient
                </Button>
              </Stack>
            </Box>
          ) : (
            <MantineReactTable table={table} />
          )}
        </Paper>
      </Stack>
    </Box>
  );
};

export default ViewParents;