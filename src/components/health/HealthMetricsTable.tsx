import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useHealthMetrics } from '../../hooks/useHealthMetrics';
import AccessibleTable, { TableColumn } from '../ui/AccessibleTable';
import { Badge } from '../ui/Badge';
import { formatDate, formatTime } from '../../lib/utils';
import { 
  HeartIcon,
  BoltIcon,
  MoonIcon,
  BeakerIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

interface HealthMetric {
  id: string;
  metric_type: string;
  value: number;
  unit: string;
  timestamp: string;
  source: string;
  metadata?: Record<string, any>;
}

const HealthMetricsTable: React.FC = () => {
  const { user } = useAuth();
  const { metrics, loading } = useHealthMetrics();
  const [sortedMetrics, setSortedMetrics] = useState<HealthMetric[]>([]);

  useEffect(() => {
    setSortedMetrics(metrics);
  }, [metrics]);

  const getMetricIcon = (type: string) => {
    switch (type) {
      case 'heart_rate': return <HeartIcon className="w-4 h-4 text-red-500" />;
      case 'steps': return <BoltIcon className="w-4 h-4 text-blue-500" />;
      case 'sleep': return <MoonIcon className="w-4 h-4 text-indigo-500" />;
      case 'glucose': return <BeakerIcon className="w-4 h-4 text-green-500" />;
      default: return <DevicePhoneMobileIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSourceBadge = (source: string) => {
    const variants = {
      wearable: 'info',
      cgm: 'success',
      manual: 'secondary',
      calculated: 'outline'
    } as const;

    return (
      <Badge variant={variants[source as keyof typeof variants] || 'outline'}>
        {source.charAt(0).toUpperCase() + source.slice(1)}
      </Badge>
    );
  };

  const columns: TableColumn<HealthMetric>[] = [
    {
      key: 'metric_type',
      header: 'Metric',
      accessor: (row) => (
        <div className="flex items-center space-x-3">
          {getMetricIcon(row.metric_type)}
          <span className="font-medium capitalize">
            {row.metric_type.replace('_', ' ')}
          </span>
        </div>
      ),
      sortable: true,
      filterable: true,
      description: 'Type of health metric being measured'
    },
    {
      key: 'value',
      header: 'Value',
      accessor: (row) => (
        <div className="font-mono font-semibold">
          {row.value.toLocaleString()} {row.unit}
        </div>
      ),
      sortable: true,
      align: 'right',
      description: 'Measured value with unit'
    },
    {
      key: 'source',
      header: 'Source',
      accessor: (row) => getSourceBadge(row.source),
      sortable: true,
      filterable: true,
      description: 'Data source: wearable device, manual entry, or calculated'
    },
    {
      key: 'timestamp',
      header: 'Date & Time',
      accessor: (row) => (
        <div className="space-y-1">
          <div className="font-medium">{formatDate(row.timestamp)}</div>
          <div className="text-sm text-muted-foreground">{formatTime(row.timestamp)}</div>
        </div>
      ),
      sortable: true,
      description: 'When the measurement was recorded'
    },
    {
      key: 'device',
      header: 'Device',
      accessor: (row) => (
        <div className="text-sm">
          {row.metadata?.device || 'Unknown'}
        </div>
      ),
      filterable: true,
      description: 'Device used to record the measurement'
    }
  ];

  const handleSort = (column: string, direction: 'asc' | 'desc') => {
    const sorted = [...sortedMetrics].sort((a, b) => {
      let aValue: any = a[column as keyof HealthMetric];
      let bValue: any = b[column as keyof HealthMetric];

      // Handle special cases
      if (column === 'timestamp') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (column === 'metric_type') {
        aValue = aValue.replace('_', ' ');
        bValue = bValue.replace('_', ' ');
      }

      if (typeof aValue === 'string') {
        return direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    });

    setSortedMetrics(sorted);
  };

  const handleFilter = (column: string, value: string) => {
    if (!value) {
      setSortedMetrics(metrics);
      return;
    }

    const filtered = metrics.filter(metric => {
      switch (column) {
        case 'metric_type':
          return metric.metric_type.toLowerCase().includes(value.toLowerCase());
        case 'source':
          return metric.source.toLowerCase().includes(value.toLowerCase());
        case 'device':
          return metric.metadata?.device?.toLowerCase().includes(value.toLowerCase());
        default:
          return true;
      }
    });

    setSortedMetrics(filtered);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Health Metrics</h2>
          <p className="text-muted-foreground">
            Comprehensive view of your biometric data
          </p>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {metrics.length} total measurements
        </div>
      </div>

      <AccessibleTable
        data={sortedMetrics}
        columns={columns}
        caption="Health metrics data showing biometric measurements over time with source information and timestamps"
        loading={loading}
        emptyMessage="No health metrics found. Connect a device or manually log data to get started."
        onSort={handleSort}
        onFilter={handleFilter}
        searchable={true}
        stickyHeader={true}
        maxHeight="500px"
        pageSize={25}
        className="bg-card rounded-xl border border-border shadow-sm"
      />
    </div>
  );
};

export default HealthMetricsTable;