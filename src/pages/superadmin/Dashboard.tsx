import {
    Box,
    Button,
    Group,
    Paper,
    rem,
    SimpleGrid,
    Stack,
    Text,
    Title
} from '@mantine/core';
import {
    IconActivity,
    IconChartBar,
    IconHospital,
    IconUserCheck,
    IconUserPlus,
    IconUsers,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: string; icon: any; color: string }) => (
  <Paper shadow="sm" p="md" radius="md" withBorder>
    <Group position="apart">
      <Stack spacing={0}>
        <Text size="xs" color="dimmed" transform="uppercase">
          {title}
        </Text>
        <Text size="xl" weight={700}>
          {value}
        </Text>
      </Stack>
      <Icon size={rem(32)} color={color} />
    </Group>
  </Paper>
);

const QuickActionCard = ({ title, description, icon: Icon, onClick }: { title: string; description: string; icon: any; onClick: () => void }) => (
  <Paper shadow="sm" p="md" radius="md" withBorder>
    <Stack spacing="xs">
      <Group>
        <Icon size={rem(24)} />
        <Text weight={500}>{title}</Text>
      </Group>
      <Text size="sm" color="dimmed">
        {description}
      </Text>
      <Button variant="light" onClick={onClick} mt="xs">
        Take Action
      </Button>
    </Stack>
  </Paper>
);

const Dashboard = () => {
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
          <Title order={2}>Super Admin Dashboard</Title>
        </Group>

        <Stack spacing="xl">
          <motion.div variants={itemVariants}>
            <SimpleGrid cols={4} breakpoints={[{ maxWidth: 'sm', cols: 1 }, { maxWidth: 'md', cols: 2 }]}>
              <StatCard
                title="Total Health Workers"
                value="156"
                icon={IconUsers}
                color="var(--mantine-color-blue-6)"
              />
              <StatCard
                title="Active Health Workers"
                value="142"
                icon={IconUserCheck}
                color="var(--mantine-color-green-6)"
              />
              <StatCard
                title="Total Facilities"
                value="24"
                icon={IconHospital}
                color="var(--mantine-color-violet-6)"
              />
              <StatCard
                title="Active Patients"
                value="1,234"
                icon={IconActivity}
                color="var(--mantine-color-orange-6)"
              />
            </SimpleGrid>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Title order={3} mb="md">Quick Actions</Title>
            <SimpleGrid cols={3} breakpoints={[{ maxWidth: 'sm', cols: 1 }, { maxWidth: 'md', cols: 2 }]}>
              <QuickActionCard
                title="Add Health Worker"
                description="Register a new health worker to the system"
                icon={IconUserPlus}
                onClick={() => {/* Navigate to add health worker */}}
              />
              <QuickActionCard
                title="View Health Workers"
                description="View and manage all registered health workers"
                icon={IconUsers}
                onClick={() => {/* Navigate to view health workers */}}
              />
              <QuickActionCard
                title="View Reports"
                description="Access system-wide reports and analytics"
                icon={IconChartBar}
                onClick={() => {/* Navigate to reports */}}
              />
            </SimpleGrid>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Paper shadow="sm" p="xl" radius="md" withBorder>
              <Title order={3} mb="md">Recent Activity</Title>
              <Stack spacing="md">
                {/* Add recent activity items here */}
                <Text color="dimmed">No recent activity to display</Text>
              </Stack>
            </Paper>
          </motion.div>
        </Stack>
      </motion.div>
    </Box>
  );
};

export default Dashboard; 