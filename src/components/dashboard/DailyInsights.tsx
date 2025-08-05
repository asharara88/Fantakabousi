import React from 'react';
import { motion } from 'framer-motion';
import { 
  SparklesIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  BeakerIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
  CubeIcon
} from '@heroicons/react/24/outline';
import { useToast } from '../../hooks/useToast';

interface DailyInsightsProps {
  onQuickAction?: (action: string) => void;
}

const DailyInsights: React.FC<DailyInsightsProps> = ({ onQuickAction }) => {
  const { toast } = useToast();
  
  const insights = [
    {
      type: 'success',
      icon: CheckCircleIcon,
      title: 'Perfect Recovery Window',
      message: 'Your HRV is 12% above baseline. Ideal conditions for high-intensity training today.',
      confidence: 96,
      priority: 'high',
      action: 'Start Workout',
      color: 'from-green-500 to-emerald-600',
    },
    {
      type: 'optimization',
      icon: LightBulbIcon,
      title: 'Supplement Timing',
      message: 'Take creatine 30 minutes before your workout for optimal absorption and performance.',
      confidence: 89,
      priority: 'medium',
      action: 'Set Reminder',
      color: 'from-blue-500 to-cyan-600',
      supplementShortcut: {
        products: ['Creatine Monohydrate', 'Creatine HCL'],
        category: 'performance'
      }
    },
    {
      type: 'warning',
      icon: ExclamationTriangleIcon,
      title: 'Hydration Alert',
      message: 'Morning weight suggests mild dehydration. Aim for 750ml water in the next hour.',
      confidence: 92,
      priority: 'high',
      action: 'Track Water',
      color: 'from-amber-500 to-orange-600',
    },
    {
      type: 'insight',
      icon: BeakerIcon,
      title: 'Sleep Pattern Analysis',
      message: 'Your deep sleep increased 15% this week. Consider maintaining current bedtime routine.',
      confidence: 94,
      priority: 'low',
      action: 'View Trends',
      color: 'from-purple-500 to-indigo-600',
    },
  ];

  const getPriorityVariant = (priority: string) => {
    const variants = {
      high: 'bg-red-100 text-red-700 border-red-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      low: 'bg-green-100 text-green-700 border-green-200',
    };
    return variants[priority as keyof typeof variants] || variants.medium;
  };

  const handleSupplementShortcut = async (products: string[], category: string) => {
    try {
      onQuickAction?.('supplements');
      
      toast({
        title: `🛒 ${products.join(' or ')} Available`,
        description: `Premium ${category} supplements ready to order`,
        action: {
          label: "Shop Now",
          onClick: () => onQuickAction?.('supplements')
        }
      });
    } catch (error) {
      console.error('Supplement shortcut failed:', error);
    }
  };

  return (
    <div className="space-y-6" role="region" aria-labelledby="ai-insights-title">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#48C6FF] to-[#2A7FFF] rounded-xl flex items-center justify-center shadow-lg">
            <SparklesIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 id="ai-insights-title" className="text-2xl font-bold text-foreground font-inter">AI Health Insights</h2>
            <p className="text-muted-foreground font-inter">Personalized recommendations from your data</p>
          </div>
        </div>
        <button className="btn-ghost flex items-center space-x-2">
          <span>View All Insights</span>
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
      
      {/* Insights Grid */}
      <div className="mobile-grid-1 lg:grid-cols-2" role="list" aria-label="AI insights">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="card-premium hover:shadow-xl hover:border-[#48C6FF]/30 hover:-translate-y-1 transition-all duration-300"
            role="listitem"
            aria-labelledby={`insight-${index}-title`}
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${insight.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <insight.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 id={`insight-${index}-title`} className="text-lg font-bold text-foreground font-inter">
                      {insight.title}
                    </h3>
                    <div className="flex items-center space-x-3">
                      <div className={`px-3 py-1 text-xs font-bold rounded-full border ${getPriorityVariant(insight.priority)}`}>
                        {insight.priority.toUpperCase()}
                      </div>
                      <div className="flex items-center space-x-2 text-caption">
                        <ClockIcon className="w-3 h-3" />
                        <span>Smart Coach Confidence: {insight.confidence}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Message */}
              <p className="text-base text-muted-foreground leading-relaxed font-inter">
                {insight.message}
              </p>
              
              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                {insight.supplementShortcut ? (
                  <button 
                    onClick={() => handleSupplementShortcut(insight.supplementShortcut.products, insight.supplementShortcut.category)}
                    className={`px-6 py-3 bg-gradient-to-r ${insight.color} text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg font-inter flex items-center space-x-2`}
                    aria-label={`Buy ${insight.supplementShortcut.products[0]}`}
                  >
                    <CubeIcon className="w-4 h-4" />
                    <span>Buy {insight.supplementShortcut.products[0]}</span>
                  </button>
                ) : (
                  <button className={`px-6 py-3 bg-gradient-to-r ${insight.color} text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg font-inter`}>
                    {insight.action}
                  </button>
                )}
                <button 
                  onClick={() => onQuickAction?.('coach')}
                  className="btn-ghost flex items-center space-x-2"
                  aria-label="Ask Smart Coach about this insight"
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4" />
                  <span>Smart Coach</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Status */}
      <div className="card bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[#3BE6C5] rounded-full animate-pulse"></div>
            <div className="text-base font-medium text-foreground font-inter">
              Last updated: 2 minutes ago
            </div>
          </div>
          <button 
            onClick={() => onQuickAction?.('coach')}
            className="btn-primary flex items-center space-x-2"
            aria-label="Get more insights from Smart Coach"
          >
            <SparklesIcon className="w-4 h-4" />
            <span>Get More Insights</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyInsights;