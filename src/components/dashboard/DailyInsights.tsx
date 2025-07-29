import React from 'react';
import Card from '../ui/Card';
import { 
  LightBulbIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

const DailyInsights: React.FC = () => {
  const insights = [
    {
      type: 'success',
      icon: CheckCircleIcon,
      title: 'Great Sleep Recovery',
      message: 'Your 8.2 hours of sleep with 92% quality shows excellent recovery. Your HRV is trending upward.',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      type: 'tip',
      icon: LightBulbIcon,
      title: 'Optimize Pre-Workout',
      message: 'Based on your readiness score, consider taking creatine 30 minutes before your workout today.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      type: 'warning',
      icon: ExclamationTriangleIcon,
      title: 'Hydration Alert',
      message: 'Your morning weight suggests mild dehydration. Aim for 500ml of water in the next hour.',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Daily Insights</h3>
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className={`p-4 rounded-lg ${insight.bgColor}`}>
            <div className="flex items-start space-x-3">
              <insight.icon className={`w-6 h-6 ${insight.color} flex-shrink-0 mt-0.5`} />
              <div>
                <h4 className={`font-medium ${insight.color}`}>{insight.title}</h4>
                <p className="text-slate-600 text-sm mt-1">{insight.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default DailyInsights;