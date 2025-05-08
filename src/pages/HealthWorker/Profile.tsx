import React, { useState } from 'react';
import {
  Box,
  Title,
  Text,
  Paper,
  Avatar,
  Group,
  Stack,
  Button,
  TextInput,
  Textarea,
  Grid,
  Tabs,
  Badge,
  ActionIcon,
  rem,
  FileButton,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconUser,
  IconMail,
  IconPhone,
  IconMapPin,
  IconBriefcase,
  IconEdit,
  IconCamera,
  IconCheck,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';

interface ProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  specialization: string;
  bio: string;
}

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>('personal');

  const form = useForm<ProfileFormValues>({
    initialValues: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+254 712 345 678',
      location: 'Nairobi, Kenya',
      specialization: 'Pediatrician',
      bio: 'Experienced pediatrician with over 10 years of practice in child healthcare.',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      phone: (value) => (/^\+?[\d\s-]{10,}$/.test(value) ? null : 'Invalid phone number'),
    },
  });

  const handleSubmit = async (values: ProfileFormValues) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Profile updated:', values);
      
      notifications.show({
        title: 'Success',
        message: 'Profile has been updated successfully',
        color: 'green',
      });
      
      setIsEditing(false);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update profile',
        color: 'red',
      });
    }
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
          <Title order={2}>Profile</Title>
          <Button
            variant={isEditing ? 'filled' : 'outline'}
            leftIcon={<IconEdit size={rem(16)} />}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel Editing' : 'Edit Profile'}
          </Button>
        </Group>

        <Grid>
          <Grid.Col span={12} md={4}>
            <motion.div variants={itemVariants}>
              <Paper shadow="sm" p="xl" radius="md" withBorder>
                <Stack align="center" spacing="md">
                  <Box pos="relative">
                    <Avatar
                      size={120}
                      radius={120}
                      src={profileImage ? URL.createObjectURL(profileImage) : null}
                    />
                    {isEditing && (
                      <FileButton onChange={setProfileImage} accept="image/png,image/jpeg">
                        {(props) => (
                          <ActionIcon
                            {...props}
                            variant="filled"
                            color="blue"
                            radius="xl"
                            size="lg"
                            pos="absolute"
                            bottom={0}
                            right={0}
                          >
                            <IconCamera size={rem(16)} />
                          </ActionIcon>
                        )}
                      </FileButton>
                    )}
                  </Box>
                  <Stack align="center" spacing={0}>
                    <Title order={3}>{`${form.values.firstName} ${form.values.lastName}`}</Title>
                    <Text color="dimmed" size="sm">{form.values.specialization}</Text>
                    <Badge color="blue" mt="xs">Verified</Badge>
                  </Stack>
                </Stack>
              </Paper>
            </motion.div>
          </Grid.Col>

          <Grid.Col span={12} md={8}>
            <motion.div variants={itemVariants}>
              <Paper shadow="sm" p="xl" radius="md" withBorder>
                <Tabs value={activeTab} onTabChange={setActiveTab}>
                  <Tabs.List>
                    <Tabs.Tab value="personal">Personal Information</Tabs.Tab>
                    <Tabs.Tab value="professional">Professional Details</Tabs.Tab>
                  </Tabs.List>

                  <Tabs.Panel value="personal" pt="md">
                    <form onSubmit={form.onSubmit(handleSubmit)}>
                      <Stack spacing="md">
                        <Grid>
                          <Grid.Col span={12} md={6}>
                            <TextInput
                              label="First Name"
                              placeholder="Enter first name"
                              icon={<IconUser size={rem(16)} />}
                              disabled={!isEditing}
                              {...form.getInputProps('firstName')}
                            />
                          </Grid.Col>
                          <Grid.Col span={12} md={6}>
                            <TextInput
                              label="Last Name"
                              placeholder="Enter last name"
                              icon={<IconUser size={rem(16)} />}
                              disabled={!isEditing}
                              {...form.getInputProps('lastName')}
                            />
                          </Grid.Col>
                        </Grid>

                        <TextInput
                          label="Email"
                          placeholder="Enter email"
                          icon={<IconMail size={rem(16)} />}
                          disabled={!isEditing}
                          {...form.getInputProps('email')}
                        />

                        <TextInput
                          label="Phone"
                          placeholder="Enter phone number"
                          icon={<IconPhone size={rem(16)} />}
                          disabled={!isEditing}
                          {...form.getInputProps('phone')}
                        />

                        <TextInput
                          label="Location"
                          placeholder="Enter location"
                          icon={<IconMapPin size={rem(16)} />}
                          disabled={!isEditing}
                          {...form.getInputProps('location')}
                        />

                        {isEditing && (
                          <Group position="right" mt="xl">
                            <Button type="submit" leftIcon={<IconCheck size={rem(16)} />}>
                              Save Changes
                            </Button>
                          </Group>
                        )}
                      </Stack>
                    </form>
                  </Tabs.Panel>

                  <Tabs.Panel value="professional" pt="md">
                    <Stack spacing="md">
                      <TextInput
                        label="Specialization"
                        placeholder="Enter specialization"
                        icon={<IconBriefcase size={rem(16)} />}
                        disabled={!isEditing}
                        {...form.getInputProps('specialization')}
                      />

                      <Textarea
                        label="Bio"
                        placeholder="Enter your bio"
                        minRows={4}
                        disabled={!isEditing}
                        {...form.getInputProps('bio')}
                      />
                    </Stack>
                  </Tabs.Panel>
                </Tabs>
              </Paper>
            </motion.div>
          </Grid.Col>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default Profile;