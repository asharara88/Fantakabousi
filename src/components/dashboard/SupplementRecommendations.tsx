import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { supabase, Supplement } from '../../lib/supabase';
import { PlusIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '../../lib/utils';

const SupplementRecommendations: React.FC = () => {
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSupplements();
  }, []);

  const fetchSupplements = async () => {
    try {
      const { data, error } = await supabase
        .from('supplements')
        .select('*')
        .limit(3);

      if (error) throw error;
      setSupplements(data || []);
    } catch (error) {
      console.error('Error fetching supplements:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-3 bg-slate-200 rounded"></div>
            <div className="h-3 bg-slate-200 rounded w-3/4"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Today's Stack</h3>
        <Button variant="ghost" size="sm">
          View All
        </Button>
      </div>

      <div className="space-y-3">
        {supplements.map((supplement) => (
          <div key={supplement.id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
            <img
              src={supplement.image_url || 'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg'}
              alt={supplement.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1">
              <div className="font-medium text-slate-900">{supplement.name}</div>
              <div className="text-sm text-slate-600">
                {formatCurrency(supplement.price || 0)}
              </div>
            </div>
            <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors">
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Monthly Total</span>
          <span className="font-semibold text-slate-900">
            {formatCurrency(supplements.reduce((sum, s) => sum + (s.price || 0), 0))}
          </span>
        </div>
        <div className="text-xs text-green-600 mt-1">
          Save 20% with subscription
        </div>
      </div>
    </Card>
  );
};

export default SupplementRecommendations;