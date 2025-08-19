import { axiosInstance } from "@/utils/axiosInstance";
import {
  Badge,
  Box,
  Button,
  Group,
  Modal,
  Paper,
  ScrollArea,
  Select,
  Stack,
  Table,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { IconVaccine } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useCurrentHealthWorker } from "../Schedule/AddSchedule";

interface Vaccination {
  id: string;
  name: string;
  description: string;
  administeredDate?: string;
  nextDueDate?: string;
  notes?: string;
  infantId: string;
  healthWorkerId: string;
}

interface Option {
  value: string;
  label: string;
}

const vaccinationOptions = [
  { value: "BCG", label: "BCG (Infant)" },
  { value: "Polio", label: "Polio (Infant)" },
  { value: "HepB", label: "Hepatitis B (Infant)" },
  { value: "DTP", label: "DTP (Toddler)" },
  { value: "MMR", label: "MMR (Toddler)" },
  { value: "Varicella", label: "Varicella (Toddler)" },
];

const InfantVaccination = () => {
  const queryClient = useQueryClient();

  const [filterType] = useState<
    "infant" | "parent" | "healthworker"
  >("infant");
  const [selectedFilterId] = useState<string | null>(null);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [selectedInfantId, setSelectedInfantId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [filterAgeGroup, setFilterAgeGroup] = useState<
    "infant" | "toddler" | "all"
  >("all");
  const [filterDate, setFilterDate] = useState("");

  const { control, handleSubmit, reset } = useForm<
    Partial<Vaccination>
  >({});

  const { data: parents = [] } = useQuery<Option[]>({
    queryKey: ["parents"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/api/parents");
      return data
        .filter((p: any) => p?.id && p.firstName)
        .map((p: any) => ({
          value: p.id,
          label: `${p.firstName} ${p.lastName}`,
        }));
    },
  });

  const { data: children = [] } = useQuery<Option[]>({
    queryKey: ["children", selectedParentId],
    queryFn: async () => {
      if (!selectedParentId) return [];
      const { data } = await axiosInstance.get(
        `/api/infants/mother/${selectedParentId}`
      );
      return data
        .filter((i: any) => i?.id && i.firstName)
        .map((i: any) => ({ value: i.id, label: i.firstName }));
    },
    // enabled: !!selectedParentId,  <-- remove if you want to always fetch
  });

  const { data: currentHealthWorker } = useCurrentHealthWorker();

  const { data: vaccinations = [] } = useQuery<Vaccination[]>({
    queryKey: ["vaccinations", filterType, selectedFilterId],
    queryFn: async () => {
      let endpoint = "/api/vaccinations"; // fetch all by default
      if (selectedFilterId) {
        endpoint =
          filterType === "infant"
            ? `/api/vaccinations/infant/${selectedFilterId}`
            : filterType === "parent"
            ? `/api/vaccinations/parent/${selectedFilterId}`
            : `/api/vaccinations/healthworker/${selectedFilterId}`;
      }
      const { data } = await axiosInstance.get(endpoint);
      return data;
    },
    staleTime: 1000 * 60, // 1 minute caching
  });

  const recordMutation = useMutation({
    mutationFn: (newVaccine: Partial<Vaccination>) =>
      axiosInstance.post("/api/vaccinations", newVaccine),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["vaccinations", filterType, selectedFilterId],
      });
      resetForm();
    },
  });
  const { data: allInfants = [] } = useQuery<Option[]>({
    queryKey: ["infants"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/api/infants");
      return data
        .filter((i: any) => i?.id && i.firstName)
        .map((i: any) => ({
          value: i.id,
          label: `${i.firstName} ${i.lastName}`,
        }));
    },
  });

  const resetForm = () => {
    reset();
    setSelectedParentId(null);
    setSelectedInfantId(null);
    setShowModal(false);
  };

  const getStatus = (v: Vaccination) => {
    const today = new Date();
    if (v.administeredDate && new Date(v.administeredDate) <= today)
      return "completed";
    if (v.nextDueDate && new Date(v.nextDueDate) < today) return "overdue";
    return "upcoming";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "green";
      case "upcoming":
        return "purple";
      case "overdue":
        return "red";
      default:
        return "gray";
    }
  };

  const filteredVaccinations = useMemo(() => {
    return vaccinations.filter((v) => {
      const nameMatch = v.name.toLowerCase().includes(searchName.toLowerCase());
      const ageMatch =
        filterAgeGroup === "all" ||
        (filterAgeGroup === "infant" &&
          ["BCG", "Polio", "HepB"].includes(v.name)) ||
        (filterAgeGroup === "toddler" &&
          ["DTP", "MMR", "Varicella"].includes(v.name));
      const dateMatch =
        !filterDate ||
        (v.administeredDate &&
          dayjs(v.administeredDate).isSame(filterDate, "day"));
      return nameMatch && ageMatch && dateMatch;
    });
  }, [vaccinations, searchName, filterAgeGroup, filterDate]);

  return (
    <Box p="md">
      <Group position="apart" mb="lg">
        <Title order={2}>Vaccination Schedule</Title>
        <Button
          leftIcon={<IconVaccine size={16} />}
          className="bg-purple-600 hover:bg-purple-500"
          onClick={() => setShowModal(true)}
        >
          Record Vaccination
        </Button>
      </Group>

      {/* Search & Filters */}
      {/* Filters */}
      <Group mb="md" spacing="md" align="flex-end">
        {/* Search by vaccine name */}
        <TextInput
          label="Vaccine Name"
          placeholder="Search vaccine"
          value={searchName}
          onChange={(e) => setSearchName(e.currentTarget.value)}
          sx={{ flex: 1 }}
        />

        {/* Filter by age group */}
        <Select
          label="Age Group"
          placeholder="Filter by age"
          value={filterAgeGroup}
          onChange={(val) =>
            setFilterAgeGroup(val as "all" | "infant" | "toddler")
          }
          data={[
            { value: "all", label: "All" },
            { value: "infant", label: "Infant" },
            { value: "toddler", label: "Toddler" },
          ]}
          sx={{ width: 150 }}
        />

        {/* Filter by date */}
        <TextInput
          label="Administered Date"
          type="date"
          placeholder="Filter by date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.currentTarget.value)}
          sx={{ width: 180 }}
        />
      </Group>

      {/* Vaccination Table */}
      <ScrollArea>
        <Paper p="sm" shadow="xs" radius="md">
          <Table highlightOnHover>
            <thead>
              <tr>
                <th>Vaccine</th>
                <th>Child</th>
                <th>Administered</th>
                <th>Next Dose</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredVaccinations.map((v) => (
                <tr key={v.id}>
                  <td>{v.name}</td>
                  <td>
                    <td>
                      {allInfants.find((c) => c.value === v.infantId)?.label ||
                        "-"}
                    </td>
                  </td>
                  <td>
                    {v.administeredDate
                      ? dayjs(v.administeredDate).format("YYYY-MM-DD")
                      : "-"}
                  </td>
                  <td>
                    {v.nextDueDate
                      ? dayjs(v.nextDueDate).format("YYYY-MM-DD")
                      : "-"}
                  </td>
                  <td>
                    <Badge color={getStatusColor(getStatus(v))}>
                      {getStatus(v)}
                    </Badge>
                  </td>
                  <td>{v.notes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Paper>
      </ScrollArea>

      {/* Modal for Recording */}
      <Modal
        opened={showModal}
        onClose={resetForm}
        title="Record Vaccination"
        size="lg"
      >
        <form
          onSubmit={handleSubmit((data) =>
            recordMutation.mutate({
              ...data,
              infantId: selectedInfantId || "",
              healthWorkerId: currentHealthWorker?.id || "",
            })
          )}
        >
          <Stack spacing="md">
            <Select
              label="Parent"
              placeholder="Select parent"
              value={selectedParentId}
              onChange={setSelectedParentId}
              data={parents}
              required
            />
            <Select
              label="Child / Infant"
              placeholder="Select child"
              value={selectedInfantId}
              onChange={setSelectedInfantId}
              data={children}
              required
              disabled={!selectedParentId}
            />
            <Controller
              name="name"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  {...field}
                  label="Vaccination Name"
                  placeholder="Select a vaccine"
                  data={vaccinationOptions}
                  required
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea {...field} label="Description" required />
              )}
            />
            <Controller
              name="administeredDate"
              control={control}
              defaultValue={dayjs().format("YYYY-MM-DD")}
              render={({ field }) => (
                <TextInput
                  {...field}
                  type="date"
                  label="Administered Date"
                  required
                />
              )}
            />
            <Controller
              name="nextDueDate"
              control={control}
              render={({ field }) => (
                <TextInput {...field} type="date" label="Next Due Date" />
              )}
            />
            <Controller
              name="notes"
              control={control}
              render={({ field }) => <Textarea {...field} label="Notes" />}
            />
            <Group position="right">
              <Button
                variant="outline"
                onClick={resetForm}
                className="bg-purple-600 hover:bg-purple-500 text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={recordMutation.isPending}
                className="bg-purple-600 hover:bg-purple-500"
              >
                Record
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Box>
  );
};

export default InfantVaccination;
