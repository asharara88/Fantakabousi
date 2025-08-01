import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { getSupplements, SupplementData } from '../lib/supplementsData';
import { getUserSupplements, addSupplementToStack, removeSupplementFromStack } from '../lib/api';
import { useToast } from './useToast';

export const useSupplements = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [supplements, setSupplements] = useState<SupplementData[]>([]);
  const [userSupplements, setUserSupplements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cleanup function to prevent memory leaks
  useEffect(() => {
    return () => {
      // Clear large data arrays when component unmounts
      setSupplements([]);
      setUserSupplements([]);
    };
  }, []);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch supplements from CSV
      const supplementsData = await getSupplements();

      // Fetch user's supplements
      const userSupplementsData = await getUserSupplements(user!.id);

      setSupplements(supplementsData);
      setUserSupplements(userSupplementsData);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to load supplements data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addToStack = async (supplementId: string) => {
    try {
      await addSupplementToStack(user!.id, supplementId);
      await fetchData(); // Refresh data
      
      const supplement = supplements.find(s => s.id === supplementId);
      toast({
        title: "Added to Stack",
        description: `${supplement?.name} has been added to your supplement stack.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add supplement to stack.",
        variant: "destructive",
      });
    }
  };

  const removeFromStack = async (supplementId: string) => {
    try {
      await removeSupplementFromStack(user!.id, supplementId);
      await fetchData(); // Refresh data
      
      const supplement = supplements.find(s => s.id === supplementId);
      toast({
        title: "Removed from Stack",
        description: `${supplement?.name} has been removed from your stack.`,
      });
    } catch (error: any) {
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
      return total + (supplement?.price || 0);
    }, 0);
  };

  return {
    supplements,
    userSupplements,
    loading,
    error,
    addToStack,
    removeFromStack,
    isInStack,
    getStackTotal,
    refetch: fetchData,
  };
};