import { axiosInstance } from "@/utils/axiosInstance";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Divider,
  Group,
  Loader,
  Modal,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
  useMantineTheme,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconBabyCarriage,
  IconCalendar,
  IconClock,
  IconDownload,
  IconRefresh,
  IconRuler,
  IconScale,
  IconUserPlus,
  IconUsers,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from "mantine-react-table";
import { useMemo, useState } from "react";
import type { Child } from "../HealthWorker/infants/ViewInfants";

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  expectedDeliveryDate: string;
  bloodGroup: string;
  highRisk: boolean;
}

const fetchPatients = async (): Promise<Patient[]> => {
  const { data } = await axiosInstance.get("/api/parents");
  return data;
};

const fetchInfant = async (parentId: string): Promise<Child[] | null> => {
  try {
    const { data } = await axiosInstance.get(`/api/infants/mother/${parentId}`);
    return data || null;
  } catch {
    return null;
  }
};

const ViewParents = () => {
  const theme = useMantineTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<Patient | null>(null);
  const [infant, setInfant] = useState<Child[] | null>(null);

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
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  // Statistics
  const stats = useMemo(() => {
    const totalPatients = patients.length;
    const highRiskCount = patients.filter((p) => p.highRisk).length;
    const upcomingDeliveries = patients.filter((p) => {
      if (!p.expectedDeliveryDate) return false;
      const edd = new Date(p.expectedDeliveryDate);
      const diffDays = Math.ceil(
        (edd.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      return diffDays >= 0 && diffDays <= 30;
    }).length;
    return { totalPatients, highRiskCount, upcomingDeliveries };
  }, [patients]);

  const handleViewInfant = async (parent: Patient) => {
    setSelectedParent(parent);
    const data = await fetchInfant(parent.id);
    setInfant(data);
    setModalOpen(true);
  };
  {
    /* Helper function - place this outside the component */
  }
  const calculateAge = (birthDate: string): string => {
    try {
      const birth = new Date(birthDate);
      const today = new Date();
      const months =
        (today.getFullYear() - birth.getFullYear()) * 12 +
        (today.getMonth() - birth.getMonth());

      if (months < 1) {
        const days = Math.floor(
          (today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24)
        );
        return `${days} ${days === 1 ? "day" : "days"} old`;
      } else if (months < 12) {
        return `${months} ${months === 1 ? "month" : "months"} old`;
      } else {
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        if (remainingMonths === 0) {
          return `${years} ${years === 1 ? "year" : "years"} old`;
        } else {
          return `${years}y ${remainingMonths}m old`;
        }
      }
    } catch {
      return "Unknown";
    }
  };

  const columns = useMemo<MRT_ColumnDef<Patient>[]>(
    () => [
      { accessorKey: "firstName", header: "First Name", size: 120 },
      { accessorKey: "lastName", header: "Last Name", size: 120 },
      { accessorKey: "phone", header: "Phone", size: 130 },
      {
        accessorKey: "expectedDeliveryDate",
        header: "Expected Delivery",
        size: 140,
        Cell: ({ cell }) => {
          const date = cell.getValue<string>();
          if (!date)
            return (
              <Text size="sm" color="dimmed">
                -
              </Text>
            );

          const edd = new Date(date);
          const diffDays = Math.ceil(
            (edd.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );
          const color =
            diffDays < 0
              ? "red"
              : diffDays <= 7
              ? "orange"
              : diffDays <= 30
              ? "yellow"
              : "gray";

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
          <Badge variant="outline" color="violet" size="sm">
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
              leftSection={
                isHighRisk ? <IconAlertTriangle size={12} /> : undefined
              }
            >
              {isHighRisk ? "High Risk" : "Normal"}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        size: 100,
        Cell: ({ row }) => (
          <Button
            size="xs"
            color="violet"
            variant="outline"
            onClick={() => handleViewInfant(row.original)}
          >
            View Infant
          </Button>
        ),
      },
    ],
    []
  );

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
    state: { isLoading, showProgressBars: isFetching },
    onRowSelectionChange: () => {},
  });

  if (isLoading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Stack align="center">
          <Loader size="lg" color="violet" />
          <Text size="lg" color="violet.7">
            Loading parents data...
          </Text>
        </Stack>
      </Box>
    );

  if (isError)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          padding: theme.spacing.md,
        }}
      >
        <Paper
          p="xl"
          withBorder
          shadow="lg"
          radius="lg"
          sx={{ maxWidth: 500, background: theme.white }}
        >
          <Stack align="center" spacing="md">
            <ThemeIcon size="xl" color="red" variant="light">
              <IconAlertTriangle size={32} />
            </ThemeIcon>
            <Title order={3} color="red.7">
              Oops! Something went wrong
            </Title>
            <Text color="dimmed">
              {(error as Error)?.message || "Failed to fetch patients data"}
            </Text>
            <Button
              color="red"
              leftIcon={<IconRefresh size={16} />}
              onClick={() => refetch()}
              loading={isFetching}
            >
              Try Again
            </Button>
          </Stack>
        </Paper>
      </Box>
    );

  return (
    <Box p="lg" sx={{ minHeight: "100vh" }}>
      <Stack spacing="lg">
        {/* Header */}
        <Group position="apart" align="center">
          <Group spacing="sm">
            <ThemeIcon
              size="xl"
              color="violet"
              variant="gradient"
              gradient={{ from: "violet", to: "purple" }}
            >
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

        {/* Stats */}
        <Group grow>
          <Paper p="md" radius="lg" withBorder shadow="sm">
            <Group position="apart">
              <div>
                <Text
                  size="xs"
                  color="dimmed"
                  transform="uppercase"
                  weight={600}
                >
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
                <Text
                  size="xs"
                  color="dimmed"
                  transform="uppercase"
                  weight={600}
                >
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
                <Text
                  size="xs"
                  color="dimmed"
                  transform="uppercase"
                  weight={600}
                >
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

        {/* Table */}
        <Paper
          shadow="lg"
          radius="lg"
          sx={{ overflow: "hidden", background: theme.white }}
        >
          {patients.length === 0 ? (
            <Stack align="center" spacing="md" p="xl">
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
          ) : (
            <MantineReactTable table={table} />
          )}
        </Paper>

        {/* Infant Modal */}
        <Modal
          opened={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedParent(null);
            setInfant(null);
          }}
          title={
            <Group spacing="xs" align="center">
              <IconUsers size={20} />
              <Text weight={600}>
                Infants for {selectedParent?.firstName}{" "}
                {selectedParent?.lastName}
              </Text>
              {Array.isArray(infant) && infant.length > 0 && (
                <Badge size="sm" variant="light" color="blue">
                  {infant.length} {infant.length === 1 ? "Child" : "Children"}
                </Badge>
              )}
            </Group>
          }
          size="lg"
          centered
          padding="lg"
          radius="md"
          closeButtonProps={{ "aria-label": "Close infants modal" }}
          styles={{
            header: {
              borderBottom: "1px solid #e9ecef",
              paddingBottom: "1rem",
            },
            body: { paddingTop: "1rem" },
          }}
        >
          {infant && infant.length > 0 ? (
            <Stack spacing="lg">
              {infant.map((info, index) => (
                <Card
                  key={info.id}
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                  style={{
                    background:
                      "linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)",
                    border: "1px solid #e3f2fd",
                  }}
                >
                  <Stack spacing="md">
                    {/* Header with name and gender */}
                    <Group position="apart" align="center">
                      <Group spacing="sm" align="center">
                        <Avatar
                          size="sm"
                          radius="xl"
                          color={
                            info.gender?.toLowerCase() === "male"
                              ? "blue"
                              : info.gender?.toLowerCase() === "female"
                              ? "pink"
                              : "gray"
                          }
                        >
                          <IconBabyCarriage size={16} />
                        </Avatar>
                        <div>
                          <Text size="lg" weight={600} color="dark">
                            {info.firstName || `Child ${index + 1}`}
                          </Text>
                          <Text size="xs" color="dimmed">
                            Infant #{index + 1}
                          </Text>
                        </div>
                      </Group>
                      {info.gender && (
                        <Badge
                          variant="light"
                          color={
                            info.gender.toLowerCase() === "male"
                              ? "blue"
                              : info.gender.toLowerCase() === "female"
                              ? "pink"
                              : "gray"
                          }
                          size="md"
                          radius="sm"
                        >
                          {info.gender}
                        </Badge>
                      )}
                    </Group>

                    <Divider variant="dashed" />

                    {/* Details Grid */}
                    <SimpleGrid
                      cols={2}
                      spacing="md"
                      breakpoints={[{ maxWidth: "sm", cols: 1 }]}
                    >
                      <Group spacing="xs" align="flex-start" noWrap>
                        <ThemeIcon
                          size="sm"
                          variant="light"
                          color="blue"
                          radius="sm"
                        >
                          <IconCalendar size={14} />
                        </ThemeIcon>
                        <div style={{ flex: 1 }}>
                          <Text
                            size="xs"
                            weight={500}
                            color="dimmed"
                            transform="uppercase"
                          >
                            Birth Date
                          </Text>
                          <Text size="sm" weight={500}>
                            {info.dateOfBirth
                              ? new Date(info.dateOfBirth).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )
                              : "Not recorded"}
                          </Text>
                        </div>
                      </Group>

                      <Group spacing="xs" align="flex-start" noWrap>
                        <ThemeIcon
                          size="sm"
                          variant="light"
                          color="green"
                          radius="sm"
                        >
                          <IconScale size={14} />
                        </ThemeIcon>
                        <div style={{ flex: 1 }}>
                          <Text
                            size="xs"
                            weight={500}
                            color="dimmed"
                            transform="uppercase"
                          >
                            Birth Weight
                          </Text>
                          <Text size="sm" weight={500}>
                            {info.birthWeight != null
                              ? `${Number(info.birthWeight).toFixed(1)} kg`
                              : "Not recorded"}
                          </Text>
                        </div>
                      </Group>

                      <Group spacing="xs" align="flex-start" noWrap>
                        <ThemeIcon
                          size="sm"
                          variant="light"
                          color="orange"
                          radius="sm"
                        >
                          <IconRuler size={14} />
                        </ThemeIcon>
                        <div style={{ flex: 1 }}>
                          <Text
                            size="xs"
                            weight={500}
                            color="dimmed"
                            transform="uppercase"
                          >
                            Birth Height
                          </Text>
                          <Text size="sm" weight={500}>
                            {info.birthHeight != null
                              ? `${Number(info.birthHeight).toFixed(1)} cm`
                              : "Not recorded"}
                          </Text>
                        </div>
                      </Group>

                      <Group spacing="xs" align="flex-start" noWrap>
                        <ThemeIcon
                          size="sm"
                          variant="light"
                          color="violet"
                          radius="sm"
                        >
                          <IconClock size={14} />
                        </ThemeIcon>
                        <div style={{ flex: 1 }}>
                          <Text
                            size="xs"
                            weight={500}
                            color="dimmed"
                            transform="uppercase"
                          >
                            Age
                          </Text>
                          <Text size="sm" weight={500}>
                            {info.dateOfBirth
                              ? calculateAge(info.dateOfBirth)
                              : "Unknown"}
                          </Text>
                        </div>
                      </Group>
                    </SimpleGrid>
                  </Stack>
                </Card>
              ))}
            </Stack>
          ) : (
            <Center py={60}>
              <Stack align="center" spacing="md">
                <ThemeIcon size={64} variant="light" color="gray" radius="xl">
                  <IconBabyCarriage size={32} />
                </ThemeIcon>
                <div style={{ textAlign: "center" }}>
                  <Text size="md" weight={500} color="dark" mb="xs">
                    No Infant Records
                  </Text>
                  <Text size="sm" color="dimmed">
                    No infant information is available for this parent.
                  </Text>
                </div>
              </Stack>
            </Center>
          )}
        </Modal>
      </Stack>
    </Box>
  );
};

export default ViewParents;
