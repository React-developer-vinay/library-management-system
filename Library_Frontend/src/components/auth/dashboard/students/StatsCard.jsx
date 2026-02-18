import { TrendingUp } from 'lucide-react';

export default function StatsCard({ title, value, color = 'blue', description = '' }) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    green: 'bg-green-50 border-green-200 text-green-900',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    purple: 'bg-purple-50 border-purple-200 text-purple-900'
  };

  const iconColors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600'
  };

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-6 flex items-center justify-between`}>
      <div>
        <p className="text-sm font-medium opacity-75">{title}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
        {description && <p className="text-xs opacity-60 mt-1">{description}</p>}
      </div>
      <TrendingUp className={`w-10 h-10 ${iconColors[color]} opacity-20`} />
    </div>
  );
}
