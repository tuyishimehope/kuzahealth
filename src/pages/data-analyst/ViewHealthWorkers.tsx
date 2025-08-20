import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import { useMemo, useState } from "react";

import {
  ActionIcon,
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Container,
  Divider,
  Flex,
  Group,
  LoadingOverlay,
  Modal,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconActivity,
  IconAlertCircle,
  IconBrandWhatsapp,
  IconCalendar,
  IconClock,
  IconDownload,
  IconEye,
  IconMail,
  IconMapPin,
  IconPhone,
  IconRefresh,
  IconShield,
  IconStethoscope,
  IconTrendingUp,
  IconUserCircle,
  IconUsers,
} from "@tabler/icons-react";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from "mantine-react-table";

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

const fetchHealthWorkers = async (): Promise<HealthWorker[]> => {
  const res = await axiosInstance.get("/api/health-workers");
  return res.data;
};
  export const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0]?.toUpperCase() || ""}${
      lastName?.[0]?.toUpperCase() || ""
    }`;
  };

const ViewHealthWorkers = () => {
  const [selectedWorker, setSelectedWorker] = useState<HealthWorker | null>(
    null
  );
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  const [globalFilter, setGlobalFilter] = useState("");

  const {
    data: healthWorkers = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<HealthWorker[]>({
    queryKey: ["health-workers"],
    queryFn: fetchHealthWorkers,
    staleTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: 1000,
  });

  const handleExport = () => {
    if (!healthWorkers || healthWorkers.length === 0) return;

    const dataToExport = healthWorkers.map((worker) => ({
      Name: `${worker.first_name} ${worker.last_name}`,
      Email: worker.email,
      Qualification: worker.qualification || "N/A",
      Phone: worker.phone_number || "N/A",
      ServiceArea: worker.service_area || "N/A",
      CreatedAt: new Date(worker.createdAt).toLocaleDateString(),
      UpdatedAt: new Date(worker.updatedAt).toLocaleDateString(),
    }));

    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(
      blob,
      `health_workers_${new Date().toISOString().split("T")[0]}.csv`
    );
  };



  const getWorkerStats = () => {
    const total = healthWorkers.length;
    const withQualifications = healthWorkers.filter(
      (w) => w.qualification
    ).length;
    const withServiceAreas = healthWorkers.filter((w) => w.service_area).length;
    const thisMonth = healthWorkers.filter((w) => {
      const created = new Date(w.createdAt);
      const now = new Date();
      return (
        created.getMonth() === now.getMonth() &&
        created.getFullYear() === now.getFullYear()
      );
    }).length;

    return { total, withQualifications, withServiceAreas, thisMonth };
  };

  const stats = getWorkerStats();

  const getQualificationColor = (qualification: string) => {
    const qual = qualification?.toLowerCase() || "";
    if (qual.includes("doctor") || qual.includes("physician")) return "red";
    if (qual.includes("nurse")) return "blue";
    if (qual.includes("therapist")) return "green";
    if (qual.includes("specialist")) return "orange";
    return "purple";
  };

  const columns = useMemo<MRT_ColumnDef<HealthWorker>[]>(
    () => [
      // Health Professional (Avatar + Name + Email)
      {
        header: "Health Professional",
        size: 300,
        accessorFn: (row) => `${row.first_name} ${row.last_name} ${row.email}`, // used for global search
        Cell: ({ row }) => (
          <Group spacing="md" py="xs" align="center">
            <Avatar
              size={44}
              radius="xl"
              variant="gradient"
              gradient={{ from: "#7C3AED", to: "#8B5CF6", deg: 135 }}
              styles={{
                root: {
                  boxShadow: "0 4px 12px rgba(147, 51, 234, 0.25)",
                  border: "2px solid rgba(255, 255, 255, 0.9)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px) scale(1.05)",
                    boxShadow: "0 6px 16px rgba(147, 51, 234, 0.35)",
                  },
                },
              }}
            >
              {getInitials(row.original.first_name, row.original.last_name)}
            </Avatar>

            <Box>
              <Text size="sm" fw={600} c="#6D28D9" mb={2}>
                {row.original.first_name} {row.original.last_name}
              </Text>
              <Group spacing={6}>
                <ThemeIcon
                  size={16}
                  variant="light"
                  color="grape"
                  radius="xl"
                  style={{
                    background:
                      "linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)",
                    color: "white",
                  }}
                >
                  <IconMail size={10} />
                </ThemeIcon>
                <Text size="xs" c="dimmed" truncate maw={200}>
                  {row.original.email}
                </Text>
              </Group>
            </Box>
          </Group>
        ),
        filterFn: (row, _id, filterValue) => {
          const fullName =
            `${row.original.first_name} ${row.original.last_name}`.toLowerCase();
          const email = row.original.email.toLowerCase();
          return (
            fullName.includes(filterValue.toLowerCase()) ||
            email.includes(filterValue.toLowerCase())
          );
        },
      },

      // Qualification
      {
        accessorKey: "qualification",
        header: "Qualification",
        size: 200,
        Cell: ({ cell }) => {
          const qualification = cell.getValue<string>() || "Not specified";
          return (
            <Badge
              variant="light"
              color={getQualificationColor(qualification)}
              size="md"
              radius="lg"
              styles={{ root: { textTransform: "none", fontWeight: 500 } }}
              leftSection={<IconStethoscope size={12} />}
            >
              {qualification}
            </Badge>
          );
        },
      },

      // Service Area
      {
        accessorKey: "service_area",
        header: "Service Area",
        size: 180,
        Cell: ({ cell }) => (
          <Group spacing={8} align="center">
            <ThemeIcon size={20} variant="light" color="purple" radius="md">
              <IconMapPin size={12} />
            </ThemeIcon>
            <Text size="sm" fw={500}>
              {cell.getValue<string>() || "Not specified"}
            </Text>
          </Group>
        ),
      },

      // Contact / Phone
      {
        accessorKey: "phone_number",
        header: "Contact",
        size: 160,
        Cell: ({ cell }) => {
          const phone = cell.getValue<string>();
          return phone ? (
            <Group spacing={8} align="center">
              <ThemeIcon size={20} variant="light" color="green" radius="md">
                <IconPhone size={12} />
              </ThemeIcon>
              <Text size="sm" ff="monospace" fw={500}>
                {phone}
              </Text>
            </Group>
          ) : (
            <Text size="sm" c="dimmed" fs="italic">
              Not provided
            </Text>
          );
        },
      },

      // Joined Date
      {
        accessorKey: "createdAt",
        header: "Joined",
        size: 140,
        Cell: ({ cell }) => (
          <Group spacing={8} align="center">
            <ThemeIcon size={20} variant="light" color="blue" radius="md">
              <IconCalendar size={12} />
            </ThemeIcon>
            <Text size="sm" fw={500}>
              {cell.getValue<string>()
                ? new Date(cell.getValue<string>()).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  )
                : "N/A"}
            </Text>
          </Group>
        ),
      },

      // Actions
      {
        accessorKey: "actions",
        header: "Actions",
        enableColumnFilter: false,
        enableSorting: false,
        size: 80,
        Cell: ({ row }) => (
          <Tooltip label="View detailed profile" position="top" withArrow>
            <ActionIcon
              variant="light"
              color="purple"
              size="lg"
              radius="lg"
              onClick={() => {
                setSelectedWorker(row.original);
                openModal();
              }}
              styles={{
                root: {
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.1)",
                    boxShadow: "0 4px 12px rgba(147, 51, 234, 0.25)",
                  },
                },
              }}
            >
              <IconEye size={18} />
            </ActionIcon>
          </Tooltip>
        ),
      },
    ],
    [openModal]
  );

  const table = useMantineReactTable({
    columns,
    data: healthWorkers,
    enableColumnActions: false,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    positionGlobalFilter: "left",
    enableSorting: true,
    enablePagination: true,
    enableRowSelection: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableHiding: false,
    state: {
      isLoading: isLoading,
      globalFilter,
      showGlobalFilter: true,
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: { pageSize: 12, pageIndex: 0 },
      density: "xs",
    },
    mantineTableProps: {
      striped: false,
      highlightOnHover: true,
      withBorder: false,
      sx: {
        "& thead tr th": {
          backgroundColor: "rgba(147, 51, 234, 0.04)",
          color: "#6b21a8",
          fontWeight: 600,
          fontSize: "14px",
          borderBottom: "2px solid rgba(147, 51, 234, 0.1)",
        },
        "& tbody tr": {
          transition: "all 0.2s ease",
        },
        "& tbody tr:hover": {
          backgroundColor: "rgba(147, 51, 234, 0.02)",
          transform: "translateY(-1px)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        },
        "& td": {
          borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
        },
      },
    },
    mantinePaperProps: {
      shadow: "sm",
      radius: "lg",
      sx: {
        overflow: "hidden",
        border: "1px solid rgba(147, 51, 234, 0.08)",
      },
    },
    mantineTopToolbarProps: {
      sx: {
        backgroundColor: "rgba(249, 250, 251, 0.8)",
        borderBottom: "1px solid rgba(147, 51, 234, 0.1)",
        backdropFilter: "blur(10px)",
      },
    },
    mantineBottomToolbarProps: {
      sx: {
        backgroundColor: "rgba(249, 250, 251, 0.8)",
        borderTop: "1px solid rgba(147, 51, 234, 0.1)",
        backdropFilter: "blur(10px)",
      },
    },
  });

  if (isError) {
    return (
      <Container size="lg" py="xl">
        <Alert
          icon={<IconAlertCircle size={20} />}
          title="Unable to Load Health Workers"
          color="red"
          variant="light"
          radius="lg"
          styles={{
            root: {
              border: "1px solid rgba(239, 68, 68, 0.2)",
            },
          }}
        >
          <Stack spacing="sm">
            <Text size="sm">
              {error instanceof Error
                ? error.message
                : "Failed to load health workers data. Please try again."}
            </Text>
            <Button
              variant="light"
              color="red"
              size="sm"
              leftIcon={<IconRefresh size={16} />}
              onClick={() => refetch()}
              mt="sm"
            >
              Try Again
            </Button>
          </Stack>
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl" py="lg">
      <Stack spacing="xl">
        {/* Enhanced Header Section */}
        <Card
          shadow="sm"
          p="xl"
          radius="xl"
          withBorder
          styles={{
            root: {
              background:
                "linear-gradient(135deg, rgba(147, 51, 234, 0.02) 0%, rgba(147, 51, 234, 0.06) 100%)",
              border: "1px solid rgba(147, 51, 234, 0.1)",
            },
          }}
        >
          <Flex justify="space-between" align="flex-start" mb="xl">
            <Box>
              <Title order={1} c="purple.8" mb="xs" fw={700}>
                Health Workers Directory
              </Title>
              <Text size="md" c="dimmed" mb="lg">
                Comprehensive management of healthcare professionals in your
                network
              </Text>

              {/* Quick Stats */}
              <SimpleGrid
                cols={4}
                spacing="md"
                breakpoints={[{ maxWidth: "sm", cols: 2 }]}
              >
                <Card padding="md" radius="lg" bg="white" withBorder>
                  <Group spacing="sm">
                    <ThemeIcon
                      size="lg"
                      variant="light"
                      color="purple"
                      radius="lg"
                    >
                      <IconUsers size={20} />
                    </ThemeIcon>
                    <Box>
                      <Text size="lg" fw={700} c="purple.8">
                        {stats.total}
                      </Text>
                      <Text size="xs" c="dimmed">
                        Total Workers
                      </Text>
                    </Box>
                  </Group>
                </Card>

                <Card padding="md" radius="lg" bg="white" withBorder>
                  <Group spacing="sm">
                    <ThemeIcon
                      size="lg"
                      variant="light"
                      color="blue"
                      radius="lg"
                    >
                      <IconShield size={20} />
                    </ThemeIcon>
                    <Box>
                      <Text size="lg" fw={700} c="blue.7">
                        {stats.withQualifications}
                      </Text>
                      <Text size="xs" c="dimmed">
                        Qualified
                      </Text>
                    </Box>
                  </Group>
                </Card>

                <Card padding="md" radius="lg" bg="white" withBorder>
                  <Group spacing="sm">
                    <ThemeIcon
                      size="lg"
                      variant="light"
                      color="green"
                      radius="lg"
                    >
                      <IconMapPin size={20} />
                    </ThemeIcon>
                    <Box>
                      <Text size="lg" fw={700} c="green.7">
                        {stats.withServiceAreas}
                      </Text>
                      <Text size="xs" c="dimmed">
                        With Areas
                      </Text>
                    </Box>
                  </Group>
                </Card>

                <Card padding="md" radius="lg" bg="white" withBorder>
                  <Group spacing="sm">
                    <ThemeIcon
                      size="lg"
                      variant="light"
                      color="orange"
                      radius="lg"
                    >
                      <IconTrendingUp size={20} />
                    </ThemeIcon>
                    <Box>
                      <Text size="lg" fw={700} c="orange.7">
                        {stats.thisMonth}
                      </Text>
                      <Text size="xs" c="dimmed">
                        This Month
                      </Text>
                    </Box>
                  </Group>
                </Card>
              </SimpleGrid>
            </Box>

            <Button
              leftIcon={<IconDownload size={18} />}
              onClick={handleExport}
              disabled={healthWorkers.length === 0}
              loading={isLoading}
              size="md"
              radius="lg"
              styles={{
                root: {
                  background:
                    "linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)",
                  color: "white",
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(147, 51, 234, 0.25)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    background:
                      "linear-gradient(135deg, #6D28D9 0%, #7C3AED 100%)",
                    boxShadow: "0 6px 16px rgba(147, 51, 234, 0.35)",
                  },
                  "&:disabled": {
                    background: "#E9D5FF",
                    color: "#A78BFA",
                    boxShadow: "none",
                    transform: "none",
                  },
                },
              }}
            >
              Export Data
            </Button>
          </Flex>
        </Card>

        {/* Enhanced Table Section */}
        <Paper
          shadow="md"
          radius="xl"
          pos="relative"
          styles={{
            root: {
              border: "1px solid rgba(147, 51, 234, 0.08)",
              overflow: "hidden",
            },
          }}
        >
          <LoadingOverlay
            visible={isLoading}
            overlayBlur={3}
            overlayColor="rgba(255, 255, 255, 0.8)"
            radius="xl"
          />
          <MantineReactTable table={table} />
        </Paper>

        {/* Enhanced Detail Modal */}
        <Modal
          opened={modalOpened}
          onClose={closeModal}
          title={
            <Group spacing="md">
              <ThemeIcon
                size="xl"
                variant="gradient"
                gradient={{ from: "purple", to: "violet" }}
                radius="xl"
              >
                <IconUserCircle size={24} />
              </ThemeIcon>
              <div>
                <Title order={3} c="purple.8">
                  Health Worker Profile
                </Title>
                <Text size="sm" c="dimmed">
                  Detailed information and contact details
                </Text>
              </div>
            </Group>
          }
          size="lg"
          radius="xl"
          shadow="xl"
          centered
          padding="xl"
          styles={{
            content: {
              maxHeight: "90vh",
              overflow: "auto",
            },
          }}
        >
          {selectedWorker ? (
            <Stack spacing="xl">
              {/* Enhanced Profile Header */}
              <Card
                withBorder
                radius="xl"
                p="xl"
                styles={{
                  root: {
                    background:
                      "linear-gradient(135deg, rgba(147, 51, 234, 0.04) 0%, rgba(147, 51, 234, 0.08) 100%)",
                    border: "1px solid rgba(147, 51, 234, 0.15)",
                  },
                }}
              >
                <Group spacing="xl" align="center">
                  <Avatar
                    size={100}
                    radius="xl"
                    variant="gradient"
                    gradient={{ from: "#7C3AED", to: "#8B5CF6", deg: 135 }} // purple → violet
                    styles={{
                      root: {
                        boxShadow: "0 8px 24px rgba(147, 51, 234, 0.25)",
                        border: "3px solid rgba(255, 255, 255, 0.95)",
                        transition: "all 0.25s ease",
                        background:
                          "linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)",
                        "&:hover": {
                          transform: "translateY(-4px) scale(1.05)",
                          boxShadow: "0 10px 28px rgba(147, 51, 234, 0.35)",
                        },
                      },
                    }}
                  >
                    <Text size="xl" fw={700} c="white">
                      {getInitials(
                        selectedWorker.first_name,
                        selectedWorker.last_name
                      )}
                    </Text>
                  </Avatar>

                  <Box>
                    <Title order={2} c="purple.8" mb="xs">
                      {selectedWorker.first_name} {selectedWorker.last_name}
                    </Title>
                    <Badge
                      variant="light"
                      color={getQualificationColor(
                        selectedWorker.qualification || ""
                      )}
                      size="lg"
                      radius="lg"
                      mb="sm"
                      leftSection={<IconStethoscope size={14} />}
                    >
                      {selectedWorker.qualification ||
                        "No qualification specified"}
                    </Badge>
                    <Group spacing="lg" mt="md">
                      <Badge
                        variant="outline"
                        color="purple"
                        leftSection={<IconActivity size={12} />}
                      >
                        Active Professional
                      </Badge>
                      <Badge
                        variant="outline"
                        color="green"
                        leftSection={<IconClock size={12} />}
                      >
                        Available
                      </Badge>
                    </Group>
                  </Box>
                </Group>
              </Card>

              {/* Enhanced Contact Information */}
              <Card withBorder radius="xl" p="lg">
                <Title order={4} c="purple.7" mb="lg" fw={600}>
                  Contact Information
                </Title>
                <Stack spacing="lg">
                  <Group spacing="md">
                    <ThemeIcon
                      size="lg"
                      variant="light"
                      color="purple"
                      radius="lg"
                    >
                      <IconMail size={20} />
                    </ThemeIcon>
                    <Box>
                      <Text size="sm" fw={600} c="gray.7">
                        Email Address
                      </Text>
                      <Text size="md" mt={2}>
                        {selectedWorker.email || (
                          <Text fs="italic" c="dimmed">
                            Not provided
                          </Text>
                        )}
                      </Text>
                    </Box>
                  </Group>

                  <Divider variant="dotted" />

                  <Group spacing="md">
                    <ThemeIcon
                      size="lg"
                      variant="light"
                      color="green"
                      radius="lg"
                    >
                      <IconPhone size={20} />
                    </ThemeIcon>
                    <Box>
                      <Text size="sm" fw={600} c="gray.7">
                        Phone Number
                      </Text>
                      <Text size="md" mt={2} ff="monospace" fw={500}>
                        {selectedWorker.phone_number || (
                          <Text fs="italic" c="dimmed">
                            Not provided
                          </Text>
                        )}
                      </Text>
                    </Box>
                    {selectedWorker.phone_number && (
                      <ActionIcon
                        size="lg"
                        variant="light"
                        color="green"
                        radius="lg"
                      >
                        <IconBrandWhatsapp size={20} />
                      </ActionIcon>
                    )}
                  </Group>

                  <Divider variant="dotted" />

                  <Group spacing="md">
                    <ThemeIcon
                      size="lg"
                      variant="light"
                      color="blue"
                      radius="lg"
                    >
                      <IconMapPin size={20} />
                    </ThemeIcon>
                    <Box>
                      <Text size="sm" fw={600} c="gray.7">
                        Service Area
                      </Text>
                      <Text size="md" mt={2}>
                        {selectedWorker.service_area || (
                          <Text fs="italic" c="dimmed">
                            Not specified
                          </Text>
                        )}
                      </Text>
                    </Box>
                  </Group>
                </Stack>
              </Card>

              {/* Enhanced System Information */}
              <Card withBorder radius="xl" p="lg">
                <Title order={4} c="purple.7" mb="lg" fw={600}>
                  System Information
                </Title>
                <Stack spacing="lg">
                  <Group spacing="md">
                    <ThemeIcon
                      size="lg"
                      variant="light"
                      color="blue"
                      radius="lg"
                    >
                      <IconCalendar size={20} />
                    </ThemeIcon>
                    <Box>
                      <Text size="sm" fw={600} c="gray.7">
                        Date Joined
                      </Text>
                      <Text size="md" mt={2}>
                        {new Date(selectedWorker.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {new Date(selectedWorker.createdAt).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </Text>
                    </Box>
                  </Group>

                  <Divider variant="dotted" />

                  <Group spacing="md">
                    <ThemeIcon
                      size="lg"
                      variant="light"
                      color="orange"
                      radius="lg"
                    >
                      <IconClock size={20} />
                    </ThemeIcon>
                    <Box>
                      <Text size="sm" fw={600} c="gray.7">
                        Last Updated
                      </Text>
                      <Text size="md" mt={2}>
                        {new Date(selectedWorker.updatedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {new Date(selectedWorker.updatedAt).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </Text>
                    </Box>
                  </Group>
                </Stack>
              </Card>

              {/* Enhanced Actions */}
              <Group position="right" mt="lg">
                <Button
                  onClick={closeModal}
                  variant="light"
                  color="gray"
                  size="md"
                  radius="lg"
                >
                  Close Profile
                </Button>
              </Group>
            </Stack>
          ) : (
            <Center py="xl">
              <Stack align="center" spacing="md">
                <ThemeIcon size="xl" variant="light" color="gray" radius="xl">
                  <IconUserCircle size={32} />
                </ThemeIcon>
                <Text c="dimmed" size="lg">
                  No worker profile selected
                </Text>
              </Stack>
            </Center>
          )}
        </Modal>
      </Stack>
    </Container>
  );
};

export default ViewHealthWorkers;
