import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Menu,
  Modal,
  Paper,
  rem,
  Stack,
  Table,
  Text,
  TextInput,
  Title
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconCalendar,
  IconClock,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconMapPin,
  IconPhone,
  IconPlus,
  IconSearch,
  IconTrash,
} from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

interface Schedule {
  id: string;
  patientName: string;
  appointmentDate: string;
  scheduleTime: string;
  patientLocation: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  communicationMode: string;
}

const ViewSchedule = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  // Sample data - replace with actual data from your API
  const schedules: Schedule[] = [
    {
      id: '1',
      patientName: 'John Doe',
      appointmentDate: '2024-03-20',
      scheduleTime: '10:00',
      patientLocation: 'Nairobi',
      status: 'scheduled',
      communicationMode: 'Phone Call',
    },
    {
      id: '2',
      patientName: 'Jane Smith',
      appointmentDate: '2024-03-21',
      scheduleTime: '14:30',
      patientLocation: 'Mombasa',
      status: 'completed',
      communicationMode: 'Face to Face',
    },
  ];

  const filteredSchedules = schedules.filter((schedule) =>
    schedule.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: Schedule['status']) => {
    switch (status) {
      case 'scheduled':
        return 'blue';
      case 'completed':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  const handleViewDetails = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    open();
  };

  const handleDelete = (id: string) => {
    notifications.show({
      title: 'Success',
      message: 'Schedule deleted successfully',
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
          <Title order={2}>View Schedules</Title>
          <Button
            leftIcon={<IconPlus size={rem(16)} />}
            onClick={() => {/* Navigate to add schedule */}}
          >
            Add New Schedule
          </Button>
        </Group>

        <Stack spacing="md">
          <motion.div variants={itemVariants}>
            <TextInput
              placeholder="Search schedules..."
              icon={<IconSearch size={rem(16)} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Paper shadow="sm" p="md" radius="md" withBorder>
              <Table striped highlightOnHover>
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Appointment Date</th>
                    <th>Schedule Time</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredSchedules.map((schedule) => (
                      <motion.tr
                        key={schedule.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <td>{schedule.patientName}</td>
                        <td>{schedule.appointmentDate}</td>
                        <td>{schedule.scheduleTime}</td>
                        <td>{schedule.patientLocation}</td>
                        <td>
                          <Badge color={getStatusColor(schedule.status)}>
                            {schedule.status}
                          </Badge>
                        </td>
                        <td>
                          <Group spacing={4} position="right" noWrap>
                            <ActionIcon
                              color="blue"
                              onClick={() => handleViewDetails(schedule)}
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
                                  onClick={() => handleDelete(schedule.id)}
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
          title="Schedule Details"
          size="lg"
        >
          {selectedSchedule && (
            <Stack spacing="md">
              <Group>
                <IconCalendar size={rem(16)} />
                <Text>Date: {selectedSchedule.appointmentDate}</Text>
              </Group>
              <Group>
                <IconClock size={rem(16)} />
                <Text>Time: {selectedSchedule.scheduleTime}</Text>
              </Group>
              <Group>
                <IconMapPin size={rem(16)} />
                <Text>Location: {selectedSchedule.patientLocation}</Text>
              </Group>
              <Group>
                <IconPhone size={rem(16)} />
                <Text>Communication: {selectedSchedule.communicationMode}</Text>
              </Group>
              <Group position="right" mt="xl">
                <Button variant="outline" onClick={close}>
                  Close
                </Button>
                <Button onClick={() => {/* Handle edit */}}>
                  Edit Schedule
                </Button>
              </Group>
            </Stack>
          )}
        </Modal>
      </motion.div>
    </Box>
  );
};

export default ViewSchedule;
