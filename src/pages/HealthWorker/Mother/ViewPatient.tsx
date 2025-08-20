import { axiosInstance } from "@/utils/axiosInstance";
import {
  Badge,
  Box,
  Button,
  Group,
  Paper,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconEye, IconPlus, IconTrash } from "@tabler/icons-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from "mantine-react-table";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // ✅ translation hook

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  expectedDeliveryDate: string;
  bloodGroup: string;
  maritalStatus: string;
  emergencyContactFullName: string;
  emergencyContactNumber: string;
  emergencyContactRelationship: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  highRisk: boolean;
  createdAt: string;
  updatedAt: string;
}

const MaritimePatientDashboard = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation(); // ✅ init translation

  const [globalFilter] = useState("");
  const [selectedStatus] = useState<"all" | Patient["maritalStatus"]>("all");
  const [rowSelection, setRowSelection] = useState({});

  const fetchPatients = async (): Promise<Patient[]> => {
    const response = await axiosInstance.get("/api/parents");
    return response.data;
  };

  const { data: patients = [], isLoading, isError, error } = useQuery({
    queryKey: ["patients"],
    queryFn: fetchPatients,
    staleTime: 1000 * 60 * 5,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => axiosInstance.delete(`/api/parents/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["patients"] }),
  });

  const columns = useMemo<MRT_ColumnDef<Patient>[]>(
    () => [
      { accessorKey: "firstName", header: t("patient.firstName"), size: 120 },
      { accessorKey: "lastName", header: t("patient.lastName"), size: 120 },
      { accessorKey: "phone", header: t("patient.phone"), size: 140 },
      {
        accessorKey: "expectedDeliveryDate",
        header: t("patient.edd"),
        size: 120,
        Cell: ({ cell }) =>
          new Date(cell.getValue<string>()).toLocaleDateString(),
      },
      { accessorKey: "bloodGroup", header: t("patient.bloodGroup"), size: 100 },
      {
        accessorKey: "highRisk",
        header: t("patient.highRisk"),
        size: 100,
        Cell: ({ cell }) =>
          cell.getValue<boolean>() ? (
            <Badge color="red">{t("common.yes")}</Badge>
          ) : (
            <Badge color="green">{t("common.no")}</Badge>
          ),
      },
    ],
    [t]
  );

  const filteredData = useMemo(() => {
    return selectedStatus === "all"
      ? patients
      : patients.filter((p) => p.maritalStatus === selectedStatus);
  }, [patients, selectedStatus]);

  const table = useMantineReactTable({
    columns,
    data: filteredData,
    enableGlobalFilter: true,
    enableSorting: true,
    enableRowSelection: true,
    enableRowActions: true,
    positionActionsColumn: "last",
    globalFilterFn: "fuzzy",
    state: { isLoading: isLoading, globalFilter, rowSelection },
    onRowSelectionChange: setRowSelection,
    displayColumnDefOptions: {
      "mrt-row-actions": { header: t("common.actions"), size: 140 },
    },
    renderRowActions: ({ row }) => (
      <Group spacing={4} position="center">
        <Button
          size="xs"
          variant="subtle"
          color="purple"
          leftIcon={<IconEye size={14} />}
          onClick={() =>
            navigate(`/healthworker/view-patient/${row.original.id}`)
          }
        >
          {t("common.view")}
        </Button>
        <Button
          size="xs"
          variant="subtle"
          color="red"
          leftIcon={<IconTrash size={14} />}
          onClick={() => {
            if (window.confirm(t("patient.confirmDelete"))) {
              deleteMutation.mutate(row.original.id);
            }
          }}
        >
          {t("common.delete")}
        </Button>
      </Group>
    ),
    renderTopToolbarCustomActions: () => (
      <Group ml="xs">
        <Button
          leftIcon={<IconPlus size={20} />}
          color="violet"
          onClick={() => navigate("/healthworker/patient")}
        >
          {t("patient.newMother")}
        </Button>
      </Group>
    ),
  });

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Paper p="xl" withBorder shadow="md" radius="md" sx={{ maxWidth: 500 }}>
          <Title order={3} color="red">
            {t("errors.title")}
          </Title>
          <Text my="md">{isError}</Text>
          <Button color="red" onClick={() => window.location.reload()}>
            {t("errors.retry")}
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      p="md"
      sx={{
        background: theme.fn.linearGradient(45, "#f6f9fc", "#edf2f7"),
        height: "100vh",
      }}
    >
      <MantineReactTable table={table} />
    </Box>
  );
};

export default MaritimePatientDashboard;
