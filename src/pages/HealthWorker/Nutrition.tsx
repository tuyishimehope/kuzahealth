import { useState } from "react";
import { Bar } from "react-chartjs-2";
import { CiSearch } from "react-icons/ci";
import { FiSend } from "react-icons/fi";
import type { FontSpec } from "chart.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Input from "../../components/Input";
import { nutrients } from "../../utils/nutrition";
import { useQuery } from "@tanstack/react-query";
import { type Patient } from "../superadmin/AddParent";
import { axiosInstance } from "@/utils/axiosInstance";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Preset messages
const PRESET_MESSAGES = [
  "Ibuka gufata folike acid yawe uyu munsi.",
  "Fungura ibiribwa bikungahaye kuri feri (nk'ibishyimbo, imboga zitukura).",
  "Fata amata cyangwa ibindi bifite kalisiyumu buri munsi.",
  "Nywa amazi ahagije kandi unywe vitamini zawe.",
  "Teganya kugana ivuriro kugira ngo ugenzurwe.",
  "Irinde kurya ibirimo isukari nyinshi n’amavuta menshi.",
  "Fungura imboga n’imbuto buri munsi.",
  "Gumya konsa umwana buri gihe uko ushoboye.",
  "Niba umwana afite amezi 6, tangira kumugaburira indyo yuzuye.",
  "Ongerera umwana amata, imboga, n'ibiribwa bivangwa n’inyama cyangwa amagi.",
  "Nywa amata cyangwa amata y’ifu buri munsi kugira ngo wubake amagufwa.",
  "Irinde kunywa inzoga igihe utwite cyangwa konsa.",
  "Fata umwanya wo kuruhuka bihagije buri munsi.",
  "Komeza gusukura intoki mbere yo gutegura amafunguro.",
  "Irinde guteka ku mwotsi mwinshi, byangiza ubuzima.",
  "Ongerera umwana amavuta y’ibimera ku biryo bye.",
  "Fungura ibinyampeke nk’umuceri, ibigori, n’amasaka.",
  "Irinde gusiga umwana mu zuba rikaze igihe kirekire.",
  "Gusoma no gukina n’umwana bifasha ubwenge bwe gukura.",
  "Shyira umutekano imbere mu rugo kugira ngo umwana atavunika.",
];

const fetchPatients = async () => {
  const response = await axiosInstance.get("/api/parents");
  return response.data;
};

const Nutrition = () => {
  const [selectedMother, setSelectedMother] = useState<string>("");
  const [message, setMessage] = useState("");
  const [nutrientData, setNutrientData] = useState("");
  const [filteredNutritions, setFilteredNutritions] = useState(nutrients);

  const {
    data: mothers = [],
    isLoading,
    isError,
    error,
  } = useQuery<Patient[]>({
    queryKey: ["patients"],
    queryFn: fetchPatients,
  });
  const handleSearch = (term: string) => {
    const filtered = nutrients.filter((nutrient) =>
      nutrient.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredNutritions(filtered);
  };

  const handleSendMessage = () => {
    if (!selectedMother || !message) return;

    // Find the mother by id (assuming selectedMother is the id)
    const mother = mothers.find((m) => m.email === selectedMother);
    if (!mother) return;

    axiosInstance
      .post("/api/nutrition-info", {
        phoneNumber: mother.phone,
        message: message,
        senderEmail: mother.email,
      })
      .then((res) => {
        console.log(res.data);
        alert(
          `Message sent to ${mother.firstName} (${mother.phone}): ${message}`
        );
        setMessage("");
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to send message.");
      });
  };

  const chartData = {
    labels: [
      "Folic Acid",
      "Iron",
      "Calcium",
      "Vitamin D",
      "Omega-3 Fatty Acids",
    ],
    datasets: [
      {
        label: "Recommended Daily Intake",
        data: [400, 27, 1000, 600, 300],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const, labels: { color: "gray" } },
      title: {
        display: true,
        text: "Recommended Daily Intake for Pregnant Women",
        font: {
          size: 18,
          weight: "bold" as const,
          family: "Arial, sans-serif",
        } as FontSpec,
        color: "gray",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(200,200,200,0.5)" },
        ticks: { color: "gray" },
      },
      x: { ticks: { color: "gray" } },
    },
  };

  if (isLoading)
    return <div className="text-center mt-8">Loading mothers...</div>;
  if (isError)
    return (
      <div className="text-center mt-8 text-red-500">
        Error loading mothers: {(error as Error).message}
      </div>
    );

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Mother selection */}
      <div className="max-w-md mx-auto mb-6">
        <label className="block text-gray-700 font-semibold mb-2">
          Select Mother:
        </label>
        <select
          value={selectedMother ?? ""}
          onChange={(e) => setSelectedMother(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
        >
          <option value="" disabled>
            Select a mother
          </option>
          {mothers.map((m, index) => (
            <option key={index} value={m.email}>
              {m.firstName} {m.lastName}
            </option>
          ))}
        </select>
      </div>

      {/* Message sender */}
      {selectedMother && (
        <div className="max-w-md mx-auto mb-8">
          <label className="block text-gray-700 font-semibold mb-2">
            Send Message:
          </label>
          <div className="flex space-x-2">
            <select
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select a message</option>
              {PRESET_MESSAGES.map((msg, idx) => (
                <option key={idx} value={msg}>
                  {msg}
                </option>
              ))}
            </select>
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-1"
            >
              <FiSend />
              <span>Send</span>
            </button>
          </div>
        </div>
      )}

      {/* Nutrient search */}
      <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
        Maternal Nutrition
      </h2>
      <div className="flex items-center border border-slate-400 rounded-full w-64 px-2 my-4 mx-auto">
        <CiSearch />
        <Input
          type="text"
          value={nutrientData}
          placeholder="Search Nutrients"
          onChange={(e) => {
            setNutrientData(e.target.value);
            handleSearch(e.target.value);
          }}
          className="outline-none"
        />
      </div>

      {/* Nutrient cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
        {filteredNutritions.map((nutrient, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              {nutrient.name}
            </h3>
            <p className="text-gray-600">{nutrient.description}</p>
            <p className="font-semibold text-gray-700 mt-2">
              Recommended Intake: {nutrient.recommendedIntake}
            </p>
            <p className="font-semibold text-gray-700 mt-1">
              Sources: {nutrient.sources.join(", ")}
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Nutrition;
