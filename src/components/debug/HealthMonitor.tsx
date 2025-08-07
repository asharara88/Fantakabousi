import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useHealthCheck } from '../../lib/healthCheck';
import { 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ClockIcon,
  CpuChipIcon,
  ServerIcon,
  CloudIcon,
  WifiIcon
} from '@heroicons/react/24/outline';

interface HealthMonitorProps {
  isOpen: boolean;
  onClose: () => void;
}

const HealthMonitor: React.FC<HealthMonitorProps> = ({ isOpen, onClose }) => {
  const { health, loading } = useHealthCheck();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'degraded':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'unhealthy':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'degraded':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'unhealthy':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getServiceIcon = (service: string) => {
    switch (service.toLowerCase()) {
      case 'supabase':
        return <ServerIcon className="w-5 h-5" />;
      case 'openai':
        return <CpuChipIcon className="w-5 h-5" />;
      case 'elevenlabs':
        return <WifiIcon className="w-5 h-5" />;
      case 'spoonacular':
        return <CloudIcon className="w-5 h-5" />;
      default:
        return <ServerIcon className="w-5 h-5" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <ServerIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">System Health</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Real-time service monitoring</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
          </div>
        ) : health ? (
          <div className="space-y-6">
            {/* Overall Status */}
            <div className={`p-4 rounded-xl border ${getStatusColor(health.overall)}`}>
              <div className="flex items-center space-x-3">
                {getStatusIcon(health.overall)}
                <div>
                  <h3 className="font-semibold">Overall System Status</h3>
                  <p className="text-sm">
                    {health.overall === 'healthy' && 'All systems operational'}
                    {health.overall === 'degraded' && 'Some services experiencing issues'}
                    {health.overall === 'unhealthy' && 'Critical services down'}
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-sm font-medium">Uptime</div>
                  <div className="text-xs">
                    {Math.floor(health.uptime / (1000 * 60 * 60))}h {Math.floor((health.uptime % (1000 * 60 * 60)) / (1000 * 60))}m
                  </div>
                </div>
              </div>
            </div>

            {/* Service Status */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">Service Status</h3>
              {health.services.map((service, index) => (
                <div
                  key={service.service}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-xl"
                >
                  <div className="flex items-center space-x-3">
                    {getServiceIcon(service.service)}
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {service.service}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {service.details}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {service.responseTime.toFixed(0)}ms
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(service.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    {getStatusIcon(service.status)}
                  </div>
                </div>
              ))}
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl">
                <div className="text-sm text-blue-600 dark:text-blue-400">Avg Response Time</div>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {(health.services.reduce((sum, s) => sum + s.responseTime, 0) / health.services.length).toFixed(0)}ms
                </div>
              </div>
              
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-xl">
                <div className="text-sm text-green-600 dark:text-green-400">Healthy Services</div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {health.services.filter(s => s.status === 'healthy').length}/{health.services.length}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">Failed to load health status</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default HealthMonitor;