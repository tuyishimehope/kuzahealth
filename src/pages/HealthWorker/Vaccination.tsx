import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
  } from "chart.js";
  import { Bar } from "react-chartjs-2";
  
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  
  interface Vaccination {
    name: string;
    description: string;
    recommendedDoses: string;
  }
  
  const vaccinations: Vaccination[] = [
    {
      name: "Tetanus-Diphtheria-Pertussis (Tdap)",
      description:
        "Protects against tetanus, diphtheria, and pertussis. Recommended during the 27-36 weeks of pregnancy.",
      recommendedDoses: "1 dose during each pregnancy",
    },
    {
      name: "Influenza (Flu)",
      description:
        "Recommended during flu season to protect both mother and baby from influenza.",
      recommendedDoses: "1 dose annually during flu season",
    },
    {
      name: "COVID-19",
      description:
        "Highly recommended to protect against severe illness. Consult your healthcare provider for the appropriate timing.",
      recommendedDoses: "Follow local health guidelines",
    },
    {
      name: "Hepatitis B",
      description:
        "Important if at risk for Hepatitis B. Consult your healthcare provider.",
      recommendedDoses: "3 doses",
    },
    {
      name: "Measles, Mumps, Rubella (MMR)",
      description:
        "Recommended if not previously vaccinated. Consult your healthcare provider.",
      recommendedDoses: "1-2 doses depending on vaccination history",
    },
  ];
  
  const chartData = {
    labels: vaccinations.map((vaccine) => vaccine.name),
    datasets: [
      {
        label: "Recommended Doses",
        data: [1, 1, 1, 3, 2], // Number of doses
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: 'gray',
        },
      },
      title: {
        display: true,
        text: "Recommended Vaccinations for Pregnant Women",
        font: {
          size: 20,
          weight: 'bold' as const,
        },
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
  
  const Vaccination = () => {
    return (
      <div className="p-6 bg-gray-50">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Maternal Vaccination Information
        </h1>
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <Bar data={chartData} options={chartOptions} aria-label="Vaccination Chart" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vaccinations.map((vaccine, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-4 transition-transform transform hover:scale-105"
              role="region"
              aria-labelledby={`vaccine-${index}`}
            >
              <h3 id={`vaccine-${index}`} className="text-lg font-bold mb-2">
                {vaccine.name}
              </h3>
              <p className="text-gray-700">{vaccine.description}</p>
              <p className="font-semibold text-gray-800 mt-2">
                <strong>Recommended Doses:</strong> {vaccine.recommendedDoses}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default Vaccination;
  