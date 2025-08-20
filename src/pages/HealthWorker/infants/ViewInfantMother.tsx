import { axiosInstance } from "@/utils/axiosInstance";
import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Divider,
  Grid,
  Group,
  Loader,
  Modal,
  NumberInput,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
  Tooltip
} from "@mantine/core";
import {
  IconAlertCircle,
  IconBabyCarriage,
  IconCalendar,
  IconCheck,
  IconDroplet,
  IconEdit,
  IconHeart,
  IconMail,
  IconPhone,
  IconRuler,
  IconScale,
  IconUser,
  IconUserHeart,
  IconX
} from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

const fetchInfant = async (id: string) => {
  const { data } = await axiosInstance.get(`/api/infants/${id}`);
  return data;
};

const fetchMother = async (motherId: string) => {
  const { data } = await axiosInstance.get(`/api/parents/${motherId}`);
  return data;
};

// Enhanced info display component
const InfoItem = ({ 
  icon, 
  label, 
  value, 
  variant = "default",
  color
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string | number | null | undefined;
  variant?: "default" | "badge" | "highlight";
  color?: string;
}) => {
  const displayValue = value || "-";
  
  return (
    <Group spacing="sm" noWrap>
      <div style={{ color: color || 'var(--mantine-color-gray-6)' }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <Text size="xs" color="dimmed" mb={2}>
          {label}
        </Text>
        {variant === "badge" && value ? (
          <Badge variant="light" color={color} size="sm">
            {displayValue}
          </Badge>
        ) : variant === "highlight" ? (
          <Text weight={600} color={color} size="sm">
            {displayValue}
          </Text>
        ) : (
          <Text weight={500} size="sm">
            {displayValue}
          </Text>
        )}
      </div>
    </Group>
  );
};

// Age calculation utility
const calculateAge = (dateOfBirth: string): string => {
  const today = new Date();
  const birth = new Date(dateOfBirth);
  const diffTime = Math.abs(today.getTime() - birth.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 30) return `${diffDays} days old`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months old`;
  return `${Math.floor(diffDays / 365)} years old`;
};

const ViewInfantMother = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [editModal, setEditModal] = useState(false);

  const { data: infant, isLoading: infantLoading, error: infantError } = useQuery({
    queryKey: ["infant", id],
    queryFn: () => fetchInfant(id!),
    enabled: !!id,
  });

  const motherId = infant?.motherId;

  const { data: mother, isLoading: motherLoading, error: motherError } = useQuery({
    queryKey: ["mother", motherId],
    queryFn: () => fetchMother(motherId!),
    enabled: !!motherId,
  });

  const { control, handleSubmit } = useForm<any>({
    defaultValues: infant || {},
  });

  // Update infant mutation
  const updateInfantMutation = useMutation({
    mutationFn: (data: any) => axiosInstance.put(`/api/infants/${id}`, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(["infant", id], updated.data);
      setEditModal(false);
    },
  });

  // Loading state
  if (infantLoading || motherLoading) {
    return (
      <Box p="xl">
        <Card withBorder radius="lg" shadow="sm" p="xl">
          <Center style={{ minHeight: 200 }}>
            <Stack align="center" spacing="md">
              <Loader size="xl" color="purple" variant="dots" />
              <Text color="dimmed">Loading infant and mother details...</Text>
            </Stack>
          </Center>
        </Card>
      </Box>
    );
  }

  // Error state
  if (infantError || motherError) {
    return (
      <Box p="xl">
        <Alert 
          icon={<IconAlertCircle size={16} />} 
          color="red" 
          variant="filled"
          radius="md"
          title="Error Loading Data"
        >
          Failed to load infant or mother information. Please try again.
        </Alert>
      </Box>
    );
  }

  return (
    <Box p="xl">
      {/* Header Section */}
      <Group position="apart" mb="xl" align="flex-start">
        <div>
          <Title order={1} mb="xs" color="purple">
            <Group spacing="sm">
              <IconBabyCarriage size={32} />
              {infant?.firstName} {infant?.lastName}
            </Group>
          </Title>
          <Group spacing="md">
            <Badge variant="light" color="purple" size="lg">
              {infant?.dateOfBirth ? calculateAge(infant.dateOfBirth) : "Age unknown"}
            </Badge>
            <Badge variant="filled" color={infant?.gender === 'male' ? 'blue' : 'pink'} size="lg">
              {infant?.gender}
            </Badge>
          </Group>
        </div>
        
        <Tooltip label="Edit infant information">
          <Button
            leftIcon={<IconEdit size={18} />}
            onClick={() => setEditModal(true)}
            variant="gradient"
            gradient={{ from: 'purple', to: 'pink' }}
            size="md"
            radius="md"
            style={{
              transition: 'all 0.2s ease',
              // '&:hover': { transform: 'translateY(-2px)' }
            }}
          >
            Edit Information
          </Button>
        </Tooltip>
      </Group>

      <Grid>
        {/* Infant Details Card */}
        <Grid.Col span={12} md={6}>
          <Card withBorder shadow="sm" radius="lg" h="100%" p="lg">
            <Group spacing="sm" mb="lg">
              <Avatar size="md" color="purple" variant="light">
                <IconBabyCarriage size={24} />
              </Avatar>
              <div>
                <Title order={3} color="purple">
                  Infant Details
                </Title>
                <Text size="sm" color="dimmed">
                  Birth and health information
                </Text>
              </div>
            </Group>

            <Divider mb="md" />

            <Stack spacing="lg">
              <Grid gutter="md">
                <Grid.Col span={12}>
                  <InfoItem
                    icon={<IconUser size={16} />}
                    label="Full Name"
                    value={`${infant?.firstName || ''} ${infant?.lastName || ''}`}
                    variant="highlight"
                    color="purple"
                  />
                </Grid.Col>
                
                <Grid.Col span={6}>
                  <InfoItem
                    icon={<IconCalendar size={16} />}
                    label="Date of Birth"
                    value={infant?.dateOfBirth 
                      ? new Date(infant.dateOfBirth).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : null
                    }
                  />
                </Grid.Col>

                <Grid.Col span={6}>
                  <InfoItem
                    icon={<IconDroplet size={16} />}
                    label="Blood Group"
                    value={infant?.bloodGroup}
                    variant="badge"
                    color="red"
                  />
                </Grid.Col>

                <Grid.Col span={6}>
                  <InfoItem
                    icon={<IconScale size={16} />}
                    label="Birth Weight"
                    value={infant?.birthWeight ? `${infant.birthWeight} kg` : null}
                    color="blue"
                  />
                </Grid.Col>

                <Grid.Col span={6}>
                  <InfoItem
                    icon={<IconRuler size={16} />}
                    label="Birth Height"
                    value={infant?.birthHeight ? `${infant.birthHeight} cm` : null}
                    color="green"
                  />
                </Grid.Col>

                <Grid.Col span={12}>
                  <InfoItem
                    icon={<IconHeart size={16} />}
                    label="Special Conditions"
                    value={infant?.specialConditions || "None reported"}
                    color="orange"
                  />
                </Grid.Col>
              </Grid>
            </Stack>
          </Card>
        </Grid.Col>

        {/* Mother Details Card */}
        <Grid.Col span={12} md={6}>
          {mother ? (
            <Card withBorder shadow="sm" radius="lg" h="100%" p="lg">
              <Group spacing="sm" mb="lg">
                <Avatar size="md" color="pink" variant="light">
                  <IconUserHeart size={24} />
                </Avatar>
                <div>
                  <Title order={3} color="pink">
                    Mother Details
                  </Title>
                  <Text size="sm" color="dimmed">
                    Parent contact information
                  </Text>
                </div>
              </Group>

              <Divider mb="md" />

              <Stack spacing="lg">
                <Grid gutter="md">
                  <Grid.Col span={12}>
                    <InfoItem
                      icon={<IconUser size={16} />}
                      label="Full Name"
                      value={`${mother.firstName || ''} ${mother.lastName || ''}`}
                      variant="highlight"
                      color="pink"
                    />
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <InfoItem
                      icon={<IconMail size={16} />}
                      label="Email"
                      value={mother.email}
                    />
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <InfoItem
                      icon={<IconPhone size={16} />}
                      label="Phone"
                      value={mother.phone}
                    />
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <InfoItem
                      icon={<IconDroplet size={16} />}
                      label="Blood Group"
                      value={mother.bloodGroup}
                      variant="badge"
                      color="red"
                    />
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <InfoItem
                      icon={<IconHeart size={16} />}
                      label="Marital Status"
                      value={mother.maritalStatus}
                      variant="badge"
                      color="grape"
                    />
                  </Grid.Col>
                </Grid>
              </Stack>
            </Card>
          ) : (
            <Card withBorder shadow="sm" radius="lg" h="100%" p="lg">
              <Center style={{ height: '100%', minHeight: 200 }}>
                <Stack align="center" spacing="md">
                  <Avatar size={60} color="gray" variant="light">
                    <IconUser size={30} />
                  </Avatar>
                  <Text color="dimmed" ta="center">
                    Mother information not available
                  </Text>
                </Stack>
              </Center>
            </Card>
          )}
        </Grid.Col>
      </Grid>

      {/* Enhanced Edit Modal */}
      <Modal
        opened={editModal}
        onClose={() => setEditModal(false)}
        title={
          <Group spacing="sm">
            <IconEdit size={20} />
            <Text weight={600}>Edit Infant Information</Text>
          </Group>
        }
        size="lg"
        radius="md"
        overlayProps={{ opacity: 0.55, blur: 3 }}
        styles={{
          header: { backgroundColor: 'var(--mantine-color-purple-0)' },
        }}
      >
        <form
          onSubmit={handleSubmit((data) => updateInfantMutation.mutate(data))}
        >
          <Stack spacing="md">
            <Grid>
              <Grid.Col span={6}>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <TextInput 
                      {...field} 
                      label="First Name" 
                      required 
                      radius="md"
                      icon={<IconUser size={16} />}
                    />
                  )}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <TextInput 
                      {...field} 
                      label="Last Name" 
                      required 
                      radius="md"
                      icon={<IconUser size={16} />}
                    />
                  )}
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Gender"
                      data={[
                        { value: "male", label: "Male" },
                        { value: "female", label: "Female" },
                      ]}
                      required
                      radius="md"
                      icon={<IconUser size={16} />}
                    />
                  )}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Controller
                  name="dateOfBirth"
                  control={control}
                  render={({ field }) => (
                    <TextInput 
                      {...field} 
                      label="Date of Birth" 
                      type="date" 
                      radius="md"
                      icon={<IconCalendar size={16} />}
                    />
                  )}
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <Controller
                  name="birthWeight"
                  control={control}
                  render={({ field }) => (
                    <NumberInput
                      {...field}
                      label="Birth Weight (kg)"
                      precision={2}
                      step={0.1}
                      min={0}
                      max={10}
                      radius="md"
                      icon={<IconScale size={16} />}
                    />
                  )}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Controller
                  name="birthHeight"
                  control={control}
                  render={({ field }) => (
                    <NumberInput
                      {...field}
                      label="Birth Height (cm)"
                      min={0}
                      max={100}
                      radius="md"
                      icon={<IconRuler size={16} />}
                    />
                  )}
                />
              </Grid.Col>
            </Grid>

            <Controller
              name="bloodGroup"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label="Blood Group"
                  data={[
                    { value: "A+", label: "A+" },
                    { value: "A-", label: "A-" },
                    { value: "B+", label: "B+" },
                    { value: "B-", label: "B-" },
                    { value: "AB+", label: "AB+" },
                    { value: "AB-", label: "AB-" },
                    { value: "O+", label: "O+" },
                    { value: "O-", label: "O-" },
                  ]}
                  radius="md"
                  icon={<IconDroplet size={16} />}
                  clearable
                />
              )}
            />

            <Controller
              name="specialConditions"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  label="Special Conditions"
                  placeholder="Any medical conditions or special notes..."
                  radius="md"
                  minRows={3}
                  icon={<IconHeart size={16} />}
                />
              )}
            />

            <Group position="right" mt="xl">
              <Button 
                variant="outline" 
                onClick={() => setEditModal(false)}
                leftIcon={<IconX size={16} />}
                radius="md"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gradient"
                gradient={{ from: 'purple', to: 'pink' }}
                loading={updateInfantMutation.isPending}
                leftIcon={<IconCheck size={16} />}
                radius="md"
              >
                Save Changes
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Box>
  );
};

export default ViewInfantMother;