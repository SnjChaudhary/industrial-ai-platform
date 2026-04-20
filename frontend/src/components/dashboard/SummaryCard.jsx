import { Cpu, AlertTriangle, Activity } from "lucide-react";
const SummaryCard = ({ title, value }) => {
  return (
   <div className="bg-[#1e293b] border border-white/10 p-6 rounded-2xl 
shadow-lg hover:shadow-blue-500/10 transition-all duration-300">

  <div className="flex items-center justify-between">
    <h3 className="text-gray-400 text-sm">{title}</h3>
    <Cpu size={18} className="text-blue-400" />
  </div>

  <p className="text-2xl font-bold mt-2">{value}</p>
</div>
  );
};

export default SummaryCard;
