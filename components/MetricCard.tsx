import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  trend?: number;
  icon: React.ReactNode;
  trendLabel?: string;
  inverseTrend?: boolean; // If true, negative trend is good (e.g. ACOS)
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend, icon, trendLabel = "vs. mês anterior", inverseTrend = false }) => {
  const isPositive = trend && trend > 0;
  const isNeutral = trend === 0;
  
  // Determine color based on trend and inverseTrend logic
  // Standard: Up is Green, Down is Red.
  // Inverse: Up is Red, Down is Green (e.g. Costs going down is good).
  let trendColorClass = 'text-slate-500';
  let TrendIcon = Minus;

  if (trend && trend !== 0) {
    if (inverseTrend) {
        trendColorClass = trend > 0 ? 'text-red-500' : 'text-green-500';
    } else {
        trendColorClass = trend > 0 ? 'text-green-500' : 'text-red-500';
    }
    TrendIcon = trend > 0 ? ArrowUpRight : ArrowDownRight;
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
        </div>
        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
          {icon}
        </div>
      </div>
      
      {trend !== undefined && (
        <div className="flex items-center gap-2 text-sm">
          <span className={`flex items-center font-semibold ${trendColorClass}`}>
            <TrendIcon size={16} className="mr-1" />
            {Math.abs(trend)}%
          </span>
          <span className="text-slate-400">{trendLabel}</span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;