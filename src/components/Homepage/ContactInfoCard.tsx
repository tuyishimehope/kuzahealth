import type { ReactElement } from "react";

// Enhanced Contact Info Card
const ContactInfoCard = ({ title, description, detail, icon }:{title:string,description:string,detail:string,icon:ReactElement}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start">
        <div className="bg-purple-100 p-3 rounded-full mr-4">
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-xl text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 mb-1">{description}</p>
          <p className="text-purple-600 font-medium">{detail}</p>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoCard