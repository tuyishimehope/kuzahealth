// ViewInfants.tsx
import { Box, Button, Group, Paper, Title, Tooltip, ActionIcon } from "@mantine/core";
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
  deliveryDate: string;
  birthWeight: number;
  birthHeight: number;
  birthTime: string;
  deliveryLocation: string;
  assignedDoctor: string;
  createdAt?: string;
  updatedAt?: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  specialConditions?: string;
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
      header: "DOB",
      Cell: ({ cell }) => new Date(cell.getValue<string>()).toLocaleDateString(),
    },
    { accessorKey: "birthWeight", header: "Weight (kg)" },
    { accessorKey: "birthHeight", header: "Height (cm)" },
    // { accessorKey: "birthTime", header: "Birth Time" },
    { accessorKey: "deliveryLocation", header: "Delivery Location" },
    // { accessorKey: "assignedDoctor", header: "Doctor" },
    { accessorKey: "bloodGroup", header: "Blood Group" },
    // { accessorKey: "specialConditions", header: "Special Conditions" },
    {
      header: "Actions",
      Cell: ({ row }) => (
        <Tooltip label="View Details">
          <ActionIcon
            variant="light"
            color="purple"
            className="bg-purple-600 hover:bg-purple-500"
            onClick={() =>
              navigate( "/healthworker/view-infants/"+ row.original.id)
            }
          >
            <IconEye size={18} />
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
    mantinePaperProps: { shadow: "0", withBorder: true },
    mantineTableContainerProps: { style: { minHeight: "500px" } },
  });

  if(error) return <p>{error}</p>
  return (
    <Box p="md">
      <Group position="apart" mb="md">
        <Title order={2}>Infants List</Title>
        <Button leftIcon={<IconPlus size={16} />} onClick={() => navigate("/healthworker/add-infant")} className="bg-purple-600 hover:bg-purple-500">Add New Infant</Button>
      </Group>

      <Paper withBorder>
        <MantineReactTable table={table} />
      </Paper>
    </Box>
  );
};

export default ViewInfants;
