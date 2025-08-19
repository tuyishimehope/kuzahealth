// ViewInfants.tsx
import { Box, Button, Group, Paper, Title, Tooltip, ActionIcon, Text } from "@mantine/core";
import { IconPlus, IconEye } from "@tabler/icons-react";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from "mantine-react-table";
import { useEffect, useState } from "react";
import type { Patient } from "../Mother/ViewPatient";
import { axiosInstance } from "@/utils/axiosInstance";
import { useNavigate } from "react-router-dom";

export type Child = {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  bloodGroup:string;
  dateOfBirth?: string;
  birthWeight?: number;
  birthHeight?: number;
  mother?: Patient;
};

const ViewInfants = () => {
  const [infants, setInfants] = useState<Child[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInfants = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/api/infants");
        setInfants(response.data);
      } catch (err) {
        setError("Failed to fetch infants");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInfants();
  }, []);

  const columns: MRT_ColumnDef<Child>[] = [
    { accessorKey: "firstName", header: "First Name" },
    { accessorKey: "lastName", header: "Last Name" },
    { accessorKey: "gender", header: "Gender" },
    {
      accessorKey: "dateOfBirth",
      header: "Date of Birth",
      Cell: ({ cell }) =>
        cell.getValue<string>()
          ? new Date(cell.getValue<string>()).toLocaleDateString()
          : "-",
    },
    { accessorKey: "birthWeight", header: "Weight (kg)", Cell: ({ cell }) => cell.getValue<number>() ?? "-" },
    { accessorKey: "birthHeight", header: "Height (cm)", Cell: ({ cell }) => cell.getValue<number>() ?? "-" },
    {
      header: "Actions",
      Cell: ({ row }) => (
        <Tooltip label="View Details" position="top">
          <ActionIcon
            variant="filled"
            color="purple"
            size="lg"
            onClick={() => navigate(`/healthworker/view-infants/${row.original.id}`)}
          >
            <IconEye size={20} />
          </ActionIcon>
        </Tooltip>
      ),
    },
  ];

  const table = useMantineReactTable({
    columns,
    data: infants,
    state: { isLoading: loading },
    enableColumnFilters: true,
    enableSorting: true,
    enablePagination: true,
    mantinePaperProps: { shadow: "sm", radius: "md", withBorder: true },
    mantineTableContainerProps: { style: { minHeight: 550 } },
  });

  return (
    <Box p="md">
      <Group position="apart" mb="lg" align="center">
        <Title order={2}>Infants List</Title>
        <Button
          leftIcon={<IconPlus size={16} />}
          className="bg-purple-600 hover:bg-purple-500 text-white"
          onClick={() => navigate("/healthworker/add-infant")}
        >
          Add New Infant
        </Button>
      </Group>

      {error && (
        <Text color="red" mb="md">
          {error}
        </Text>
      )}

      <Paper withBorder radius="md" shadow="sm" p="sm">
        <MantineReactTable table={table} />
      </Paper>
    </Box>
  );
};

export default ViewInfants;
