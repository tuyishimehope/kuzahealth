import {
    Box,
    Button,
    Group,
    Paper,
    Title
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import {
    MantineReactTable,
    useMantineReactTable,
    type MRT_ColumnDef,
} from 'mantine-react-table';
import { useState } from 'react';

// Define Child type (reusing from existing codebase)
type Child = {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  deliveryDate: string;
  birthWeight: string;
  birthHeight: string;
  birthTime: string;
  deliveryLocation: string;
  assignedDoctor: string;
};

// Sample data
const sampleInfants: Child[] = [
  {
    id: 'C-102301',
    firstName: 'Michael',
    lastName: 'Smith',
    gender: 'male',
    deliveryDate: '2020-06-12',
    birthWeight: '3.2 kg',
    birthHeight: '52 cm',
    birthTime: '14:30',
    deliveryLocation: 'Central Hospital',
    assignedDoctor: 'Dr. Sarah Johnson'
  },
  {
    id: 'C-102302',
    firstName: 'Emma',
    lastName: 'Johnson',
    gender: 'female',
    deliveryDate: '2021-03-15',
    birthWeight: '3.5 kg',
    birthHeight: '50 cm',
    birthTime: '09:45',
    deliveryLocation: 'City Hospital',
    assignedDoctor: 'Dr. Michael Brown'
  }
];

const ViewInfants = () => {
  const [data, setData] = useState<Child[]>(sampleInfants);

  const columns: MRT_ColumnDef<Child>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      size: 100,
    },
    {
      accessorKey: 'firstName',
      header: 'First Name',
      size: 150,
    },
    {
      accessorKey: 'lastName',
      header: 'Last Name',
      size: 150,
    },
    {
      accessorKey: 'gender',
      header: 'Gender',
      size: 100,
    },
    {
      accessorKey: 'deliveryDate',
      header: 'Delivery Date',
      size: 150,
      Cell: ({ cell }) => new Date(cell.getValue<string>()).toLocaleDateString(),
    },
    {
      accessorKey: 'birthWeight',
      header: 'Birth Weight',
      size: 120,
    },
    {
      accessorKey: 'birthHeight',
      header: 'Birth Height',
      size: 120,
    },
    {
      accessorKey: 'birthTime',
      header: 'Birth Time',
      size: 120,
    },
    {
      accessorKey: 'deliveryLocation',
      header: 'Delivery Location',
      size: 200,
    },
    {
      accessorKey: 'assignedDoctor',
      header: 'Assigned Doctor',
      size: 200,
    },
  ];

  const table = useMantineReactTable({
    columns,
    data,
    enableColumnFilters: true,
    enableSorting: true,
    enablePagination: true,
    // enableRowActions: true,
    mantinePaperProps: {
      shadow: '0',
      withBorder: true,
    },
    mantineTableContainerProps: {
      style: {
        minHeight: '500px',
      },
    },
  });

  return (
    <Box p="md">
      <Group position="apart" mb="md">
        <Title order={2}>Infants List</Title>
        <Button leftIcon={<IconPlus size={16} />}>
          Add New Infant
        </Button>
      </Group>
      
      <Paper withBorder>
        <MantineReactTable table={table} />
      </Paper>
    </Box>
  );
};

export default ViewInfants;