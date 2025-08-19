/* eslint-disable react-hooks/rules-of-hooks */
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/utils/axiosInstance";
import {
  Box,
  Title,
  Text,
  Divider,
  Paper,
  Stack,
  Group,
  Button,
  Modal,
  TextInput,
  Select,
} from "@mantine/core";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { IconUser, IconBabyCarriage, IconEdit } from "@tabler/icons-react";

const fetchInfant = async (id: string) => {
  const { data } = await axiosInstance.get(`/api/infants/${id}`);
  return data;
};

const fetchMother = async (motherId: string) => {
  const { data } = await axiosInstance.get(`/api/parents/${motherId}`);
  return data;
};

const ViewInfantMother = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [editModal, setEditModal] = useState(false);

  const { data: infant, isLoading: infantLoading } = useQuery({
    queryKey: ["infant", id],
    queryFn: () => fetchInfant(id!),
    enabled: !!id,
  });

  const motherId = infant?.motherId;

  const { data: mother, isLoading: motherLoading } = useQuery({
    queryKey: ["mother", motherId],
    queryFn: () => fetchMother(motherId!),
    enabled: !!motherId,
  });

  const { control, handleSubmit, reset } = useForm<any>({
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

  if (infantLoading || motherLoading) return <Text>Loading...</Text>;

  // Prefill form when infant data changes
  useState(() => {
    if (infant) reset(infant);
  });

  return (
    <Box p="md">
      <Title order={2} mb="lg">
        Infant & Mother Details
      </Title>

      {/* Edit Button */}
      <Group mb="md">
        <Button
          leftIcon={<IconEdit size={16} />}
          onClick={() => setEditModal(true)}
          color="purple"
          className="bg-purple-600 hover:bg-purple-500"
        >
          Edit Infant Info
        </Button>
      </Group>

      {/* Infant Details */}
      <Paper p="md" withBorder shadow="sm" mb="md" radius="md">
        <Title order={4} mb="sm">
          <IconBabyCarriage size={20} /> Infant Details
        </Title>
        <Divider mb="sm" />
        <Stack spacing="xs">
          <Text>
            <strong>Name:</strong> {infant.firstName} {infant.lastName}
          </Text>
          <Text>
            <strong>Date of Birth:</strong>{" "}
            {infant.dateOfBirth
              ? new Date(infant.dateOfBirth).toLocaleDateString()
              : "-"}
          </Text>
          <Text>
            <strong>Gender:</strong> {infant.gender}
          </Text>
          <Text>
            <strong>Weight:</strong> {infant.birthWeight} kg
          </Text>
          <Text>
            <strong>Height:</strong> {infant.birthHeight} cm
          </Text>
          <Text>
            <strong>Blood Group:</strong> {infant.bloodGroup || "-"}
          </Text>
          <Text>
            <strong>Special Conditions:</strong>{" "}
            {infant.specialConditions || "-"}
          </Text>
        </Stack>
      </Paper>

      {/* Mother Details */}
      {mother && (
        <Paper p="md" withBorder shadow="sm" radius="md">
          <Title order={4} mb="sm">
            <IconUser size={20} /> Mother Details
          </Title>
          <Divider mb="sm" />
          <Stack spacing="xs">
            <Text>
              <strong>Name:</strong> {mother.firstName} {mother.lastName}
            </Text>
            <Text>
              <strong>Email:</strong> {mother.email || "-"}
            </Text>
            <Text>
              <strong>Phone:</strong> {mother.phone || "-"}
            </Text>
            <Text>
              <strong>Blood Group:</strong> {mother.bloodGroup || "-"}
            </Text>
            <Text>
              <strong>Marital Status:</strong> {mother.maritalStatus || "-"}
            </Text>
          </Stack>
        </Paper>
      )}

      {/* Edit Infant Modal */}
      <Modal
        opened={editModal}
        onClose={() => setEditModal(false)}
        title="Edit Infant Information"
        size="lg"
      >
        <form
          onSubmit={handleSubmit((data) => updateInfantMutation.mutate(data))}
        >
          <Stack spacing="md">
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <TextInput {...field} label="First Name" required />
              )}
            />
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <TextInput {...field} label="Last Name" required />
              )}
            />
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
                />
              )}
            />
            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field }) => (
                <TextInput {...field} label="Date of Birth" type="date" />
              )}
            />
            <Controller
              name="birthWeight"
              control={control}
              render={({ field }) => (
                <TextInput {...field} label="Weight (kg)" type="number" />
              )}
            />
            <Controller
              name="birthHeight"
              control={control}
              render={({ field }) => (
                <TextInput {...field} label="Height (cm)" type="number" />
              )}
            />
            <Controller
              name="bloodGroup"
              control={control}
              render={({ field }) => (
                <TextInput {...field} label="Blood Group" />
              )}
            />
            <Controller
              name="specialConditions"
              control={control}
              render={({ field }) => (
                <TextInput {...field} label="Special Conditions" />
              )}
            />
            <Group position="right">
              <Button variant="outline" onClick={() => setEditModal(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                color="purple"
                loading={updateInfantMutation.isPending}
              >
                Save
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Box>
  );
};

export default ViewInfantMother;
