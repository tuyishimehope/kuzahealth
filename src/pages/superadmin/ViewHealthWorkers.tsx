import { axiosInstance } from "@/utils/axiosInstance";
import {
  ActionIcon,
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  LoadingOverlay,
  Modal,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconAlertCircle,
  IconCertificate,
  IconDownload,
  IconEdit,
  IconEye,
  IconMapPin,
  IconUsers,
} from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from "mantine-react-table";
import { useMemo, useState } from "react";
import logo1 from "@/assets/logo1.png"

export interface HealthWorker {
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

// ---------------- API ----------------
const fetchHealthWorkers = async (): Promise<HealthWorker[]> => {
  const res = await axiosInstance.get("/api/health-workers");
  return res.data;
};

const updateHealthWorker = async (worker: HealthWorker) => {
  const res = await axiosInstance.put(
    `/api/health-workers/${worker.id}`,
    worker
  );
  return res.data;
};

// ---------------- Component ----------------
const ViewHealthWorkers = () => {
  const [selectedWorker, setSelectedWorker] = useState<HealthWorker | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<HealthWorker>>({});

  const queryClient = useQueryClient();

  const {
    data: healthWorkers = [],
    isLoading,
    isError,
    error,
  } = useQuery<HealthWorker[]>({
    queryKey: ["health-workers"],
    queryFn: fetchHealthWorkers,
    staleTime: 5 * 60 * 1000,
  });

  const mutation = useMutation({
    mutationFn: updateHealthWorker,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["health-workers"] });
      setShowModal(false);
      setIsEditing(false);
      notifications.show({
        title: "Success",
        message: "Health worker updated successfully",
        color: "green",
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Error",
        message: "Failed to update health worker" + error,
        color: "red",
      });
    },
  });

  const getDisplayValue = (
    value: string | null | undefined,
    fallback: string = "Not specified"
  ) => {
    return value && value.trim() ? value : fallback;
  };

  const getInitials = (firstName: string, lastName: string) => {
    const first = getDisplayValue(firstName)[0] || "U";
    const last = getDisplayValue(lastName)[0] || "N";
    return `${first}${last}`;
  };

  const getFullName = (worker: HealthWorker) => {
    return `${getDisplayValue(worker.first_name)} ${getDisplayValue(
      worker.last_name
    )}`;
  };

  // Statistics
  const stats = useMemo(() => {
    const uniqueQualifications = [
      ...new Set(
        healthWorkers
          .map((w) => getDisplayValue(w.qualification))
          .filter((q) => q !== "Not specified")
      ),
    ];
    const uniqueServiceAreas = [
      ...new Set(
        healthWorkers
          .map((w) => getDisplayValue(w.service_area))
          .filter((a) => a !== "Not specified")
      ),
    ];

    return {
      total: healthWorkers.length,
      qualifications: uniqueQualifications.length,
      serviceAreas: uniqueServiceAreas.length,
    };
  }, [healthWorkers]);

  // PDF Export Function
  const handlePDFExport = () => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;

  // Header background
  pdf.setFillColor(37, 99, 235);
  pdf.rect(0, 0, pageWidth, 30, "F");

  // Add logo image (left side)
  // Format: pdf.addImage(imageData, format, x, y, width, height)
  pdf.addImage(logo1, "PNG", 10, 5, 20, 20); // 👈 Adjust width/height if needed

  // Header text (shifted right so it doesn’t overlap logo)
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.text("Health Workers Report", 40, 20);

  // Summary
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(12);
  const currentY = 45;
  pdf.text(`Total Health Workers: ${stats.total}`, 20, currentY);
  pdf.text(`Unique Qualifications: ${stats.qualifications}`, 20, currentY + 10);
  pdf.text(`Service Areas: ${stats.serviceAreas}`, 20, currentY + 20);
  pdf.text(
    `Report Generated: ${new Date().toLocaleDateString()}`,
    20,
    currentY + 30
  );

  // Table Data
  const tableData = healthWorkers.map((worker) => [
    getFullName(worker),
    getDisplayValue(worker.email),
    getDisplayValue(worker.qualification),
    getDisplayValue(worker.service_area),
    getDisplayValue(worker.phone_number),
    worker.createdAt
      ? new Date(worker.createdAt).toLocaleDateString()
      : "Not available",
  ]);

  autoTable(pdf, {
    head: [
      ["Name", "Email", "Qualification", "Service Area", "Phone", "Created"],
    ],
    body: tableData,
    startY: currentY + 45,
    theme: "grid",
    headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255] },
    styles: { fontSize: 8 },
  });

  pdf.save("health-workers-report.pdf");
};


  // Table Columns Definition
  const columns = useMemo<MRT_ColumnDef<HealthWorker>[]>(
    () => [
      {
        accessorKey: "worker",
        header: "Worker",
        size: 250,
        Cell: ({ row }) => (
          <Flex align="center" gap="md">
            <Avatar color="blue" radius="xl" size="md">
              {getInitials(row.original.first_name, row.original.last_name)}
            </Avatar>
            <Box>
              <Text fw={500} size="sm">
                {getFullName(row.original)}
              </Text>
              <Text size="xs" c="dimmed">
                {getDisplayValue(row.original.email)}
              </Text>
            </Box>
          </Flex>
        ),
        filterFn: (row, _id, filterValue) => {
          const fullName = getFullName(row.original).toLowerCase();
          const email = getDisplayValue(row.original.email).toLowerCase();
          return (
            fullName.includes(filterValue.toLowerCase()) ||
            email.includes(filterValue.toLowerCase())
          );
        },
      },
      {
        accessorKey: "qualification",
        header: "Qualification",
        size: 150,
        Cell: ({ row }) => (
          <Badge color="blue" variant="light" radius="md">
            {getDisplayValue(row.original.qualification)}
          </Badge>
        ),
        filterFn: "equals",
      },
      {
        accessorKey: "service_area",
        header: "Service Area",
        size: 150,
        Cell: ({ row }) => (
          <Text size="sm">{getDisplayValue(row.original.service_area)}</Text>
        ),
        filterFn: "equals",
      },
      {
        accessorKey: "phone_number",
        header: "Contact",
        size: 130,
        Cell: ({ row }) => (
          <Text size="sm">{getDisplayValue(row.original.phone_number)}</Text>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Joined",
        size: 120,
        Cell: ({ row }) => (
          <Text size="sm" c="dimmed">
            {row.original.createdAt
              ? new Date(row.original.createdAt).toLocaleDateString()
              : "Not available"}
          </Text>
        ),
        filterFn: "dateBetween",
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: healthWorkers,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    enableSorting: true,
    enablePagination: true,
    enableRowActions: true,
    initialState: {
      pagination: { pageSize: 10, pageIndex: 0 },
      showGlobalFilter: true,
    },
    paginationDisplayMode: "pages",
    positionGlobalFilter: "left",
    mantineSearchTextInputProps: {
      placeholder: "Search workers...",
      style: { minWidth: "300px" },
      variant: "filled",
    },
    renderRowActions: ({ row }) => (
      <Group spacing="xs">
        <ActionIcon
          color="blue"
          variant="light"
          onClick={() => {
            setSelectedWorker(row.original);
            setIsEditing(false);
            setShowModal(true);
          }}
          size="sm"
        >
          <IconEye size={16} />
        </ActionIcon>
        <ActionIcon
          color="orange"
          variant="light"
          onClick={() => {
            setSelectedWorker(row.original);
            setFormData(row.original);
            setIsEditing(true);
            setShowModal(true);
          }}
          size="sm"
        >
          <IconEdit size={16} />
        </ActionIcon>
      </Group>
    ),
    renderTopToolbarCustomActions: () => (
      <Button
        leftIcon={<IconDownload size={16} />}
        onClick={handlePDFExport}
        variant="light"
        color="green"
      >
        Export PDF
      </Button>
    ),
    mantineTableProps: {
      striped: true,
      highlightOnHover: true,
      withBorder: true,
      withColumnBorders: false,
    },
    mantinePaperProps: {
      shadow: "sm",
      withBorder: true,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedWorker) {
      mutation.mutate({ ...selectedWorker, ...formData });
    }
  };

  if (isError) {
    return (
      <Container size="lg" py="xl">
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Error loading data"
          color="red"
          variant="light"
        >
          {error?.message || "Failed to fetch health workers"}
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl" py="md">
      <Stack>
        {/* Header */}
        <Paper p="md" shadow="sm" withBorder>
          <Flex justify="space-between" align="center" mb="md">
            <Title order={2} c="blue">
              Health Workers Management
            </Title>
          </Flex>

          {/* Statistics Cards */}
          <Grid>
            <Grid.Col span={4}>
              <Card withBorder>
                <Group>
                  <IconUsers size={20} color="blue" />
                  <Box>
                    <Text size="lg" fw={700} c="blue">
                      {stats.total}
                    </Text>
                    <Text size="sm" c="dimmed">
                      Total Workers
                    </Text>
                  </Box>
                </Group>
              </Card>
            </Grid.Col>
            <Grid.Col span={4}>
              <Card withBorder>
                <Group>
                  <IconCertificate size={20} color="green" />
                  <Box>
                    <Text size="lg" fw={700} c="green">
                      {stats.qualifications}
                    </Text>
                    <Text size="sm" c="dimmed">
                      Qualifications
                    </Text>
                  </Box>
                </Group>
              </Card>
            </Grid.Col>
            <Grid.Col span={4}>
              <Card withBorder>
                <Group>
                  <IconMapPin size={20} color="orange" />
                  <Box>
                    <Text size="lg" fw={700} c="orange">
                      {stats.serviceAreas}
                    </Text>
                    <Text size="sm" c="dimmed">
                      Service Areas
                    </Text>
                  </Box>
                </Group>
              </Card>
            </Grid.Col>
          </Grid>
        </Paper>

        {/* Table */}
        <Paper shadow="sm" withBorder pos="relative">
          <LoadingOverlay visible={isLoading} />
          <MantineReactTable table={table} />
        </Paper>

        {/* Modal */}
        <Modal
          opened={showModal}
          onClose={() => setShowModal(false)}
          title={
            <Group>
              <Avatar color="blue" radius="xl" size="sm">
                {selectedWorker
                  ? getInitials(
                      selectedWorker.first_name,
                      selectedWorker.last_name
                    )
                  : ""}
              </Avatar>
              <Text fw={600}>
                {isEditing ? "Edit Health Worker" : "Health Worker Details"}
              </Text>
            </Group>
          }
          size="lg"
          centered
        >
          {selectedWorker && (
            <form onSubmit={handleSubmit}>
              <Stack>
                <Grid>
                  <Grid.Col span={6}>
                    <TextInput
                      label="First Name"
                      value={
                        isEditing
                          ? formData.first_name || ""
                          : getDisplayValue(selectedWorker.first_name)
                      }
                      onChange={(e) =>
                        isEditing &&
                        setFormData({ ...formData, first_name: e.target.value })
                      }
                      readOnly={!isEditing}
                      variant={isEditing ? "default" : "filled"}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Last Name"
                      value={
                        isEditing
                          ? formData.last_name || ""
                          : getDisplayValue(selectedWorker.last_name)
                      }
                      onChange={(e) =>
                        isEditing &&
                        setFormData({ ...formData, last_name: e.target.value })
                      }
                      readOnly={!isEditing}
                      variant={isEditing ? "default" : "filled"}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Email"
                      value={
                        isEditing
                          ? formData.email || ""
                          : getDisplayValue(selectedWorker.email)
                      }
                      onChange={(e) =>
                        isEditing &&
                        setFormData({ ...formData, email: e.target.value })
                      }
                      readOnly={!isEditing}
                      variant={isEditing ? "default" : "filled"}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Phone"
                      value={
                        isEditing
                          ? formData.phone_number || ""
                          : getDisplayValue(selectedWorker.phone_number)
                      }
                      onChange={(e) =>
                        isEditing &&
                        setFormData({
                          ...formData,
                          phone_number: e.target.value,
                        })
                      }
                      readOnly={!isEditing}
                      variant={isEditing ? "default" : "filled"}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Qualification"
                      value={
                        isEditing
                          ? formData.qualification || ""
                          : getDisplayValue(selectedWorker.qualification)
                      }
                      onChange={(e) =>
                        isEditing &&
                        setFormData({
                          ...formData,
                          qualification: e.target.value,
                        })
                      }
                      readOnly={!isEditing}
                      variant={isEditing ? "default" : "filled"}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Service Area"
                      value={
                        isEditing
                          ? formData.service_area || ""
                          : getDisplayValue(selectedWorker.service_area)
                      }
                      onChange={(e) =>
                        isEditing &&
                        setFormData({
                          ...formData,
                          service_area: e.target.value,
                        })
                      }
                      readOnly={!isEditing}
                      variant={isEditing ? "default" : "filled"}
                    />
                  </Grid.Col>
                </Grid>

                <Divider />

                <Flex justify="end" gap="sm">
                  <Button variant="light" onClick={() => setShowModal(false)}>
                    Close
                  </Button>
                  {isEditing && (
                    <Button type="submit" loading={mutation.isPending}>
                      Save Changes
                    </Button>
                  )}
                </Flex>
              </Stack>
            </form>
          )}
        </Modal>
      </Stack>
    </Container>
  );
};

export default ViewHealthWorkers;
