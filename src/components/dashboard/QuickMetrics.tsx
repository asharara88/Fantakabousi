import React from 'react';
import Card from '../ui/Card';
import { 
  MoonIcon, 
  BoltIcon, 
  HeartIcon, 
  FireIcon 
} from '@heroicons/react/24/outline';

const QuickMetrics: React.FC = () => {
  const metrics = [
    {
      name: 'Sleep Score',
      value: '92',
      unit: '/100',
      trend: '+5%',
      icon: MoonIcon,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
    {
      name: 'Steps',
      value: '8,547',
      unit: '',
      trend: '+12%',
      icon: BoltIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'HRV',
      value: '42',
      unit: 'ms',
      trend: '+3%',
      icon: HeartIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      name: 'Calories',
      value: '2,341',
      unit: 'kcal',
      trend: '-8%',
      icon: FireIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Today's Metrics</h3>
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
              </div>
              <div>
                <div className="font-medium text-slate-900">{metric.name}</div>
                <div className="text-sm text-slate-600">
                  {metric.value}{metric.unit}
                </div>
              </div>
            </div>
            <div className={`text-sm font-medium ${
              metric.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>
              {metric.trend}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default QuickMetrics;