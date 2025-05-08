import {
  Box,
  Button,
  Group,
  Paper,
  Select,
  Stack,
  TextInput,
  Textarea,
  Title,
  rem
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCalendar, IconClock, IconMapPin, IconMessage, IconPhone, IconUser } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface ScheduleFormValues {
  patientName: string;
  phoneNumber: string;
  reason: string;
  appointmentDate: string;
  scheduleTime: string;
  patientLocation: string;
  communicationMode: string;
}

const AddSchedule = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ScheduleFormValues>({
    initialValues: {
      patientName: '',
      phoneNumber: '',
      reason: '',
      appointmentDate: '',
      scheduleTime: '',
      patientLocation: '',
      communicationMode: '',
    },
    validate: {
      patientName: (value) => (!value ? 'Patient name is required' : null),
      phoneNumber: (value) => (!value ? 'Phone number is required' : null),
      reason: (value) => (!value ? 'Reason is required' : null),
      appointmentDate: (value) => (!value ? 'Appointment date is required' : null),
      scheduleTime: (value) => (!value ? 'Schedule time is required' : null),
      patientLocation: (value) => (!value ? 'Patient location is required' : null),
      communicationMode: (value) => (!value ? 'Communication mode is required' : null),
    },
  });

  const handleSubmit = async (values: ScheduleFormValues) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Form submitted:', values);
      
      notifications.show({
        title: 'Success',
        message: 'Schedule has been created successfully',
        color: 'green',
      });
      
      form.reset();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to create schedule',
        color: 'red',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <Box p="md">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Group position="apart" mb="xl">
          <Title order={2}>Add New Schedule</Title>
        </Group>

        <Paper shadow="sm" p="xl" radius="md" withBorder>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack spacing="md">
              <motion.div variants={itemVariants}>
                <TextInput
                  required
                  label="Patient Name"
                  placeholder="Enter patient name"
                  icon={<IconUser size={rem(16)} />}
                  {...form.getInputProps('patientName')}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <TextInput
                  required
                  label="Phone Number"
                  placeholder="Enter phone number"
                  icon={<IconPhone size={rem(16)} />}
                  {...form.getInputProps('phoneNumber')}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Textarea
                  required
                  label="Reason/Subject"
                  placeholder="Enter reason for appointment"
                  icon={<IconMessage size={rem(16)} />}
                  minRows={3}
                  {...form.getInputProps('reason')}
                />
              </motion.div>

              <Group grow>
                <motion.div variants={itemVariants}>
                  <TextInput
                    required
                    label="Appointment Date"
                    type="date"
                    icon={<IconCalendar size={rem(16)} />}
                    {...form.getInputProps('appointmentDate')}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <TextInput
                    required
                    label="Schedule Time"
                    type="time"
                    icon={<IconClock size={rem(16)} />}
                    {...form.getInputProps('scheduleTime')}
                  />
                </motion.div>
              </Group>

              <motion.div variants={itemVariants}>
                <TextInput
                  required
                  label="Patient Location"
                  placeholder="Enter patient location"
                  icon={<IconMapPin size={rem(16)} />}
                  {...form.getInputProps('patientLocation')}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Select
                  required
                  label="Mode of Communication"
                  placeholder="Select communication mode"
                  data={[
                    { value: 'phone', label: 'Phone Call' },
                    { value: 'faceToFace', label: 'Face to Face' },
                    { value: 'video', label: 'Video Call' },
                  ]}
                  {...form.getInputProps('communicationMode')}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Group position="right" mt="xl">
                  <Button
                    variant="outline"
                    onClick={() => form.reset()}
                    disabled={isSubmitting}
                  >
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    loading={isSubmitting}
                  >
                    Create Schedule
                  </Button>
                </Group>
              </motion.div>
            </Stack>
          </form>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default AddSchedule;
