import React, { useState } from 'react';
import {
  AppShell,
  Navbar,
  Header,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  Group,
  Avatar,
  UnstyledButton,
  Stack,
  rem,
  Box,
  Divider,
  Badge,
  Menu,
  ActionIcon,
  Tooltip,
  TextInput,
} from '@mantine/core';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  IconDashboard,
  IconUsers,
  IconUserPlus,
  IconSettings,
  IconLogout,
  IconChevronLeft,
  IconChevronRight,
  IconBell,
  IconSearch,
  IconHelp,
  IconReportAnalytics,
  IconBuildingHospital,
  IconUserCircle,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Sidebar from '../components/superadmin/Sidebar';

interface NavbarLinkProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  badge?: string;
}

const NavbarLink = ({ icon, label, active, onClick, badge }: NavbarLinkProps) => {
  return (
    <UnstyledButton
      onClick={onClick}
      sx={(theme) => ({
        display: 'block',
        width: '100%',
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
        backgroundColor: active ? theme.colors.blue[0] : 'transparent',
        '&:hover': {
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },
      })}
    >
      <Group position="apart">
        <Group>
          {icon}
          <Text size="sm">{label}</Text>
        </Group>
        {badge && (
          <Badge size="sm" color="blue" variant="light">
            {badge}
          </Badge>
        )}
      </Group>
    </UnstyledButton>
  );
};

const SuperAdminLayout = () => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      navbar={
        <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
          <Sidebar collapsed={!opened} onCollapse={() => setOpened(!opened)} />
        </Navbar>
      }
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>
            <Text>Kuza Health - Super Admin</Text>
          </div>
        </Header>
      }
    >
      <Outlet />
    </AppShell>
  );
};

export default SuperAdminLayout; 