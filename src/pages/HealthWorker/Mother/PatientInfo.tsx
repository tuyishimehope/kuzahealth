import React, { useState } from 'react';
import {
  Box,
  Group,
  Card,
  Text,
  Title,
  Button,
  Badge,
  Avatar,
  SimpleGrid,
  ThemeIcon,
  useMantineTheme,
  Tabs,
  Stack,
  TextInput,
  Select,
  NumberInput,
  Grid,
  Divider,
  Paper
} from '@mantine/core';
import {
  IconUserCircle,
  IconCalendar,
  IconChartBar,
  IconArrowRight,
  IconEdit,
  IconId,
  IconBabyCarriage,
  IconPlus
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

// Extend the Patient type to include children
type Patient = {
  id: string;
  name: string;
  status: string;
  lastVisit: string;
  birthdate: string;
  nationalId: string;
  phone1: string;
  phone2?: string;
  children?: Child[]; // Add children array
};

// Define Child type
type Child = {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  deliveryDate: string;
  birthWeight: string;
  birthHeight: string;
  birthTime: string;
  deliveryLocation: string;
  assignedDoctor: string;
};

// Rest of the existing components...

// New Child Form Component
const AddChildForm = ({ 
  onAddChild, 
  motherLastName 
}: { 
  onAddChild: (child: Omit<Child, 'id'>) => void;
  motherLastName: string;
}) => {
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState(motherLastName); // Default to mother's last name
  const [gender, setGender] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [birthWeight, setBirthWeight] = useState('');
  const [birthHeight, setBirthHeight] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [assignedDoctor, setAssignedDoctor] = useState('');

  const handleSubmit = () => {
    // Validate form fields
    if (!firstName || !lastName || !gender || !deliveryDate) {
      alert('Please fill in all required fields');
      return;
    }

    // Create new child object
    const newChild = {
      firstName,
      lastName,
      gender,
      deliveryDate,
      birthWeight,
      birthHeight,
      birthTime,
      deliveryLocation,
      assignedDoctor
    };

    // Call parent handler
    onAddChild(newChild);

    // Reset form (except lastName which defaults to mother's)
    setFirstName('');
    setGender('');
    setDeliveryDate('');
    setBirthWeight('');
    setBirthHeight('');
    setBirthTime('');
    setDeliveryLocation('');
    setAssignedDoctor('');
  };

  return (
    <Box>
      <Title order={4} mb="md">Add New Child</Title>
      <Grid>
        <Grid.Col span={6}>
          <TextInput
            label="Child's First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            mb="md"
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Child's Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            mb="md"
          />
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={4}>
          <Select
            label="Gender"
            placeholder="Select gender"
            data={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Other' }
            ]}
            value={gender}
            onChange={(value) => setGender(value || '')}
            required
            mb="md"
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="Delivery Date"
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            required
            mb="md"
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="Birth Time"
            type="time"
            value={birthTime}
            onChange={(e) => setBirthTime(e.target.value)}
            mb="md"
          />
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={6}>
          <TextInput
            label="Birth Weight"
            placeholder="e.g., 3.5 kg"
            value={birthWeight}
            onChange={(e) => setBirthWeight(e.target.value)}
            mb="md"
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Birth Height"
            placeholder="e.g., 50 cm"
            value={birthHeight}
            onChange={(e) => setBirthHeight(e.target.value)}
            mb="md"
          />
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={6}>
          <TextInput
            label="Delivery Location"
            value={deliveryLocation}
            onChange={(e) => setDeliveryLocation(e.target.value)}
            mb="md"
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Assigned Doctor/Midwife"
            value={assignedDoctor}
            onChange={(e) => setAssignedDoctor(e.target.value)}
            mb="md"
          />
        </Grid.Col>
      </Grid>

      <Group position="right" mt="lg">
        <Button variant="outline" onClick={() => {}}>Cancel</Button>
        <Button onClick={handleSubmit}>Save</Button>
      </Group>
    </Box>
  );
};

// Child record display component
const ChildRecord = ({ child }: { child: Child }) => {
  return (
    <Paper p="md" withBorder mb="md">
      <Group position="apart">
        <Box>
          <Group spacing="xs">
            <Avatar size="sm" radius="xl" color="pink">
              {child.firstName.charAt(0)}
            </Avatar>
            <Text weight={600}>{child.firstName} {child.lastName}</Text>
          </Group>
          <Text size="sm" color="dimmed">Born on: {new Date(child.deliveryDate).toLocaleDateString()}</Text>
        </Box>
        <Badge>{child.gender}</Badge>
      </Group>
      
      <SimpleGrid cols={2} mt="md" spacing="xs">
        {child.birthWeight && (
          <Text size="sm">
            <b>Weight:</b> {child.birthWeight}
          </Text>
        )}
        {child.birthHeight && (
          <Text size="sm">
            <b>Height:</b> {child.birthHeight}
          </Text>
        )}
        {child.birthTime && (
          <Text size="sm">
            <b>Time:</b> {child.birthTime}
          </Text>
        )}
        {child.deliveryLocation && (
          <Text size="sm">
            <b>Location:</b> {child.deliveryLocation}
          </Text>
        )}
      </SimpleGrid>
    </Paper>
  );
};

