import  { useState } from 'react';
import {
  Box,
  Title,
  TextInput,
  Button,
  Group,
  Paper,
  Select,
  Textarea,
  Stack,
  Grid,
  rem,
  FileButton,
  Avatar,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconUser,
  IconMail,
  IconPhone,
  IconMapPin,
  IconBriefcase,
  IconCamera,
  IconCheck,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';

interface HealthWorkerFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  specialization: string;
  facility: string;
  role: string;
  bio: string;
}

const AddHealthWorker = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const form = useForm<HealthWorkerFormValues>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      specialization: '',
      facility: '',
      role: '',
      bio: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      phone: (value) => (/^\+?[\d\s-]{10,}$/.test(value) ? null : 'Invalid phone number'),
      firstName: (value) => (!value ? 'First name is required' : null),
      lastName: (value) => (!value ? 'Last name is required' : null),
      specialization: (value) => (!value ? 'Specialization is required' : null),
      facility: (value) => (!value ? 'Facility is required' : null),
      role: (value) => (!value ? 'Role is required' : null),
    },
  });

  const handleSubmit = async (values: HealthWorkerFormValues) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Health worker added:', values);
      
      notifications.show({
        title: 'Success',
        message: 'Health worker has been added successfully',
        color: 'green',
      });
      
      form.reset();
      setProfileImage(null);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to add health worker',
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
          <Title order={2}>Add New Health Worker</Title>
        </Group>

        <Paper shadow="sm" p="xl" radius="md" withBorder>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack spacing="md">
              <motion.div variants={itemVariants}>
                <Group position="center" mb="md">
                  <Box pos="relative">
                    <Avatar
                      size={120}
                      radius={120}
                      src={profileImage ? URL.createObjectURL(profileImage) : null}
                    />
                    <FileButton onChange={setProfileImage} accept="image/png,image/jpeg">
                      {(props) => (
                        <Button
                          {...props}
                          variant="filled"
                          color="blue"
                          radius="xl"
                          size="sm"
                          pos="absolute"
                          bottom={0}
                          right={0}
                          leftIcon={<IconCamera size={rem(16)} />}
                        >
                          Upload
                        </Button>
                      )}
                    </FileButton>
                  </Box>
                </Group>
              </motion.div>

              <Grid>
                <Grid.Col span={12} md={6}>
                  <motion.div variants={itemVariants}>
                    <TextInput
                      required
                      label="First Name"
                      placeholder="Enter first name"
                      icon={<IconUser size={rem(16)} />}
                      {...form.getInputProps('firstName')}
                    />
                  </motion.div>
                </Grid.Col>
                <Grid.Col span={12} md={6}>
                  <motion.div variants={itemVariants}>
                    <TextInput
                      required
                      label="Last Name"
                      placeholder="Enter last name"
                      icon={<IconUser size={rem(16)} />}
                      {...form.getInputProps('lastName')}
                    />
                  </motion.div>
                </Grid.Col>
              </Grid>

              <motion.div variants={itemVariants}>
                <TextInput
                  required
                  label="Email"
                  placeholder="Enter email"
                  icon={<IconMail size={rem(16)} />}
                  {...form.getInputProps('email')}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <TextInput
                  required
                  label="Phone"
                  placeholder="Enter phone number"
                  icon={<IconPhone size={rem(16)} />}
                  {...form.getInputProps('phone')}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <TextInput
                  required
                  label="Location"
                  placeholder="Enter location"
                  icon={<IconMapPin size={rem(16)} />}
                  {...form.getInputProps('location')}
                />
              </motion.div>

              <Grid>
                <Grid.Col span={12} md={6}>
                  <motion.div variants={itemVariants}>
                    <Select
                      required
                      label="Specialization"
                      placeholder="Select specialization"
                      icon={<IconBriefcase size={rem(16)} />}
                      data={[
                        { value: 'pediatrician', label: 'Pediatrician' },
                        { value: 'nurse', label: 'Nurse' },
                        { value: 'midwife', label: 'Midwife' },
                        { value: 'general_practitioner', label: 'General Practitioner' },
                      ]}
                      {...form.getInputProps('specialization')}
                    />
                  </motion.div>
                </Grid.Col>
                <Grid.Col span={12} md={6}>
                  <motion.div variants={itemVariants}>
                    <Select
                      required
                      label="Facility"
                      placeholder="Select facility"
                      icon={<IconBriefcase size={rem(16)} />}
                      data={[
                        { value: 'facility_1', label: 'Main Hospital' },
                        { value: 'facility_2', label: 'Community Clinic' },
                        { value: 'facility_3', label: 'Health Center' },
                      ]}
                      {...form.getInputProps('facility')}
                    />
                  </motion.div>
                </Grid.Col>
              </Grid>

              <motion.div variants={itemVariants}>
                <Select
                  required
                  label="Role"
                  placeholder="Select role"
                  data={[
                    { value: 'doctor', label: 'Doctor' },
                    { value: 'nurse', label: 'Nurse' },
                    { value: 'midwife', label: 'Midwife' },
                    { value: 'health_officer', label: 'Health Officer' },
                  ]}
                  {...form.getInputProps('role')}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Textarea
                  label="Bio"
                  placeholder="Enter bio"
                  minRows={4}
                  {...form.getInputProps('bio')}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Group position="right" mt="xl">
                  <Button
                    variant="outline"
                    onClick={() => {
                      form.reset();
                      setProfileImage(null);
                    }}
                    disabled={isSubmitting}
                  >
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    leftIcon={<IconCheck size={rem(16)} />}
                  >
                    Add Health Worker
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

export default AddHealthWorker;