import React, { useState } from 'react';
import {
  Box,
  Title,
  TextInput,
  Button,
  Group,
  Paper,
  Table,
  Badge,
  ActionIcon,
  Text,
  Stack,
  Select,
  rem,
  Menu,
  Modal,
  Avatar,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconSearch,
  IconPlus,
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconEye,
  IconUser,
  IconMail,
  IconPhone,
  IconMapPin,
  IconBriefcase,
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HealthWorker {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  specialization: string;
  facility: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
}

const ViewHealthWorkers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorker, setSelectedWorker] = useState<HealthWorker | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  // Sample data - replace with actual data from your API
  const healthWorkers: HealthWorker[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+254 712 345 678',
      location: 'Nairobi',
      specialization: 'Pediatrician',
      facility: 'Main Hospital',
      role: 'Doctor',
      status: 'active',
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+254 723 456 789',
      location: 'Mombasa',
      specialization: 'Nurse',
      facility: 'Community Clinic',
      role: 'Nurse',
      status: 'active',
    },
  ];

  const filteredWorkers = healthWorkers.filter((worker) => {
    const matchesSearch = `${worker.firstName} ${worker.lastName} ${worker.email} ${worker.specialization}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || worker.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: HealthWorker['status']) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'red';
      case 'pending':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const handleViewDetails = (worker: HealthWorker) => {
    setSelectedWorker(worker);
    open();
  };

  const handleDelete = (id: string) => {
    notifications.show({
      title: 'Success',
      message: 'Health worker deleted successfully',
      color: 'green',
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <Box p="md">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Group position="apart" mb="xl">
          <Title order={2}>Health Workers</Title>
          <Button
            leftIcon={<IconPlus size={rem(16)} />}
            onClick={() => {/* Navigate to add health worker */}}
          >
            Add Health Worker
          </Button>
        </Group>

        <Stack spacing="md">
          <motion.div variants={itemVariants}>
            <Group grow>
              <TextInput
                placeholder="Search health workers..."
                icon={<IconSearch size={rem(16)} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Select
                placeholder="Filter by status"
                value={statusFilter}
                onChange={setStatusFilter}
                clearable
                data={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                  { value: 'pending', label: 'Pending' },
                ]}
              />
            </Group>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Paper shadow="sm" p="md" radius="md" withBorder>
              <Table striped highlightOnHover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Specialization</th>
                    <th>Facility</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredWorkers.map((worker) => (
                      <motion.tr
                        key={worker.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <td>
                          <Group spacing="sm">
                            <Avatar size={30} radius={30} />
                            <div>
                              <Text size="sm" weight={500}>
                                {`${worker.firstName} ${worker.lastName}`}
                              </Text>
                              <Text size="xs" color="dimmed">
                                {worker.email}
                              </Text>
                            </div>
                          </Group>
                        </td>
                        <td>{worker.specialization}</td>
                        <td>{worker.facility}</td>
                        <td>{worker.role}</td>
                        <td>
                          <Badge color={getStatusColor(worker.status)}>
                            {worker.status}
                          </Badge>
                        </td>
                        <td>
                          <Group spacing={4} position="right" noWrap>
                            <ActionIcon
                              color="blue"
                              onClick={() => handleViewDetails(worker)}
                            >
                              <IconEye size={rem(16)} />
                            </ActionIcon>
                            <Menu position="bottom-end" withinPortal>
                              <Menu.Target>
                                <ActionIcon>
                                  <IconDotsVertical size={rem(16)} />
                                </ActionIcon>
                              </Menu.Target>
                              <Menu.Dropdown>
                                <Menu.Item
                                  icon={<IconEdit size={rem(16)} />}
                                  onClick={() => {/* Handle edit */}}
                                >
                                  Edit
                                </Menu.Item>
                                <Menu.Item
                                  icon={<IconTrash size={rem(16)} />}
                                  color="red"
                                  onClick={() => handleDelete(worker.id)}
                                >
                                  Delete
                                </Menu.Item>
                              </Menu.Dropdown>
                            </Menu>
                          </Group>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </Table>
            </Paper>
          </motion.div>
        </Stack>

        <Modal
          opened={opened}
          onClose={close}
          title="Health Worker Details"
          size="lg"
        >
          {selectedWorker && (
            <Stack spacing="md">
              <Group>
                <Avatar size={80} radius={80} />
                <div>
                  <Title order={3}>{`${selectedWorker.firstName} ${selectedWorker.lastName}`}</Title>
                  <Text color="dimmed">{selectedWorker.specialization}</Text>
                </div>
              </Group>

              <Group>
                <IconMail size={rem(16)} />
                <Text>Email: {selectedWorker.email}</Text>
              </Group>
              <Group>
                <IconPhone size={rem(16)} />
                <Text>Phone: {selectedWorker.phone}</Text>
              </Group>
              <Group>
                <IconMapPin size={rem(16)} />
                <Text>Location: {selectedWorker.location}</Text>
              </Group>
              <Group>
                <IconBriefcase size={rem(16)} />
                <Text>Facility: {selectedWorker.facility}</Text>
              </Group>
              <Group>
                <IconUser size={rem(16)} />
                <Text>Role: {selectedWorker.role}</Text>
              </Group>

              <Group position="right" mt="xl">
                <Button variant="outline" onClick={close}>
                  Close
                </Button>
                <Button onClick={() => {/* Handle edit */}}>
                  Edit Details
                </Button>
              </Group>
            </Stack>
          )}
        </Modal>
      </motion.div>
    </Box>
  );
};

export default ViewHealthWorkers;
