import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import Overview from '../components/dashboard/Overview';
import HealthMetrics from '../components/dashboard/HealthMetrics';
import AICoachEnhanced from '../components/dashboard/AICoachEnhanced';
import NutritionDashboard from '../components/nutrition/NutritionDashboard';
import SupplementShopEnhanced from '../components/supplements/SupplementShopEnhanced';
import Profile from '../components/dashboard/Profile';

const DashboardPage: React.FC = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/health" element={<HealthMetrics />} />
        <Route path="/coach" element={<AICoachEnhanced />} />
        <Route path="/nutrition" element={<NutritionDashboard />} />
        <Route path="/supplements" element={<SupplementShopEnhanced />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </DashboardLayout>
  );
};

export default DashboardPage;