// Custom contact input component
const ContactInput = ({ label, type, placeholder, textarea = false }:{label:string,type?:string,placeholder:string,textarea?:boolean}) => {
  return (
    <div className="space-y-2">
      <label className="text-white font-medium block">{label}</label>
      {textarea ? (
        <textarea
          placeholder={placeholder}
          rows={4}
          className="w-full rounded-lg px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 
          text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition"
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className="w-full rounded-lg px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 
          text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition"
        />
      )}
    </div>
  );
};

export default ContactInput;