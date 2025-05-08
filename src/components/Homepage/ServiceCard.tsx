// New component for consistent service cards
const ServiceCard = ({ image, title, description }:{image:string,title:string,description:string}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
      <div className="relative">
        <img 
          src={image} 
          alt={title} 
          className="h-64 w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-transparent opacity-40"></div>
      </div>
      <div className="p-6 space-y-3">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
        <button className="mt-2 text-purple-600 font-medium hover:text-purple-800 flex items-center group">
          Learn more
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;