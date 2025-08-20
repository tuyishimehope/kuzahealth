import { axiosInstance } from "@/utils/axiosInstance";
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Modal,
  Paper,
  Select,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Activity, Download, Edit, Shield, Users } from "lucide-react";
import {
  MantineReactTable,
  MRT_Cell,
  useMantineReactTable,
} from "mantine-react-table";
import { useMemo, useState } from "react";

export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role: "HEALTH_WORKER" | "ADMIN" | "OTHER"; // adjust roles as needed
  gender: "male" | "female" | string;
  province: string;
  district: string;
  sector: string;
  date_of_Birth: string | null;
  position: string | null;
  enabled: boolean;
  phoneNumber: string;
  otp: string | null;
  otpExpirationTime: number;
  resetToken: string | null;
  resetTokenExpiration: string | null;
  authorities: any[];
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
}

// API calls
const fetchUsers = async () => {
  const { data } = await axiosInstance.get("/api/users");
  return data;
};

const updateUser = async ({ id, updates }: { id: string; updates: any }) => {
  const { data } = await axiosInstance.patch(`/api/users/${id}`, updates);
  return data;
};

const ManageUsers = () => {
  const queryClient = useQueryClient();
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const mutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [opened, setOpened] = useState(false);

  const handleExportPdf = () => {
    const doc = new jsPDF();
    doc.text("Users Export", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [["First Name", "Last Name", "Email", "Role", "Phone", "Status"]],
      body: users.map((u) => [
        u.firstName,
        u.lastName,
        u.email,
        u.role,
        u.phoneNumber,
        u.enabled ? "Active" : "Disabled",
      ]),
    });
    doc.save("users-export.pdf");
  };

  // Stats calculation
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.enabled).length;
    const adminUsers = users.filter((u) => u.role === "ADMIN").length;
    return { totalUsers, activeUsers, adminUsers };
  }, [users]);

  // Define table columns with clean glassmorphism styling
  const columns = useMemo(
    () => [
      {
        accessorKey: "firstName",
        header: "First Name",
        Cell: ({ cell }: { cell: MRT_Cell<User> }) => (
          <Text fw={600} c="violet.7" size="sm">
            {cell.getValue<string>()}
          </Text>
        ),
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
        Cell: ({ cell }: { cell: MRT_Cell<User> }) => (
          <Text fw={500} c="gray.7" size="sm">
            {cell.getValue<string>()}
          </Text>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        Cell: ({ cell }: { cell: MRT_Cell<User> }) => (
          <Text size="xs" c="dimmed" ff="monospace">
            {cell.getValue<string>()}
          </Text>
        ),
      },
      {
        accessorKey: "role",
        header: "Role",
        Cell: ({ cell }: { cell: MRT_Cell<User> }) => {
          const roleColors: Record<User["role"], string> = {
            ADMIN: "violet",
            HEALTH_WORKER: "grape",
            OTHER: "gray",
          };
          const role = cell.getValue<User["role"]>();
          return (
            <Badge
              color={roleColors[role] || "gray"}
              variant="gradient"
              gradient={
                cell.getValue() === "ADMIN"
                  ? { from: "violet", to: "purple" }
                  : { from: "grape", to: "violet" }
              }
              size="sm"
            >
              {role.replace("_", " ")}
            </Badge>
          );
        },
      },
      {
        accessorKey: "phoneNumber",
        header: "Phone",
        Cell: ({ cell }: { cell: MRT_Cell<User> }) => (
          <Text size="xs" c="gray.6" ff="monospace">
            {cell.getValue<string>()}
          </Text>
        ),
      },
      {
        accessorKey: "enabled",
        header: "Status",
        Cell: ({ cell }) =>
          cell.getValue() ? (
            <Badge color="teal" variant="light" size="sm">
              Active
            </Badge>
          ) : (
            <Badge color="red" variant="light" size="sm">
              Disabled
            </Badge>
          ),
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: users,
    enableRowActions: true,
    positionActionsColumn: "last",
    state: { isLoading },
    mantineTableProps: {
      style: {
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        borderRadius: "12px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      },
    },
    mantineTableHeadProps: {
      style: {
        backgroundColor: "rgba(248, 250, 252, 0.8)",
        backdropFilter: "blur(8px)",
      },
    },
    mantineTableBodyProps: {
      style: {
        backgroundColor: "transparent",
      },
    },
    renderTopToolbarCustomActions: () => (
      <Group spacing="sm">
        <Button
          leftIcon={<Download size={16} />}
          variant="light"
          color="indigo"
          onClick={handleExportPdf}
          size="sm"
          radius="md"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(99, 102, 241, 0.2)",
          }}
        >
          Export PDF
        </Button>
      </Group>
    ),
    renderRowActions: ({ row }) => (
      <Tooltip label="Edit User" position="left">
        <ActionIcon
          variant="light"
          color="violet"
          size="sm"
          radius="md"
          onClick={() => {
            setSelectedUser(row.original);
            setOpened(true);
          }}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(139, 69, 199, 0.2)",
          }}
        >
          <Edit size={14} />
        </ActionIcon>
      </Tooltip>
    ),
    enableColumnOrdering: true,
    enableColumnFilters: true,
    enableSorting: true,
    enableGlobalFilter: true,
    initialState: {
      density: "xs",
      showGlobalFilter: true,
    },
  });

  return (
    <div
      className="min-h-screen p-6"
      style={{
        background:
          "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Header Section */}
      <Paper
        p="xl"
        mb="lg"
        radius="xl"
        style={{
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Group position="apart" align="flex-start">
          <div>
            <Group spacing="sm" mb="xs">
              <Shield size={28} color="#6366f1" />
              <Title order={1} c="gray.8" fw={700}>
                User Management
              </Title>
            </Group>
            <Text c="gray.6" size="md">
              Manage users, roles, and system access
            </Text>
          </div>

          {/* Stats Cards */}
          <Group spacing="md">
            <Paper
              p="md"
              radius="lg"
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(99, 102, 241, 0.1)",
                boxShadow: "0 4px 16px rgba(99, 102, 241, 0.1)",
                minWidth: "120px",
              }}
            >
              <Group spacing="sm">
                <Users size={20} color="#6366f1" />
                <div>
                  <Text c="gray.8" fw={700} size="lg">
                    {stats.totalUsers}
                  </Text>
                  <Text c="gray.6" size="xs">
                    Total Users
                  </Text>
                </div>
              </Group>
            </Paper>

            <Paper
              p="md"
              radius="lg"
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(16, 185, 129, 0.1)",
                boxShadow: "0 4px 16px rgba(16, 185, 129, 0.1)",
                minWidth: "120px",
              }}
            >
              <Group spacing="sm">
                <Activity size={20} color="#10b981" />
                <div>
                  <Text c="gray.8" fw={700} size="lg">
                    {stats.activeUsers}
                  </Text>
                  <Text c="gray.6" size="xs">
                    Active
                  </Text>
                </div>
              </Group>
            </Paper>

            <Paper
              p="md"
              radius="lg"
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(139, 69, 199, 0.1)",
                boxShadow: "0 4px 16px rgba(139, 69, 199, 0.1)",
                minWidth: "120px",
              }}
            >
              <Group spacing="sm">
                <Shield size={20} color="#8b45c7" />
                <div>
                  <Text c="gray.8" fw={700} size="lg">
                    {stats.adminUsers}
                  </Text>
                  <Text c="gray.6" size="xs">
                    Admins
                  </Text>
                </div>
              </Group>
            </Paper>
          </Group>
        </Group>
      </Paper>

      {/* Table Section */}
      <Paper
        radius="xl"
        style={{
          background: "rgba(255, 255, 255, 0.6)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        <MantineReactTable table={table} />
      </Paper>

      {/* Edit Modal */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <Text fw={700} c="gray.8" size="lg">
            Edit User Permissions
          </Text>
        }
        centered
        radius="lg"
        overlayProps={{
          opacity: 0.4,
          blur: 8,
        }}
        styles={{
          content: {
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        {selectedUser && (
          <div className="space-y-4">
            <Paper
              p="md"
              radius="md"
              style={{
                background: "rgba(248, 250, 252, 0.8)",
                border: "1px solid rgba(226, 232, 240, 0.5)",
              }}
            >
              <Text fw={600} c="gray.8" mb="xs">
                {selectedUser.firstName} {selectedUser.lastName}
              </Text>
              <Text size="sm" c="gray.6">
                {selectedUser.email}
              </Text>
            </Paper>

            <Select
              label="Role"
              value={selectedUser.role ?? "OTHER"} // fallback to a valid role if null
              onChange={(value) =>
                setSelectedUser({
                  ...selectedUser,
                  role: value as "ADMIN" | "HEALTH_WORKER" | "OTHER", // cast to valid role
                })
              }
              data={[
                { value: "ADMIN", label: "Admin" },
                { value: "HEALTH_WORKER", label: "Health Worker" },
                { value: "OTHER", label: "Other" },
              ]}
              radius="md"
              styles={{
                input: {
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(8px)",
                  borderColor: "rgba(226, 232, 240, 0.8)",
                  "&:focus": {
                    borderColor: "#6366f1",
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                  },
                },
              }}
            />

            <Select
              label="Status"
              value={selectedUser.enabled ? "true" : "false"}
              onChange={(value) =>
                setSelectedUser({ ...selectedUser, enabled: value === "true" })
              }
              data={[
                { value: "true", label: "Active" },
                { value: "false", label: "Disabled" },
              ]}
              radius="md"
              styles={{
                input: {
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(8px)",
                  borderColor: "rgba(226, 232, 240, 0.8)",
                  "&:focus": {
                    borderColor: "#6366f1",
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                  },
                },
              }}
            />

            <Group mt="xl">
              <Button
                variant="light"
                color="gray"
                onClick={() => setOpened(false)}
                radius="md"
              >
                Cancel
              </Button>
              <Button
                variant="filled"
                color="indigo"
                onClick={() => {
                  mutation.mutate({
                    id: selectedUser.id,
                    updates: {
                      role: selectedUser.role,
                      enabled: selectedUser.enabled,
                    },
                  });
                  setOpened(false);
                }}
                loading={mutation.isPending}
                radius="md"
              >
                Save Changes
              </Button>
            </Group>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageUsers;
