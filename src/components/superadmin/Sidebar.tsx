import {
    Badge,
    Box,
    Collapse,
    Divider,
    Group,
    Navbar,
    rem,
    Stack,
    Text,
    ThemeIcon,
    Tooltip,
    UnstyledButton
} from '@mantine/core';
import {
    IconBuildingHospital,
    IconChartBar,
    IconChevronDown,
    IconChevronLeft,
    IconChevronRight,
    IconChevronUp,
    IconClipboardList,
    IconDashboard,
    IconHelp,
    IconLogout,
    IconReportAnalytics,
    IconSettings,
    IconUserCheck,
    IconUserCircle,
    IconUserPlus,
    IconUsers,
    IconUserX,
} from '@tabler/icons-react';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavbarLinkProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  badge?: string;
  children?: React.ReactNode;
  expanded?: boolean;
  onToggle?: () => void;
}

const NavbarLink = ({ 
  icon, 
  label, 
  active, 
  onClick, 
  badge, 
  children, 
  expanded = false, 
  onToggle 
}: NavbarLinkProps) => {
  const hasChildren = !!children;

  return (
    <Box>
      <UnstyledButton
        onClick={hasChildren ? onToggle : onClick}
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
          <Group spacing={4}>
            {badge && (
              <Badge size="sm" color="blue" variant="light">
                {badge}
              </Badge>
            )}
            {hasChildren && (
              expanded ? <IconChevronUp size={rem(16)} /> : <IconChevronDown size={rem(16)} />
            )}
          </Group>
        </Group>
      </UnstyledButton>
      {hasChildren && (
        <Collapse in={expanded}>
          <Box pl={rem(32)}>
            {children}
          </Box>
        </Collapse>
      )}
    </Box>
  );
};

interface SidebarProps {
  collapsed: boolean;
  onCollapse: () => void;
}

const Sidebar = ({ collapsed, onCollapse }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [healthWorkersExpanded, setHealthWorkersExpanded] = useState(false);
  const [reportsExpanded, setReportsExpanded] = useState(false);

  const handleLogout = () => {
    // Add logout logic here
    navigate('/auth/signin');
  };

  const mainNavItems = [
    {
      icon: <IconDashboard size={rem(20)} />,
      label: 'Dashboard',
      path: '/superadmin/dashboard',
    },
    {
      icon: <IconUsers size={rem(20)} />,
      label: 'Health Workers',
      path: '/superadmin/health-workers',
      badge: '156',
      expanded: healthWorkersExpanded,
      onToggle: () => setHealthWorkersExpanded(!healthWorkersExpanded),
      children: (
        <Stack spacing="xs">
          <NavbarLink
            icon={<IconUserPlus size={rem(16)} />}
            label="Add New Worker"
            onClick={() => navigate('/superadmin/add-health-worker')}
          />
          <NavbarLink
            icon={<IconUserCheck size={rem(16)} />}
            label="Active Workers"
            onClick={() => navigate('/superadmin/health-workers/active')}
            badge="142"
          />
          <NavbarLink
            icon={<IconUserX size={rem(16)} />}
            label="Inactive Workers"
            onClick={() => navigate('/superadmin/health-workers/inactive')}
            badge="14"
          />
        </Stack>
      ),
    },
    {
      icon: <IconBuildingHospital size={rem(20)} />,
      label: 'Facilities',
      path: '/superadmin/facilities',
      badge: '24',
    },
    {
      icon: <IconReportAnalytics size={rem(20)} />,
      label: 'Reports',
      path: '/superadmin/reports',
      expanded: reportsExpanded,
      onToggle: () => setReportsExpanded(!reportsExpanded),
      children: (
        <Stack spacing="xs">
          <NavbarLink
            icon={<IconChartBar size={rem(16)} />}
            label="Analytics"
            onClick={() => navigate('/superadmin/reports/analytics')}
          />
          <NavbarLink
            icon={<IconClipboardList size={rem(16)} />}
            label="Activity Logs"
            onClick={() => navigate('/superadmin/reports/activity')}
          />
        </Stack>
      ),
    },
    {
      icon: <IconSettings size={rem(20)} />,
      label: 'Settings',
      path: '/superadmin/settings',
    },
  ];

  return (
    <Navbar
      p="md"
      hiddenBreakpoint="sm"
      width={{ sm: collapsed ? 80 : 250 }}
      style={{ transition: 'width 0.3s ease' }}
    >
      <Navbar.Section>
        <Group position="apart" mb="xl">
          <Group>
            <ThemeIcon size={40} radius={40} color="blue">
              <IconUserCircle size={rem(24)} />
            </ThemeIcon>
            {!collapsed && (
              <Box>
                <Text size="sm" weight={500}>Kuza Health</Text>
                <Text size="xs" color="dimmed">Super Admin</Text>
              </Box>
            )}
          </Group>
        </Group>
      </Navbar.Section>

      <Navbar.Section grow>
        <Stack spacing="xs">
          {mainNavItems.map((item) => (
            <NavbarLink
              key={item.path}
              icon={item.icon}
              label={collapsed ? '' : item.label}
              active={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              badge={collapsed ? undefined : item.badge}
              expanded={item.expanded}
              onToggle={item.onToggle}
            >
              {!collapsed && item.children}
            </NavbarLink>
          ))}
        </Stack>
      </Navbar.Section>

      <Navbar.Section>
        <Divider my="sm" />
        <Stack spacing="xs">
          <NavbarLink
            icon={<IconHelp size={rem(20)} />}
            label={collapsed ? '' : 'Help & Support'}
            onClick={() => {/* Handle help */}}
          />
          <NavbarLink
            icon={<IconLogout size={rem(20)} />}
            label={collapsed ? '' : 'Logout'}
            onClick={handleLogout}
          />
          <Tooltip label={collapsed ? "Expand sidebar" : "Collapse sidebar"} position="right">
            <UnstyledButton
              onClick={onCollapse}
              sx={(theme) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: theme.spacing.xs,
                borderRadius: theme.radius.sm,
                color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
                '&:hover': {
                  backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                },
              })}
            >
              {collapsed ? <IconChevronRight size={rem(20)} /> : <IconChevronLeft size={rem(20)} />}
            </UnstyledButton>
          </Tooltip>
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
};

export default Sidebar;
