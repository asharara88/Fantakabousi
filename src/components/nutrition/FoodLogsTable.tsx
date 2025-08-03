import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import AccessibleTable, { TableColumn } from '../ui/AccessibleTable';
import { Badge } from '../ui/Badge';
import { formatDate, formatTime } from '../../lib/utils';
import { 
  BeakerIcon,
  ClockIcon,
  TrashIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

interface FoodLog {
  id: string;
  food_name: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  portion_size: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  glucose_impact: number;
  meal_time: string;
  created_at: string;
}

const FoodLogsTable: React.FC = () => {
  const { user } = useAuth();
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLogs, setSelectedLogs] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      fetchFoodLogs();
    }
  }, [user]);

  const fetchFoodLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('food_logs')
        .select('*')
        .eq('user_id', user?.id)
        .order('meal_time', { ascending: false })
        .limit(100);

      if (error) throw error;
      setFoodLogs(data || []);
    } catch (error) {
      console.error('Error fetching food logs:', error);
      // Mock data for demo
      setFoodLogs([
        {
          id: '1',
          food_name: 'Grilled Chicken Breast',
          meal_type: 'lunch',
          portion_size: '150g',
          calories: 231,
          protein: 43.5,
          carbohydrates: 0,
          fat: 5.0,
          glucose_impact: 2,
          meal_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          food_name: 'Greek Yogurt with Berries',
          meal_type: 'snack',
          portion_size: '1 cup',
          calories: 120,
          protein: 15,
          carbohydrates: 18,
          fat: 0,
          glucose_impact: 8,
          meal_time: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getMealTypeBadge = (mealType: string) => {
    const variants = {
      breakfast: 'info',
      lunch: 'success',
      dinner: 'warning',
      snack: 'secondary'
    } as const;

    return (
      <Badge variant={variants[mealType as keyof typeof variants] || 'outline'}>
        {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
      </Badge>
    );
  };

  const getGlucoseImpactBadge = (impact: number) => {
    if (impact <= 5) return <Badge variant="success">Low Impact</Badge>;
    if (impact <= 15) return <Badge variant="warning">Moderate Impact</Badge>;
    return <Badge variant="destructive">High Impact</Badge>;
  };

  const columns: TableColumn<FoodLog>[] = [
    {
      key: 'food_name',
      header: 'Food Item',
      accessor: (row) => (
        <div className="space-y-1">
          <div className="font-semibold text-foreground">{row.food_name}</div>
          <div className="text-sm text-muted-foreground">{row.portion_size}</div>
        </div>
      ),
      sortable: true,
      filterable: true,
      width: '250px',
      description: 'Food item name and portion size'
    },
    {
      key: 'meal_type',
      header: 'Meal Type',
      accessor: (row) => getMealTypeBadge(row.meal_type),
      sortable: true,
      filterable: true,
      align: 'center',
      description: 'Type of meal: breakfast, lunch, dinner, or snack'
    },
    {
      key: 'calories',
      header: 'Calories',
      accessor: (row) => (
        <div className="font-mono font-semibold text-right">
          {row.calories}
        </div>
      ),
      sortable: true,
      align: 'right',
      description: 'Total calories in the food item'
    },
    {
      key: 'macros',
      header: 'Macros (P/C/F)',
      accessor: (row) => (
        <div className="font-mono text-sm space-y-1">
          <div>P: {row.protein}g</div>
          <div>C: {row.carbohydrates}g</div>
          <div>F: {row.fat}g</div>
        </div>
      ),
      align: 'center',
      description: 'Macronutrients: Protein, Carbohydrates, and Fat in grams'
    },
    {
      key: 'glucose_impact',
      header: 'Glucose Impact',
      accessor: (row) => (
        <div className="space-y-1">
          <div className="font-semibold text-center">{row.glucose_impact}</div>
          {getGlucoseImpactBadge(row.glucose_impact)}
        </div>
      ),
      sortable: true,
      align: 'center',
      description: 'Estimated impact on blood glucose levels'
    },
    {
      key: 'meal_time',
      header: 'When',
      accessor: (row) => (
        <div className="space-y-1">
          <div className="font-medium">{formatDate(row.meal_time)}</div>
          <div className="text-sm text-muted-foreground">{formatTime(row.meal_time)}</div>
        </div>
      ),
      sortable: true,
      description: 'Date and time when the food was consumed'
    },
    {
      key: 'actions',
      header: 'Actions',
      accessor: (row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Edit food log
            }}
            className="p-1 text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 rounded"
            aria-label={`Edit food log for ${row.food_name}`}
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Delete food log
            }}
            className="p-1 text-muted-foreground hover:text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 rounded"
            aria-label={`Delete food log for ${row.food_name}`}
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      ),
      width: '100px',
      description: 'Edit or delete food log entry'
    }
  ];

  const handleSort = (column: string, direction: 'asc' | 'desc') => {
    const sorted = [...foodLogs].sort((a, b) => {
      let aValue: any = a[column as keyof FoodLog];
      let bValue: any = b[column as keyof FoodLog];

      if (column === 'meal_time' || column === 'created_at') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (typeof aValue === 'string') {
        return direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    });

    setFoodLogs(sorted);
  };

  const handleBulkDelete = async () => {
    if (selectedLogs.size === 0) return;

    try {
      const { error } = await supabase
        .from('food_logs')
        .delete()
        .in('id', Array.from(selectedLogs));

      if (error) throw error;

      setFoodLogs(prev => prev.filter(log => !selectedLogs.has(log.id)));
      setSelectedLogs(new Set());
    } catch (error) {
      console.error('Error deleting food logs:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Food Logs</h2>
          <p className="text-muted-foreground">
            Track your nutrition and meal history
          </p>
        </div>
        
        {selectedLogs.size > 0 && (
          <button
            onClick={handleBulkDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/20"
          >
            Delete {selectedLogs.size} Selected
          </button>
        )}
      </div>

      <AccessibleTable
        data={foodLogs}
        columns={columns}
        caption="Food consumption log showing meals, nutritional information, and glucose impact data. Navigate with keyboard arrows and use Tab to access action buttons."
        loading={loading}
        emptyMessage="No food logs found. Start logging your meals to track nutrition and glucose impact."
        onSort={handleSort}
        onRowClick={(log) => console.log('View food log details:', log)}
        selectable={true}
        selectedRows={selectedLogs}
        onSelectionChange={setSelectedLogs}
        getRowId={(row) => row.id}
        searchable={true}
        stickyHeader={true}
        maxHeight="500px"
        pageSize={15}
        className="bg-card rounded-xl border border-border shadow-sm"
      />

      {/* Nutrition Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Calories', value: foodLogs.reduce((sum, log) => sum + log.calories, 0), unit: 'kcal' },
          { label: 'Total Protein', value: foodLogs.reduce((sum, log) => sum + log.protein, 0), unit: 'g' },
          { label: 'Total Carbs', value: foodLogs.reduce((sum, log) => sum + log.carbohydrates, 0), unit: 'g' },
          { label: 'Avg Glucose Impact', value: Math.round(foodLogs.reduce((sum, log) => sum + log.glucose_impact, 0) / foodLogs.length) || 0, unit: '' }
        ].map((stat, index) => (
          <div key={index} className="card text-center">
            <div className="text-2xl font-bold text-foreground">{stat.value}{stat.unit}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodLogsTable;