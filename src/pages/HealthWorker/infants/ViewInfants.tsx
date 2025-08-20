// ViewInfants.tsx
import { axiosInstance } from "@/utils/axiosInstance";
import {
  ActionIcon,
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconBabyCarriage,
  IconCalendar,
  IconEye,
  IconPlus,
  IconRuler,
  IconScale,
} from "@tabler/icons-react";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from "mantine-react-table";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { Patient } from "../Mother/ViewPatient";

export type Child = {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  bloodGroup: string;
  dateOfBirth?: string;
  birthWeight?: number;
  birthHeight?: number;
  mother?: Patient;
};

// Gender badge component
const GenderBadge = ({ gender }: { gender: string }) => (
  <Badge
    variant="filled"
    color={gender.toLowerCase() === "male" ? "blue" : "pink"}
    size="sm"
  >
    {gender}
  </Badge>
);

// Calculate age string from DOB
const calculateAge = (dateOfBirth: string): string => {
  const today = new Date();
  const birth = new Date(dateOfBirth);
  const diffTime = Math.abs(today.getTime() - birth.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 30) return `${diffDays} days`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
  return `${Math.floor(diffDays / 365)} years`;
};

// Birth metric component
const BirthMetric = ({
  value,
  unit,
  icon,
  label,
}: {
  value?: number;
  unit: string;
  icon: React.ReactNode;
  label: string;
}) => (
  <Tooltip label={label} position="top">
    <Group spacing="xs" noWrap>
      {icon}
      <Text size="sm" weight={500}>
        {value ? `${value} ${unit}` : "-"}
      </Text>
    </Group>
  </Tooltip>
);

const ViewInfants = () => {
  const navigate = useNavigate();

  // Fetch infants using React Query
  const {
    data: infants = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Child[], Error>({
    queryKey: ["infants"],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/infants");
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });

  const columns: MRT_ColumnDef<Child>[] = [
    {
      accessorKey: "fullName",
      header: "Infant",
      Cell: ({ row }) => (
        <Group spacing="sm" noWrap>
          <Avatar size="md" color="purple" radius="xl">
            <IconBabyCarriage size={20} />
          </Avatar>
          <Stack spacing={0}>
            <Text weight={600} size="sm">
              {row.original.firstName} {row.original.lastName}
            </Text>
            <Text size="xs" color="dimmed">
              ID: {row.original.id.slice(0, 8)}...
            </Text>
          </Stack>
        </Group>
      ),
    },
    {
      accessorKey: "gender",
      header: "Gender",
      Cell: ({ cell }) => <GenderBadge gender={cell.getValue<string>()} />,
      size: 100,
    },
    {
      accessorKey: "bloodGroup",
      header: "Blood Group",
      Cell: ({ cell }) => (
        <Badge variant="outline" color="red" size="sm">
          {cell.getValue<string>() || "Unknown"}
        </Badge>
      ),
      size: 120,
    },
    {
      accessorKey: "dateOfBirth",
      header: "Age",
      Cell: ({ cell }) => {
        const dob = cell.getValue<string>();
        return dob ? (
          <Stack spacing={2}>
            <Group spacing="xs" noWrap>
              <IconCalendar
                size={14}
                style={{ color: "var(--mantine-color-gray-6)" }}
              />
              <Text size="sm" weight={500}>
                {calculateAge(dob)}
              </Text>
            </Group>
            <Text size="xs" color="dimmed">
              Born: {new Date(dob).toLocaleDateString()}
            </Text>
          </Stack>
        ) : (
          <Text size="sm" color="dimmed">
            -
          </Text>
        );
      },
      size: 160,
    },
    {
      header: "Birth Metrics",
      Cell: ({ row }) => (
        <Group spacing="md">
          <BirthMetric
            value={row.original.birthWeight}
            unit="kg"
            icon={
              <IconScale
                size={14}
                style={{ color: "var(--mantine-color-blue-6)" }}
              />
            }
            label="Birth Weight"
          />
          <BirthMetric
            value={row.original.birthHeight}
            unit="cm"
            icon={
              <IconRuler
                size={14}
                style={{ color: "var(--mantine-color-green-6)" }}
              />
            }
            label="Birth Height"
          />
        </Group>
      ),
      size: 200,
    },
    {
      header: "Actions",
      Cell: ({ row }) => (
        <Tooltip label="View infant details and medical records" position="top">
          <ActionIcon
            variant="filled"
            color="purple"
            size="lg"
            onClick={() =>
              navigate(`/healthworker/view-infants/${row.original.id}`)
            }
          >
            <IconEye size={18} />
          </ActionIcon>
        </Tooltip>
      ),
      size: 80,
    },
  ];

  const table = useMantineReactTable({
    columns,
    data: infants,
    state: { isLoading },
    enableColumnFilters: true,
    enableSorting: true,
    enablePagination: true,
    initialState: {
      pagination: { pageSize: 10, pageIndex: 0 },
      sorting: [{ id: "dateOfBirth", desc: true }],
    },
    mantinePaperProps: {
      shadow: "xs",
      radius: "lg",
      withBorder: true,
      style: { overflow: "hidden" },
    },
    mantineTableContainerProps: { style: { minHeight: isLoading ? 400 : 550 } },
    mantineTableHeadCellProps: {
      style: {
        backgroundColor: "var(--mantine-color-gray-0)",
        fontWeight: 600,
      },
    },
    mantineTableBodyRowProps: ({ row }) => ({
      style: { cursor: "pointer", transition: "background-color 0.2s ease" },
      onClick: () => navigate(`/healthworker/view-infants/${row.original.id}`),
    }),
    mantineLoadingOverlayProps: {
      loaderProps: { size: "lg", color: "purple", variant: "dots" },
    },
  });

  return (
    <Box p="md">
      {/* Header */}
      <Group position="apart" mb="lg" align="center">
        <div>
          <Title order={2} color="purple" mb={4}>
            <Group spacing="sm">
              <IconBabyCarriage size={28} />
              Infants Registry
            </Group>
          </Title>
          <Text color="dimmed" size="sm">
            Manage and track infant health records ({infants.length} total)
          </Text>
        </div>
        <Button
          leftIcon={<IconPlus size={16} />}
          variant="gradient"
          gradient={{ from: "purple", to: "pink" }}
          size="md"
          radius="md"
          onClick={() => navigate("/healthworker/add-infant")}
        >
          Add New Infant
        </Button>
      </Group>

      {/* Error */}
      {error && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          color="red"
          mb="lg"
          variant="filled"
          radius="md"
          title="Error Loading Data"
        >
          {error instanceof Error ? error.message : "Failed to load data"}
          <Button
            variant="light"
            color="yellow"
            mt="sm"
            onClick={() => refetch()}
          >
            Retry
          </Button>
        </Alert>
      )}

      {/* Table */}
      {infants.length > 0 ? (
        <Paper
          withBorder
          radius="lg"
          shadow="sm"
          style={{ overflow: "hidden" }}
        >
          <MantineReactTable table={table} />
        </Paper>
      ) : !isLoading ? (
        <Card withBorder radius="lg" shadow="sm" p="xl" mt="md">
          <Center>
            <Stack align="center" spacing="md">
              <Avatar size={80} color="purple" variant="light">
                <IconBabyCarriage size={40} />
              </Avatar>
              <div style={{ textAlign: "center" }}>
                <Title order={3} color="dimmed" mb="xs">
                  No Infants Registered
                </Title>
                <Text color="dimmed" mb="md">
                  Get started by adding your first infant to the registry
                </Text>
                <Button
                  leftIcon={<IconPlus size={16} />}
                  variant="light"
                  color="purple"
                  onClick={() => navigate("/healthworker/add-infant")}
                >
                  Add First Infant
                </Button>
              </div>
            </Stack>
          </Center>
        </Card>
      ) : null}
    </Box>
  );
};

export default ViewInfants;
