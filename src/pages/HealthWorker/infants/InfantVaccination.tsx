import {
    Badge,
    Box,
    Button,
    Card,
    Group,
    Modal,
    SimpleGrid,
    Stack,
    Tabs,
    Text,
    ThemeIcon,
    Timeline,
    Title
} from '@mantine/core';
import {
    IconAlertCircle,
    IconCalendar,
    IconCheck,
    IconClock,
    IconInfoCircle,
    IconVaccine,
} from '@tabler/icons-react';
import { useState } from 'react';

interface VaccinationSchedule {
  id: string;
  name: string;
  description: string;
  recommendedAge: string;
  doses: number;
  status: 'completed' | 'upcoming' | 'overdue';
  lastDoseDate?: string;
  nextDoseDate?: string;
}

const vaccinationSchedule: VaccinationSchedule[] = [
  {
    id: 'bcg',
    name: 'BCG (Bacille Calmette-Guérin)',
    description: 'Protects against tuberculosis',
    recommendedAge: 'At birth',
    doses: 1,
    status: 'upcoming',
    nextDoseDate: '2024-04-15',
  },
  {
    id: 'opv0',
    name: 'OPV-0 (Oral Polio Vaccine)',
    description: 'First dose of polio vaccine',
    recommendedAge: 'At birth',
    doses: 1,
    status: 'upcoming',
    nextDoseDate: '2024-04-15',
  },
  {
    id: 'hepB',
    name: 'Hepatitis B',
    description: 'Protects against hepatitis B virus',
    recommendedAge: 'At birth',
    doses: 1,
    status: 'upcoming',
    nextDoseDate: '2024-04-15',
  },
  {
    id: 'dtap1',
    name: 'DTaP (Diphtheria, Tetanus, Pertussis)',
    description: 'First dose of combined vaccine',
    recommendedAge: '6 weeks',
    doses: 1,
    status: 'upcoming',
    nextDoseDate: '2024-05-15',
  },
  {
    id: 'ipv1',
    name: 'IPV (Inactivated Polio Vaccine)',
    description: 'First dose of inactivated polio vaccine',
    recommendedAge: '6 weeks',
    doses: 1,
    status: 'upcoming',
    nextDoseDate: '2024-05-15',
  },
  {
    id: 'hib1',
    name: 'Hib (Haemophilus influenzae type b)',
    description: 'First dose of Hib vaccine',
    recommendedAge: '6 weeks',
    doses: 1,
    status: 'upcoming',
    nextDoseDate: '2024-05-15',
  },
  {
    id: 'pcv1',
    name: 'PCV (Pneumococcal Conjugate)',
    description: 'First dose of pneumococcal vaccine',
    recommendedAge: '6 weeks',
    doses: 1,
    status: 'upcoming',
    nextDoseDate: '2024-05-15',
  },
  {
    id: 'rota1',
    name: 'Rotavirus',
    description: 'First dose of rotavirus vaccine',
    recommendedAge: '6 weeks',
    doses: 1,
    status: 'upcoming',
    nextDoseDate: '2024-05-15',
  },
];

const InfantVaccination = () => {
  const [selectedVaccine, setSelectedVaccine] = useState<VaccinationSchedule | null>(null);
  const [showModal, setShowModal] = useState(false);

  const getStatusColor = (status: VaccinationSchedule['status']) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'upcoming':
        return 'blue';
      case 'overdue':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusIcon = (status: VaccinationSchedule['status']) => {
    switch (status) {
      case 'completed':
        return <IconCheck size={16} />;
      case 'upcoming':
        return <IconClock size={16} />;
      case 'overdue':
        return <IconAlertCircle size={16} />;
      default:
        return <IconInfoCircle size={16} />;
    }
  };

  return (
    <Box p="md">
      <Group position="apart" mb="xl">
        <Title order={2}>Infant Vaccination Schedule</Title>
        <Button leftIcon={<IconVaccine size={16} />}>
          Record Vaccination
        </Button>
      </Group>

      <Tabs defaultValue="timeline">
        <Tabs.List mb="xl">
          <Tabs.Tab value="timeline" icon={<IconCalendar size={16} />}>
            Timeline View
          </Tabs.Tab>
          <Tabs.Tab value="grid" icon={<IconVaccine size={16} />}>
            Grid View
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="timeline">
          <Timeline active={1} bulletSize={24} lineWidth={2}>
            {vaccinationSchedule.map((vaccine) => (
              <Timeline.Item
                key={vaccine.id}
                bullet={
                  <ThemeIcon color={getStatusColor(vaccine.status)} size={24} radius="xl">
                    {getStatusIcon(vaccine.status)}
                  </ThemeIcon>
                }
                title={vaccine.name}
              >
                <Text size="sm">{vaccine.description}</Text>
                <Text size="xs" color="dimmed" mt={4}>
                  Recommended Age: {vaccine.recommendedAge}
                </Text>
                {vaccine.nextDoseDate && (
                  <Text size="xs" color="dimmed">
                    Next Dose: {new Date(vaccine.nextDoseDate).toLocaleDateString()}
                  </Text>
                )}
              </Timeline.Item>
            ))}
          </Timeline>
        </Tabs.Panel>

        <Tabs.Panel value="grid">
          <SimpleGrid cols={3} spacing="lg">
            {vaccinationSchedule.map((vaccine) => (
              <Card
                key={vaccine.id}
                shadow="sm"
                p="lg"
                radius="md"
                withBorder
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setSelectedVaccine(vaccine);
                  setShowModal(true);
                }}
              >
                <Group position="apart" mb="md">
                  <Text weight={500}>{vaccine.name}</Text>
                  <Badge color={getStatusColor(vaccine.status)}>
                    {vaccine.status}
                  </Badge>
                </Group>

                <Stack spacing="xs">
                  <Text size="sm">{vaccine.description}</Text>
                  <Text size="xs" color="dimmed">
                    Recommended Age: {vaccine.recommendedAge}
                  </Text>
                  <Text size="xs" color="dimmed">
                    Doses: {vaccine.doses}
                  </Text>
                  {vaccine.nextDoseDate && (
                    <Text size="xs" color="dimmed">
                      Next Dose: {new Date(vaccine.nextDoseDate).toLocaleDateString()}
                    </Text>
                  )}
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        </Tabs.Panel>
      </Tabs>

      <Modal
        opened={showModal}
        onClose={() => setShowModal(false)}
        title={selectedVaccine?.name}
        size="lg"
      >
        {selectedVaccine && (
          <Stack spacing="md">
            <Text>{selectedVaccine.description}</Text>
            <Group>
              <Badge color={getStatusColor(selectedVaccine.status)}>
                {selectedVaccine.status}
              </Badge>
              <Badge variant="outline">
                {selectedVaccine.doses} {selectedVaccine.doses === 1 ? 'Dose' : 'Doses'}
              </Badge>
            </Group>
            <Text size="sm">
              <b>Recommended Age:</b> {selectedVaccine.recommendedAge}
            </Text>
            {selectedVaccine.nextDoseDate && (
              <Text size="sm">
                <b>Next Dose:</b> {new Date(selectedVaccine.nextDoseDate).toLocaleDateString()}
              </Text>
            )}
            <Group position="right" mt="xl">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Close
              </Button>
              <Button>
                Record Vaccination
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Box>
  );
};

export default InfantVaccination; 