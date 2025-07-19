import { useEffect, useState, useMemo } from "react";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from "mantine-react-table";
import {
  Button,
  Group,
  Stack,
  TextInput,
  Title,
  Modal,
  rem,
} from "@mantine/core";
import { IconPlus, IconSearch, IconEye, IconTrash } from "@tabler/icons-react";
import { axiosInstance } from "@/utils/axiosInstance";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

interface Facility {
  id: string;
  name: string;
  location: string;
  type: string;
  services: string[];
  createdAt: string;
}

const Facilities = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [search, setSearch] = useState("");
  const [opened, { open, close }] = useDisclosure(false);
  const [selected, setSelected] = useState<Facility | null>(null);

  useEffect(() => {
    axiosInstance
      .get("/api/facilities")
      .then((res) => setFacilities(res.data))
      .catch((err) => console.log(err));
  }, []);

  const filtered = facilities.filter((f) =>
    `${f.name} ${f.location} ${f.type}`.toLowerCase().includes(search.toLowerCase())
  );

  const columns = useMemo<MRT_ColumnDef<Facility>[]>(() => [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "location", header: "Location" },
    { accessorKey: "type", header: "Type" },
    {
      accessorKey: "services",
      header: "Services",
      Cell: ({ cell }) => (cell.getValue() as string[]).join(", "),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      Cell: ({ row }) => (
        <Group spacing="xs">
          <Button
            size="xs"
            onClick={() => {
              setSelected(row.original);
              open();
            }}
            leftIcon={<IconEye size={14} />}
          >
            View
          </Button>
          <Button
            size="xs"
            color="red"
            onClick={() => handleDelete(row.original.id)}
            leftIcon={<IconTrash size={14} />}
          >
            Delete
          </Button>
        </Group>
      ),
    },
  ], [open]);

  const table = useMantineReactTable({
    columns,
    data: filtered,
    enableColumnActions: false,
    enableColumnFilters: false,
  });

  const handleDelete = (id: string) => {
    notifications.show({ message: "Facility deleted", color: "green" });
    console.log("id",id)
    // axiosInstance.delete(`/api/facilities/${id}`);
  };

  return (
    <Stack p="md">
      <Group position="apart">
        <Title order={2}>Facilities</Title>
        <Button leftIcon={<IconPlus size={rem(16)} />}>Add Facility</Button>
      </Group>

      <TextInput
        placeholder="Search facilities..."
        icon={<IconSearch size={16} />}
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
      />

      <MantineReactTable table={table} />

      <Modal opened={opened} onClose={close} title="Facility Details">
        {selected && (
          <Stack>
            <Title order={4}>{selected.name}</Title>
            <p><strong>Location:</strong> {selected.location}</p>
            <p><strong>Type:</strong> {selected.type}</p>
            <p><strong>Services:</strong> {selected.services.join(", ")}</p>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
};

export default Facilities;
