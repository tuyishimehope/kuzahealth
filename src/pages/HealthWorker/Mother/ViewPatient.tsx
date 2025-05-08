import {
  Avatar,
  Badge,
  Box,
  Button,
  Group,
  Paper,
  Progress,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import {
  IconAnchor,
  IconDownload,
  IconEye,
  IconPlus,
  IconShip,
  IconWaveSine,
} from '@tabler/icons-react';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from 'mantine-react-table';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Define Patient interface
interface Patient {
  id: string;
  profile?: string;
  name: string;
  phone1: string;
  phone2?: string;
  birthdate: string;
  nationalId: string;
  status: 'active' | 'inactive' | 'critical';
  lastVisit: string;
}

// Status Badge
const StatusBadge = ({ status, size = 'sm' }: { status: Patient['status']; size?: 'sm' | 'lg' }) => {
  const colors = {
    active: 'green',
    inactive: 'gray',
    critical: 'red',
  };

  const icons = {
    active: <IconWaveSine size={size === 'lg' ? 16 : 14} />,
    inactive: <IconAnchor size={size === 'lg' ? 16 : 14} />,
    critical: <IconShip size={size === 'lg' ? 16 : 14} />,
  };

  return (
    <Badge variant="filled" color={colors[status]} leftSection={icons[status]} size={size}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const MaritimePatientDashboard = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [globalFilter] = useState('');
  const [selectedStatus] = useState<'all' | Patient['status']>('all');
  const [rowSelection, setRowSelection] = useState({});

  // Fetch sample patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const samplePatients: Patient[] = Array.from({ length: 50 }, (_, i) => ({
          id: `PAT-${1000 + i}`,
          name: `Patient ${i + 1}`,
          phone1: `+250 78${Math.floor(1000000 + Math.random() * 9000000)}`,
          phone2: Math.random() > 0.5 ? `+250 72${Math.floor(1000000 + Math.random() * 9000000)}` : undefined,
          birthdate: `${1970 + Math.floor(Math.random() * 30)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
          nationalId: `${1900000000 + Math.floor(Math.random() * 9000000)}`,
          status: ['active', 'inactive', 'critical'][Math.floor(Math.random() * 3)] as Patient['status'],
          lastVisit: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        }));
        setPatients(samplePatients);
      } catch {
        setError('Failed to fetch patients data');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const columns = useMemo<MRT_ColumnDef<Patient>[]>(() => [
    { accessorKey: 'id', header: 'ID', size: 90 },
    {
      accessorKey: 'name',
      header: 'Patient Name',
      size: 160,
      Cell: ({ row }) => (
        <Group spacing="sm">
          <Avatar color="blue" radius="xl">{row.original.name.charAt(0)}</Avatar>
          <Text>{row.original.name}</Text>
        </Group>
      ),
    },
    { accessorKey: 'phone1', header: 'Primary Phone', size: 140 },
    {
      accessorKey: 'birthdate',
      header: 'Birthdate',
      size: 120,
      Cell: ({ renderedCellValue }) => <Text>{new Date(renderedCellValue as string).toLocaleDateString()}</Text>,
    },
    { accessorKey: 'nationalId', header: 'National ID', size: 130 },
    {
      accessorKey: 'status',
      header: 'Status',
      size: 100,
      Cell: ({ renderedCellValue }) => (
        <StatusBadge status={renderedCellValue as Patient['status']} />
      ),
      filterVariant: 'select',
      filterSelectOptions: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'critical', label: 'Critical' },
      ],
    },
    {
      accessorKey: 'lastVisit',
      header: 'Last Visit',
      size: 120,
      Cell: ({ renderedCellValue }) => <Text>{new Date(renderedCellValue as string).toLocaleDateString()}</Text>,
    },
  ], []);

  const filteredData = useMemo(() => {
    return selectedStatus === 'all'
      ? patients
      : patients.filter((p) => p.status === selectedStatus);
  }, [patients, selectedStatus]);

  const table = useMantineReactTable({
    columns,
    data: filteredData,
    enableGlobalFilter: true,
    enableSorting: true,
    enableRowSelection: true,
    enableRowActions: true,
    positionActionsColumn: 'last',
    globalFilterFn: 'fuzzy',
    state: { globalFilter, rowSelection },
    onRowSelectionChange: setRowSelection,
    displayColumnDefOptions: {
      'mrt-row-actions': { header: 'Actions', size: 100 },
    },
    renderRowActions: ({ row }) => (
      <Group spacing={4} position="center">
        <Button
          size="xs"
          variant="subtle"
          color="blue"
          leftIcon={<IconEye size={14} />}
          onClick={() => navigate(`/healthworker/view-patient/${row.original.id}`)}
        >
          View
        </Button>
      </Group>
    ),
    renderTopToolbarCustomActions: () => (
      <Group ml="xs">
        <Button
          leftIcon={<IconDownload size={20} />}
          variant="light"
          color="blue"
          onClick={() => console.log('Export data')}
        >
          Export
        </Button>
        <Button
          leftIcon={<IconPlus size={20} />}
          color="violet"
          onClick={() => console.log('Add new patient')}
        >
          New Patient
        </Button>
      </Group>
    ),
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Stack align="center" spacing="md">
          <Progress value={100} animate color="blue" radius="xl" size="lg" sx={{ width: 200 }} />
          <Text size="xl" weight={700} color="blue">Loading patient data...</Text>
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Paper p="xl" withBorder shadow="md" radius="md" sx={{ maxWidth: 500 }}>
          <Title order={3} color="red">We've hit rough waters!</Title>
          <Text my="md">{error}</Text>
          <Button color="red" onClick={() => window.location.reload()}>Try Again</Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box p="md" sx={{ background: theme.fn.linearGradient(45, '#f6f9fc', '#edf2f7'), minHeight: '100vh' }}>
      <MantineReactTable table={table} />
    </Box>
  );
};

export default MaritimePatientDashboard;
