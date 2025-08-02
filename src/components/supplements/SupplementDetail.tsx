import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Supplement } from '../../lib/supabase';
import { formatCurrency } from '../../lib/utils';
import { 
  StarIcon,
  HeartIcon,
  ShoppingCartIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BeakerIcon,
  CubeIcon,
  ClockIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

interface SupplementDetailProps {
  supplement: Supplement;
  onAddToCart: (supplement: Supplement) => void;
  onClose: () => void;
  isInCart: boolean;
  onAskCoach?: () => void;
}

const SupplementDetail: React.FC<SupplementDetailProps> = ({
  supplement,
  onAddToCart,
  onClose,
  isInCart,
  onAskCoach,
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'benefits', label: 'Benefits' },
    { id: 'ingredients', label: 'Ingredients' },
    { id: 'usage', label: 'Usage' },
    { id: 'research', label: 'Research' },
  ];

  const getTierInfo = (tier?: string) => {
    switch (tier) {
      case 'green':
        return { color: 'text-green-500', bg: 'bg-green-500/10', label: 'Excellent Evidence', icon: CheckCircleIcon };
      case 'yellow':
        return { color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: 'Good Evidence', icon: InformationCircleIcon };
      case 'orange':
        return { color: 'text-orange-500', bg: 'bg-orange-500/10', label: 'Limited Evidence', icon: ExclamationTriangleIcon };
      case 'red':
        return { color: 'text-red-500', bg: 'bg-red-500/10', label: 'Insufficient Evidence', icon: ExclamationTriangleIcon };
      default:
        return { color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Under Review', icon: BeakerIcon };
    }
  };

  const tierInfo = getTierInfo(supplement.tier);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-body font-semibold text-foreground mb-3">Description</h3>
              <p className="text-body text-muted-foreground leading-relaxed">
                {supplement.detailed_description || supplement.description}
              </p>
            </div>
            
            <div>
              <h3 className="text-body font-semibold text-foreground mb-3">Key Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-caption">Form</div>
                  <div className="text-body font-medium">{supplement.form_type || 'Capsule'}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-caption">Serving Size</div>
                  <div className="text-body font-medium">{supplement.serving_size || '1 capsule'}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-caption">Servings per Container</div>
                  <div className="text-body font-medium">{supplement.servings_per_container || 30}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-caption">Evidence Rating</div>
                  <div className="flex items-center space-x-2">
                    <div className="text-body font-medium">{supplement.evidence_rating || 4.0}/5</div>
                    <div className={`px-2 py-1 rounded-full text-xs font-semibold ${tierInfo.bg} ${tierInfo.color}`}>
                      {tierInfo.label}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'benefits':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-body font-semibold text-foreground mb-3">Key Benefits</h3>
              <div className="space-y-3">
                {supplement.benefits?.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-body text-muted-foreground">{benefit}</span>
                  </div>
                )) || (
                  <p className="text-body text-muted-foreground">
                    {supplement.key_benefits || 'Benefits information not available.'}
                  </p>
                )}
              </div>
            </div>
            
            {supplement.mechanism && (
              <div>
                <h3 className="text-body font-semibold text-foreground mb-3">How It Works</h3>
                <p className="text-body text-muted-foreground leading-relaxed">
                  {supplement.mechanism}
                </p>
              </div>
            )}
          </div>
        );
        
      case 'ingredients':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-body font-semibold text-foreground mb-3">Ingredients</h3>
              <p className="text-body text-muted-foreground leading-relaxed">
                {supplement.ingredients || 'Ingredient information not available.'}
              </p>
            </div>
            
            {supplement.allergen_info && (
              <div className="card-premium p-4 bg-yellow-500/5 border border-yellow-500/20">
                <div className="flex items-start space-x-3">
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="text-body font-semibold text-foreground mb-2">Allergen Information</h4>
                    <p className="text-caption text-muted-foreground">{supplement.allergen_info}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
        
      case 'usage':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-body font-semibold text-foreground mb-3">Directions for Use</h3>
              <p className="text-body text-muted-foreground leading-relaxed">
                {supplement.directions_for_use || 'Take 1 capsule daily with food, or as directed by your healthcare provider.'}
              </p>
            </div>
            
            {supplement.warnings && (
              <div className="card-premium p-4 bg-red-500/5 border border-red-500/20">
                <div className="flex items-start space-x-3">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="text-body font-semibold text-foreground mb-2">Important Warnings</h4>
                    <p className="text-caption text-muted-foreground">{supplement.warnings}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
        
      case 'research':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-body font-semibold text-foreground mb-3">Evidence Summary</h3>
              <p className="text-body text-muted-foreground leading-relaxed">
                {supplement.evidence_summary || 'Research evidence summary not available.'}
              </p>
            </div>
            
            {supplement.source_link && (
              <div>
                <h3 className="text-body font-semibold text-foreground mb-3">Research Sources</h3>
                <a
                  href={supplement.source_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 underline"
                >
                  View Research Studies
                </a>
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="absolute inset-4 lg:inset-8 bg-background rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl flex items-center justify-center p-2">
                  <div className="text-center">
                    <div className="text-sm font-bold text-blue-700 leading-tight line-clamp-2">
                      {supplement.name}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h1 className="text-heading-xl text-foreground">{supplement.name}</h1>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <StarSolidIcon 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < Math.floor(supplement.evidence_rating || 4) 
                              ? 'text-yellow-400' 
                              : 'text-muted/30'
                          }`} 
                        />
                      ))}
                      <span className="text-caption ml-2">({supplement.evidence_rating || 4.0})</span>
                    </div>
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${tierInfo.bg}`}>
                      <tierInfo.icon className={`w-4 h-4 ${tierInfo.color}`} />
                      <span className={`text-caption font-semibold ${tierInfo.color}`}>
                        {tierInfo.label}
                      </span>
                    </div>
                  </div>
                  <div className="text-heading-lg font-bold text-foreground">
                    {formatCurrency(supplement.price)}
                    {supplement.subscription_discount_percent > 0 && (
                      <span className="text-caption text-green-500 ml-2">
                        ({supplement.subscription_discount_percent}% off subscription)
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-border">
            <div className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 text-body font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="p-3 border border-border rounded-xl hover:bg-muted transition-colors">
                  <HeartIcon className="w-5 h-5 text-muted-foreground" />
                </button>
                <div className="text-caption">
                  Stock: {supplement.stock_quantity} available
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button 
                  onClick={onAskCoach}
                  className="btn-secondary"
                >
                  Smart Coach
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onAddToCart(supplement)}
                  disabled={isInCart}
                  className={`btn-primary flex items-center space-x-2 ${
                    isInCart ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isInCart ? (
                    <>
                      <CheckCircleIcon className="w-5 h-5" />
                      <span>In Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCartIcon className="w-5 h-5" />
                      <span>Add to Stack</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SupplementDetail;