import { useEffect, useState } from "react";

import { axiosInstance } from "@/utils/axiosInstance";
import { Box, Title, Text, Divider, Paper } from "@mantine/core";
import { IconUser, IconMapPin, IconBabyCarriage } from "@tabler/icons-react";
import { useParams } from "react-router-dom";

const ViewInfantMother = () => {
  const router = useParams();
  const { id } = router;
  const [infant, setInfant] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const fetchInfant = async () => {
      try {
        const response = await axiosInstance.get(`/api/infants/${id}`);
        setInfant(response.data);
      } catch (err) {
        console.error("Error fetching infant details", err);
      }
    };

    fetchInfant();
  }, [id]);

  if (!infant) return <Text>Loading...</Text>;

  const mother = infant.mother;

  return (
    <Box p="md">
      <Title order={2} mb="md">
        Infant & Mother Details
      </Title>

      <Paper p="md" withBorder mb="md">
        <Title order={4}>
          <IconBabyCarriage size={20} /> Infant Details
        </Title>
        <Divider my="sm" />
        <Text>
          Name: {infant.firstName} {infant.lastName}
        </Text>
        <Text>
          Date of Birth: {new Date(infant.dateOfBirth).toLocaleDateString()}
        </Text>
        <Text>Gender: {infant.gender}</Text>
        <Text>Weight: {infant.birthWeight} kg</Text>
        <Text>Height: {infant.birthHeight} cm</Text>
        <Text>Blood Group: {infant.bloodGroup}</Text>
        <Text>Birth Time: {infant.birthTime}</Text>
        <Text>Delivery Location: {infant.deliveryLocation}</Text>
        <Text>Doctor: {infant.assignedDoctor}</Text>
        <Text>Special Conditions: {infant.specialConditions}</Text>
      </Paper>

      <Paper p="md" withBorder>
        <Title order={4}>
          <IconUser size={20} /> Mother Details
        </Title>
        <Divider my="sm" />
        <Text>
          Name: {mother.firstName} {mother.lastName}
        </Text>
        <Text>Email: {mother.email}</Text>
        <Text>Phone: {mother.phone}</Text>
        <Text>Blood Group: {mother.bloodGroup}</Text>
        <Text>Marital Status: {mother.maritalStatus}</Text>
        <Text>Expected Delivery: {mother.expectedDeliveryDate}</Text>
        <Text>High Risk: {mother.highRisk ? "Yes" : "No"}</Text>
        <Title order={5} mt="sm">
          <IconMapPin size={16} /> Address
        </Title>
        <Text>District: {mother.district}</Text>
        <Text>Sector: {mother.sector}</Text>
        <Text>Cell: {mother.cell}</Text>
        <Text>Village: {mother.village}</Text>
        <Title order={5} mt="sm">
          Emergency Contact
        </Title>
        <Text>Name: {mother.emergencyContactFullName}</Text>
        <Text>Number: {mother.emergencyContactNumber}</Text>
        <Text>Relationship: {mother.emergencyContactRelationship}</Text>
      </Paper>
    </Box>
  );
};

export default ViewInfantMother;
