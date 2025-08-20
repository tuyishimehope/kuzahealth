import { useTranslation } from "react-i18next";
import InfantMotherAnalytics from "./InfoMotherAnalytics";
import VisitAnalytics from "./VisitAnalytics";

const AnalyticsDashboard = () => {
  const {t} = useTranslation()
  return (
    <div className="bg-gray-50 min-h-screen">
      <main className=" mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">{t("dashboard.overview")}</h1>

        <div className="">
          <div className="lg:col-span-4">
            <InfantMotherAnalytics />
          </div>
          <div className="lg:col-span-4">
            <VisitAnalytics />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsDashboard;
