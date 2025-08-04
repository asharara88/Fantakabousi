import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { analyzeReadability, optimizeContent, biowellContentOptimizations } from '../../lib/seo';
import { 
  DocumentTextIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

interface ContentOptimizerProps {
  content: string;
  targetKeywords?: string[];
  onOptimize?: (optimizedContent: string) => void;
}

const ContentOptimizer: React.FC<ContentOptimizerProps> = ({
  content,
  targetKeywords = [],
  onOptimize
}) => {
  const [analysis, setAnalysis] = useState(analyzeReadability(content));
  const [optimization, setOptimization] = useState(optimizeContent(content, targetKeywords));
  const [showOptimized, setShowOptimized] = useState(false);

  const getReadabilityColor = (score: number) => {
    if (score >= 70) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getGradeColor = (grade: number) => {
    if (grade <= 8) return 'text-green-500';
    if (grade <= 12) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Analysis Results */}
      <div className="card-premium p-6">
        <div className="flex items-center space-x-3 mb-6">
          <ChartBarIcon className="w-6 h-6 text-primary" />
          <h3 className="text-heading-lg text-foreground">Content Analysis</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center space-y-2">
            <div className={`text-2xl font-bold ${getReadabilityColor(analysis.fleschReadingEase)}`}>
              {Math.round(analysis.fleschReadingEase)}
            </div>
            <div className="text-caption">Flesch Reading Ease</div>
            <div className="text-xs text-muted-foreground">
              {analysis.fleschReadingEase >= 70 ? 'Easy' : 
               analysis.fleschReadingEase >= 50 ? 'Moderate' : 'Difficult'}
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <div className={`text-2xl font-bold ${getGradeColor(analysis.fleschKincaidGrade)}`}>
              {Math.round(analysis.fleschKincaidGrade)}
            </div>
            <div className="text-caption">Grade Level</div>
            <div className="text-xs text-muted-foreground capitalize">
              {analysis.readingLevel}
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-foreground">
              {Math.round(analysis.averageSentenceLength)}
            </div>
            <div className="text-caption">Avg Sentence Length</div>
            <div className="text-xs text-muted-foreground">
              {analysis.averageSentenceLength > 20 ? 'Too long' : 
               analysis.averageSentenceLength < 8 ? 'Too short' : 'Good'}
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <div className={`text-2xl font-bold ${
              analysis.passiveVoicePercentage > 20 ? 'text-red-500' : 'text-green-500'
            }`}>
              {Math.round(analysis.passiveVoicePercentage)}%
            </div>
            <div className="text-caption">Passive Voice</div>
            <div className="text-xs text-muted-foreground">
              {analysis.passiveVoicePercentage > 20 ? 'Too high' : 'Good'}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {analysis.recommendations.length > 0 && (
        <div className="card-premium p-6">
          <div className="flex items-center space-x-3 mb-4">
            <LightBulbIcon className="w-6 h-6 text-yellow-500" />
            <h3 className="text-body font-semibold text-foreground">Recommendations</h3>
          </div>
          
          <div className="space-y-3">
            {analysis.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 mt-0.5" />
                <span className="text-body text-foreground">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Comparison */}
      <div className="card-premium p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <DocumentTextIcon className="w-6 h-6 text-primary" />
            <h3 className="text-body font-semibold text-foreground">Content Optimization</h3>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowOptimized(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                !showOptimized ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Original
            </button>
            <button
              onClick={() => setShowOptimized(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                showOptimized ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Optimized
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-muted/20 rounded-lg">
            <div className="text-sm font-medium text-foreground mb-2">
              {showOptimized ? 'Optimized Content' : 'Original Content'}
            </div>
            <div className="text-body text-muted-foreground leading-relaxed">
              {showOptimized ? optimization.optimized : optimization.original}
            </div>
          </div>
          
          {showOptimized && optimization.improvements.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-foreground">Improvements Made:</div>
              {optimization.improvements.map((improvement, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  <span className="text-caption text-muted-foreground">{improvement}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {onOptimize && (
          <div className="mt-6 pt-4 border-t border-border">
            <button
              onClick={() => onOptimize(optimization.optimized)}
              className="btn-primary"
            >
              Apply Optimization
            </button>
          </div>
        )}
      </div>

      {/* Biowell Content Examples */}
      <div className="card-premium p-6">
        <div className="flex items-center space-x-3 mb-6">
          <CheckCircleIcon className="w-6 h-6 text-green-500" />
          <h3 className="text-body font-semibold text-foreground">Biowell Content Examples</h3>
        </div>
        
        <div className="space-y-6">
          {Object.entries(biowellContentOptimizations).map(([key, example]) => (
            <div key={key} className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground capitalize">
                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </h4>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-xs text-red-500 font-medium">Before:</div>
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg text-sm">
                    {example.original}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-xs text-green-500 font-medium">After:</div>
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg text-sm">
                    {example.optimized}
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                {example.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-primary rounded-full"></div>
                    <span className="text-xs text-muted-foreground">{improvement}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentOptimizer;