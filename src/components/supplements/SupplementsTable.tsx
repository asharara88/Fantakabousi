import React, { useState, useEffect } from 'react';
import { useSupplements } from '../../hooks/useSupplements';
import AccessibleTable, { TableColumn } from '../ui/AccessibleTable';
import { Badge } from '../ui/Badge';
import { formatCurrency } from '../../lib/utils';
import { 
  StarIcon,
  ShoppingCartIcon,
  HeartIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

interface SupplementTableData {
  id: string;
  name: string;
  category: string;
  price: number;
  evidence_rating: number;
  tier: string;
  stock_quantity: number;
  is_available: boolean;
  is_featured: boolean;
  subscription_discount_percent: number;
}

const SupplementsTable: React.FC = () => {
  const { supplements, loading, addToStack, isInStack } = useSupplements();
  const [selectedSupplements, setSelectedSupplements] = useState<Set<string>>(new Set());

  const getTierBadge = (tier: string) => {
    const variants = {
      green: 'success',
      yellow: 'warning', 
      orange: 'warning',
      red: 'destructive'
    } as const;

    const labels = {
      green: 'Excellent',
      yellow: 'Good',
      orange: 'Limited',
      red: 'Insufficient'
    };

    return (
      <Badge variant={variants[tier as keyof typeof variants] || 'outline'}>
        {labels[tier as keyof typeof labels] || 'Unknown'} Evidence
      </Badge>
    );
  };

  const getRatingStars = (rating: number) => (
    <div className="flex items-center space-x-1" role="img" aria-label={`${rating} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <StarSolidIcon 
          key={i} 
          className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        />
      ))}
      <span className="text-sm text-muted-foreground ml-1">({rating})</span>
    </div>
  );

  const columns: TableColumn<SupplementTableData>[] = [
    {
      key: 'name',
      header: 'Supplement',
      accessor: (row) => (
        <div className="space-y-1">
          <div className="font-semibold text-foreground">{row.name}</div>
          <div className="text-sm text-muted-foreground">{row.category}</div>
          {row.is_featured && (
            <Badge variant="info" className="text-xs">Featured</Badge>
          )}
        </div>
      ),
      sortable: true,
      filterable: true,
      width: '300px',
      description: 'Supplement name and category information'
    },
    {
      key: 'evidence_rating',
      header: 'Evidence Rating',
      accessor: (row) => getRatingStars(row.evidence_rating || 4.0),
      sortable: true,
      align: 'center',
      description: 'Scientific evidence rating from 1 to 5 stars'
    },
    {
      key: 'tier',
      header: 'Evidence Tier',
      accessor: (row) => getTierBadge(row.tier || 'yellow'),
      sortable: true,
      filterable: true,
      align: 'center',
      description: 'Evidence quality classification'
    },
    {
      key: 'price',
      header: 'Price',
      accessor: (row) => (
        <div className="space-y-1">
          <div className="font-semibold text-foreground">
            {formatCurrency(row.price)}
          </div>
          {row.subscription_discount_percent > 0 && (
            <div className="text-sm text-green-600">
              {row.subscription_discount_percent}% off subscription
            </div>
          )}
        </div>
      ),
      sortable: true,
      align: 'right',
      description: 'Monthly price with subscription discount if applicable'
    },
    {
      key: 'availability',
      header: 'Availability',
      accessor: (row) => (
        <div className="space-y-1">
          <div className={`flex items-center space-x-2 ${
            row.is_available ? 'text-green-600' : 'text-red-600'
          }`}>
            {row.is_available ? (
              <CheckCircleIcon className="w-4 h-4" />
            ) : (
              <ExclamationTriangleIcon className="w-4 h-4" />
            )}
            <span className="font-medium">
              {row.is_available ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            {row.stock_quantity} units
          </div>
        </div>
      ),
      sortable: true,
      align: 'center',
      description: 'Stock availability and quantity'
    },
    {
      key: 'actions',
      header: 'Actions',
      accessor: (row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToStack(row.id);
            }}
            disabled={!row.is_available || isInStack(row.id)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
              isInStack(row.id)
                ? 'bg-green-100 text-green-700 cursor-default'
                : row.is_available
                ? 'bg-primary text-white hover:bg-primary/80'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
            aria-label={`${isInStack(row.id) ? 'Already in stack' : 'Add to stack'}: ${row.name}`}
          >
            {isInStack(row.id) ? (
              <>
                <CheckCircleIcon className="w-4 h-4 inline mr-1" />
                In Stack
              </>
            ) : (
              <>
                <ShoppingCartIcon className="w-4 h-4 inline mr-1" />
                Add
              </>
            )}
          </button>
          
          <button
            onClick={(e) => e.stopPropagation()}
            className="p-1 text-muted-foreground hover:text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 rounded"
            aria-label={`Add ${row.name} to favorites`}
          >
            <HeartIcon className="w-4 h-4" />
          </button>
        </div>
      ),
      width: '150px',
      description: 'Actions to add supplement to stack or favorites'
    }
  ];

  const handleRowClick = (supplement: SupplementTableData) => {
    // Open supplement detail modal or navigate to detail page
    console.log('View supplement details:', supplement.name);
  };

  const handleSelectionChange = (selected: Set<string>) => {
    setSelectedSupplements(selected);
  };

  const handleBulkAddToStack = async () => {
    for (const supplementId of selectedSupplements) {
      await addToStack(supplementId);
    }
    setSelectedSupplements(new Set());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Supplement Catalog</h2>
          <p className="text-muted-foreground">
            Browse and manage your supplement options
          </p>
        </div>
        
        {selectedSupplements.size > 0 && (
          <button
            onClick={handleBulkAddToStack}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            Add {selectedSupplements.size} to Stack
          </button>
        )}
      </div>

      <AccessibleTable
        data={supplements}
        columns={columns}
        caption="Supplement catalog showing available products with evidence ratings, pricing, and stock information. Use keyboard navigation to browse and screen reader for detailed information."
        loading={loading}
        emptyMessage="No supplements available. Please check back later or contact support."
        onRowClick={handleRowClick}
        selectable={true}
        selectedRows={selectedSupplements}
        onSelectionChange={handleSelectionChange}
        getRowId={(row) => row.id}
        searchable={true}
        stickyHeader={true}
        maxHeight="600px"
        pageSize={20}
        className="bg-card rounded-xl border border-border shadow-sm"
      />

      {/* Bulk Actions Help */}
      {selectedSupplements.size > 0 && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-3">
            <CheckCircleIcon className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-700 dark:text-blue-300">
                {selectedSupplements.size} supplements selected
              </h4>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                You can add multiple supplements to your stack at once using the bulk action button above.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplementsTable;