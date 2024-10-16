import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  FontSpec, // Import FontSpec
} from "chart.js";
import { nutrients } from "../../utils/nutrition";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Nutrition = () => {
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
        data: [400, 27, 1000, 600, 300], // mcg/mg/IU depending on nutrient
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'gray',
        },
      },
      title: {
        display: true,
        text: 'Recommended Daily Intake for Pregnant Women (Nutrients)',
        font: {
          size: 18,
          weight: 'bold' as const, // Use 'as const' for type assertion
          family: 'Arial, sans-serif',
        } as FontSpec, // Cast to FontSpec
        color: 'gray',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(200, 200, 200, 0.5)',
        },
        ticks: {
          color: 'gray',
        },
      },
      x: {
        ticks: {
          color: 'gray',
        },
      },
    },
  };
  
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
        Maternal Nutrition Information
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {nutrients.map((nutrient, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
            <h3 className="text-lg font-bold text-gray-800 mb-2">{nutrient.name}</h3>
            <p className="text-gray-600">{nutrient.description}</p>
            <p className="font-semibold text-gray-700 mt-2">
              <strong>Recommended Intake:</strong> {nutrient.recommendedIntake}
            </p>
            <p className="font-semibold text-gray-700 mt-1">
              <strong>Sources:</strong> {nutrient.sources.join(", ")}
            </p>
          </div>
        ))}
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Nutrition;
