import { 
  Paper, 
  Avatar, 
  SimpleGrid, 
  Group, 
  Box, 
  Badge, 
  Text,
  Stack,
  Divider,
  ThemeIcon,
  Tooltip
} from "@mantine/core";
import { 
  IconUser, 
  IconCalendar, 
  IconWeight, 
  IconRuler, 
  IconClock, 
  IconMapPin,
  IconStethoscope 
} from "@tabler/icons-react";
import type { Patient } from "./ViewPatient";

export type Child = {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  deliveryDate: string;
  birthWeight: number | string; // Handle both number and string types
  birthHeight: number | string; // Handle both number and string types
  birthTime: string;
  deliveryLocation: string;
  assignedDoctor: string;
  createdAt?: string;
  updatedAt?: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  specialConditions?: string;
  mother?: Patient;
};

// Utility functions
const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};

// Safe number conversion with validation
const formatMeasurement = (value: number | string, unit: string): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(numValue) ? `${value} ${unit}` : `${numValue} ${unit}`;
};

// Data display component with consistent styling
const InfoItem = ({ 
  icon, 
  label, 
  value, 
  tooltip 
}: { 
  icon: React.ReactNode;
  label: string;
  value: string | number;
  tooltip?: string;
}) => (
  <Group spacing="xs" noWrap>
    <ThemeIcon size="sm" variant="light" color="gray">
      {icon}
    </ThemeIcon>
    <Box sx={{ minWidth: 0, flex: 1 }}>
      <Tooltip label={tooltip} disabled={!tooltip}>
        <Text size="sm" color="dimmed" sx={{ lineHeight: 1.2 }}>
          {label}
        </Text>
      </Tooltip>
      <Text size="sm" weight={500} truncate>
        {value}
      </Text>
    </Box>
  </Group>
);

// Enhanced child record component
export const ChildRecord = ({ child }: { child: Child }) => {
  const genderColor = child.gender === "FEMALE" ? "pink" : "blue";
  const initials = `${child.firstName.charAt(0)}${child.lastName.charAt(0)}`;
  
  return (
    <Paper
      p="lg"
      mb="md"
      radius="md"
      shadow="sm"
      withBorder
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        transition: 'box-shadow 150ms ease, transform 150ms ease',
        '&:hover': {
          boxShadow: theme.shadows.md,
          transform: 'translateY(-2px)',
        }
      })}
    >
      {/* Header Section */}
      <Group position="apart" mb="md">
        <Group spacing="md">
          <Avatar 
            size="xl" 
            radius="xl" 
            color={genderColor}
            sx={(theme) => ({
              fontSize: theme.fontSizes.lg,
              fontWeight: 600
            })}
          >
            {initials}
          </Avatar>
          <Stack spacing={2}>
            <Text size="xl" weight={600} sx={{ lineHeight: 1.2 }}>
              {child.firstName} {child.lastName}
            </Text>
            <Group spacing="xs">
              <IconCalendar size={14} />
              <Text size="sm" color="dimmed">
                Born {formatDate(child.deliveryDate)}
              </Text>
            </Group>
          </Stack>
        </Group>
        
        <Badge 
          size="lg" 
          variant="light"
          color={genderColor}
          sx={{ textTransform: 'capitalize' }}
        >
          {child.gender.toLowerCase()}
        </Badge>
      </Group>

      <Divider mb="md" />

      {/* Birth Details Grid */}
      <SimpleGrid 
        cols={2} 
        spacing="md"
        breakpoints={[
          { maxWidth: 'sm', cols: 1 }
        ]}
      >
        {child.birthWeight && (
          <InfoItem
            icon={<IconWeight size={16} />}
            label="Birth Weight"
            value={formatMeasurement(child.birthWeight, 'kg')}
            tooltip="Weight at time of birth"
          />
        )}
        
        {child.birthHeight && (
          <InfoItem
            icon={<IconRuler size={16} />}
            label="Birth Height"
            value={formatMeasurement(child.birthHeight, 'cm')}
            tooltip="Height at time of birth"
          />
        )}
        
        {child.birthTime && (
          <InfoItem
            icon={<IconClock size={16} />}
            label="Birth Time"
            value={child.birthTime}
            tooltip="Time of delivery"
          />
        )}
        
        {child.deliveryLocation && (
          <InfoItem
            icon={<IconMapPin size={16} />}
            label="Delivery Location"
            value={child.deliveryLocation}
            tooltip="Hospital or clinic where delivery occurred"
          />
        )}
        
        {child.assignedDoctor && (
          <InfoItem
            icon={<IconStethoscope size={16} />}
            label="Attending Doctor"
            value={child.assignedDoctor}
            tooltip="Doctor who attended the delivery"
          />
        )}
        
        {child.bloodGroup && (
          <InfoItem
            icon={<IconUser size={16} />}
            label="Blood Group"
            value={child.bloodGroup}
            tooltip="Child's blood type"
          />
        )}
      </SimpleGrid>

      {/* Special Conditions (if any) */}
      {child.specialConditions && (
        <>
          <Divider mt="md" mb="sm" />
          <Box>
            <Text size="sm" color="dimmed" mb={4}>
              Special Conditions
            </Text>
            <Text size="sm" sx={{ fontStyle: 'italic' }}>
              {child.specialConditions}
            </Text>
          </Box>
        </>
      )}
    </Paper>
  );
};