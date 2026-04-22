import type { LucideIcon } from 'lucide-react';

type StatCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  onClick?: () => void;
};

export const StatCard = ({ title, value, icon: Icon, color, onClick }: StatCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between w-full text-left hover:shadow-md transition-shadow"
    >
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="text-white" size={24} />
      </div>
    </button>
  );
};

