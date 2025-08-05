import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  getSupplements, 
  getSupplementStacks,
  SupplementData, 
  SupplementStack,
  formatSupplementPrice 
} from '../lib/supplementsData';
import { useToast } from './useToast';

export const useSupplements = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [supplements, setSupplements] = useState<SupplementData[]>([]);
  const [supplementStacks, setSupplementStacks] = useState<SupplementStack[]>([]);
  const [userSupplements, setUserSupplements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching supplement data...');

      // Fetch supplements from database
      const supplementsData = await getSupplements();
      console.log('Supplements fetched:', supplementsData.length);

      // Fetch supplement stacks
      const stacksData = await getSupplementStacks();
      console.log('Stacks fetched:', stacksData.length);

      // Fetch user's supplements
      const { data: userSupplementsData, error: userError } = await supabase
        .from('user_supplements')
        .select(`
          *,
          supplement:supplements(*)
        `)
        .eq('user_id', user!.id)
        .eq('subscription_active', true);

      if (userError) {
        console.warn('User supplements fetch failed:', userError);
        // Continue without user supplements
      }

      setSupplements(supplementsData);
      setSupplementStacks(stacksData);
      setUserSupplements(userSupplementsData || []);

    } catch (err: any) {
      console.error('Error fetching supplement data:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to load supplements data. Using cached data if available.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addToStack = async (supplementId: string) => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add supplements to your stack.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_supplements')
        .insert({
          user_id: user.id,
          supplement_id: supplementId,
          subscription_active: true,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Already in Stack",
            description: "This supplement is already in your stack.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      await fetchData(); // Refresh data
      
      const supplement = supplements.find(s => s.id === supplementId);
      toast({
        title: "Added to Stack",
        description: `${supplement?.name} has been added to your supplement stack.`,
      });

    } catch (error: any) {
      console.error('Error adding supplement to stack:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add supplement to stack.",
        variant: "destructive",
      });
    }
  };

  const removeFromStack = async (supplementId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('user_supplements')
        .delete()
        .eq('user_id', user.id)
        .eq('supplement_id', supplementId);

      if (error) throw error;

      await fetchData(); // Refresh data
      
      const supplement = supplements.find(s => s.id === supplementId);
      toast({
        title: "Removed from Stack",
        description: `${supplement?.name} has been removed from your stack.`,
      });

    } catch (error: any) {
      console.error('Error removing supplement from stack:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove supplement from stack.",
        variant: "destructive",
      });
    }
  };

  const isInStack = (supplementId: string) => {
    return userSupplements.some(us => us.supplement_id === supplementId);
  };

  const getStackTotal = () => {
    return userSupplements.reduce((total, us) => {
      const supplement = supplements.find(s => s.id === us.supplement_id);
      const price = parseFloat(supplement?.price || '0');
      return total + price;
    }, 0);
  };

  const getFormattedStackTotal = () => {
    return formatSupplementPrice(getStackTotal());
  };

  return {
    supplements,
    supplementStacks,
    userSupplements,
    loading,
    error,
    addToStack,
    removeFromStack,
    isInStack,
    getStackTotal,
    getFormattedStackTotal,
    refetch: fetchData,
  };
};

// Hook for supplement stacks specifically
export const useSupplementStacks = () => {
  const [stacks, setStacks] = useState<SupplementStack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStacks();
  }, []);

  const fetchStacks = async () => {
    try {
      setLoading(true);
      const stacksData = await getSupplementStacks();
      setStacks(stacksData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    stacks,
    loading,
    error,
    refetch: fetchStacks,
  };
};