// Updated PatientDetailPage with Children Tab
const PatientDetailPage = ({
  patient,
  onBack,
}: {
  patient: Patient;
  onBack: () => void;
}) => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  
  // State for children records
  const [children, setChildren] = useState<Child[]>(patient.children || []);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Handler for adding a new child
  const handleAddChild = (newChild: Omit<Child, 'id'>) => {
    // Generate a simple ID (in production, this would come from the backend)
    const id = `C-${Date.now().toString().slice(-6)}`;
    
    // Add the new child to state
    const childWithId = { ...newChild, id };
    setChildren([...children, childWithId as Child]);
    
    // Hide the form
    setShowAddForm(false);
  };

  return (
    <Box
      p="md"
      sx={{
        background: theme.fn.linearGradient(45, '#f6f9fc', '#edf2f7'),
        minHeight: '100vh',
      }}
    >
      <Box mb="xl" maw={1000} mx="auto">
        <Group position="apart" mb="lg">
          <Button
            variant="subtle"
            leftIcon={<IconArrowRight style={{ transform: 'rotate(180deg)' }} />}
            onClick={onBack}
          >
            Back to Patient List
          </Button>
          <Button variant="light" leftIcon={<IconEdit size={16} />} color="blue">
            Edit Patient
          </Button>
        </Group>

        <Card p="xl" radius="md" shadow="sm" withBorder>
          <Group position="apart" mb="xl" align="start">
            <Group>
              <Avatar size={80} radius={80} color="blue" sx={{ fontSize: 32 }}>
                {patient.name.charAt(0)}
              </Avatar>
              <Box>
                <Title order={2}>{patient.name}</Title>
                <Group spacing="xs">
                  <Badge variant="filled" color="indigo" leftSection={<IconId size={14} />}>
                    {patient.id}
                  </Badge>
                  {/* <StatusBadge status={patient.status} /> */}
                </Group>
              </Box>
            </Group>

            <Box>
              <Text size="sm" color="dimmed">
                Last Visit
              </Text>
              <Text fw={500}>{new Date(patient.lastVisit).toLocaleDateString()}</Text>
            </Box>
          </Group>

          <Tabs defaultValue="information">
            <Tabs.List mb="md">
              <Tabs.Tab value="information" icon={<IconUserCircle size={16} />}>
                Patient Information
              </Tabs.Tab>
              <Tabs.Tab value="medical" icon={<IconChartBar size={16} />}>
                Medical History
              </Tabs.Tab>
              <Tabs.Tab value="appointments" icon={<IconCalendar size={16} />}>
                Appointment History
              </Tabs.Tab>
              {/* New Tab for Children */}
              <Tabs.Tab value="children" icon={<IconBabyCarriage size={16} />}>
                Children
              </Tabs.Tab>
            </Tabs.List>

            {/* Existing Tab Panels */}
            <Tabs.Panel value="information">
              {/* Existing Information Tab Content */}
            </Tabs.Panel>

            <Tabs.Panel value="medical">
              <Text color="dimmed" align="center">Medical history information would appear here.</Text>
            </Tabs.Panel>

            <Tabs.Panel value="appointments">
              <Text color="dimmed" align="center">Appointment history would appear here.</Text>
            </Tabs.Panel>

            {/* New Children Tab Panel */}
            <Tabs.Panel value="children">
              <Box>
                {/* Header with Add Button */}
                <Group position="apart" mb="lg">
                  <Title order={3}>Children</Title>
                  <Button 
                    leftIcon={<IconPlus size={16} />}
                    onClick={() => setShowAddForm(!showAddForm)}
                  >
                    {showAddForm ? 'Cancel' : 'Add Child'}
                  </Button>
                </Group>

                {/* Add Child Form */}
                {showAddForm && (
                  <>
                    <Box mb="xl">
                      <AddChildForm 
                        onAddChild={handleAddChild} 
                        motherLastName={patient.name.split(' ').slice(-1)[0]} 
                      />
                    </Box>
                    <Divider my="lg" />
                  </>
                )}

                {/* List of Children */}
                {children.length > 0 ? (
                  <Stack>
                    {children.map((child) => (
                      <ChildRecord key={child.id} child={child} />
                    ))}
                  </Stack>
                ) : (
                  <Text color="dimmed" align="center" py="lg">
                    No children records found. Click "Add Child" to register a child.
                  </Text>
                )}
              </Box>
            </Tabs.Panel>
          </Tabs>
        </Card>
      </Box>
    </Box>
  );
};

// Update the parent component to include sample children data
const PatientInfo = () => {
  const selectedPatient: Patient = {
    id: 'P-1023',
    name: 'Jane Smith',
    status: 'Active',
    lastVisit: '2023-12-10',
    birthdate: '1990-05-15',
    nationalId: '1199223344556677',
    phone1: '0788888888',
    phone2: '0733333333',
    // Add sample children data for testing
    children: [
      {
        id: 'C-102301',
        firstName: 'Michael',
        lastName: 'Smith',
        gender: 'male',
        deliveryDate: '2020-06-12',
        birthWeight: '3.2 kg',
        birthHeight: '52 cm',
        birthTime: '14:30',
        deliveryLocation: 'Central Hospital',
        assignedDoctor: 'Dr. Sarah Johnson'
      }
    ]
  };

  const handleBackToList = () => {
    console.log('Back clicked');
  };

  return <PatientDetailPage patient={selectedPatient} onBack={handleBackToList} />;
};

export default PatientInfo;