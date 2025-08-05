import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { insightsData } from '../../lib/insightsData';
import InsightCard from './InsightCard';
import { useToast } from '../../hooks/useToast';

interface DailyInsightsProps {
  onQuickAction?: (action: string) => void;
}

const DailyInsights: React.FC<DailyInsightsProps> = ({ onQuickAction }) => {
  const { toast } = useToast();
  
  const handleSupplementShortcut = useCallback(async (products: string[], category: string) => {
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
  }, [onQuickAction, toast]);

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
        {insightsData.map((insight, index) => (
          <InsightCard
            key={index}
            insight={insight}
            index={index}
            onSupplementShortcut={handleSupplementShortcut}
            onQuickAction={onQuickAction}
          />
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