import React from 'react';
import { motion } from 'framer-motion';
import { 
  ClockIcon,
  ChatBubbleLeftRightIcon,
  CubeIcon
} from '@heroicons/react/24/outline';

interface Insight {
  type: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  message: string;
  confidence: number;
  priority: string;
  action: string;
  color: string;
  supplementShortcut?: {
    products: string[];
    category: string;
  };
}

interface InsightCardProps {
  insight: Insight;
  index: number;
  onSupplementShortcut: (products: string[], category: string) => void;
  onQuickAction?: (action: string) => void;
}

const InsightCard: React.FC<InsightCardProps> = ({ 
  insight, 
  index, 
  onSupplementShortcut, 
  onQuickAction 
}) => {
  const getPriorityVariant = (priority: string) => {
    const variants = {
      high: 'bg-red-100 text-red-700 border-red-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      low: 'bg-green-100 text-green-700 border-green-200',
    };
    return variants[priority as keyof typeof variants] || variants.medium;
  };

  return (
    <motion.div
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
              <h3 id={`insight-${index}-title`} className="text-lg font-bold text-foreground">
                {insight.title}
              </h3>
              <div className="flex items-center space-x-3">
                <div className={`px-3 py-1 text-xs font-bold rounded-full border ${getPriorityVariant(insight.priority)}`}>
                  {insight.priority.toUpperCase()}
                </div>
                <div className="flex items-center space-x-2 text-caption">
                  <ClockIcon className="w-3 h-3" />
                  <span>Confidence: {insight.confidence}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Message */}
        <p className="text-base text-muted-foreground leading-relaxed">
          {insight.message}
        </p>
        
        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          {insight.supplementShortcut ? (
            <button 
              onClick={() => onSupplementShortcut(insight.supplementShortcut!.products, insight.supplementShortcut!.category)}
              className={`px-6 py-3 bg-gradient-to-r ${insight.color} text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2`}
            >
              <CubeIcon className="w-4 h-4" />
              <span>Buy {insight.supplementShortcut.products[0]}</span>
            </button>
          ) : (
            <button className={`px-6 py-3 bg-gradient-to-r ${insight.color} text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg`}>
              {insight.action}
            </button>
          )}
          <button 
            onClick={() => onQuickAction?.('coach')}
            className="btn-ghost flex items-center space-x-2"
          >
            <ChatBubbleLeftRightIcon className="w-4 h-4" />
            <span>Ask Coach</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default InsightCard;