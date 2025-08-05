import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import Overview from '../components/dashboard/Overview';
import HealthMetrics from '../components/dashboard/HealthMetrics';
import AICoach from '../components/dashboard/AICoach';
import Nutrition from '../components/dashboard/Nutrition';
import Supplements from '../components/dashboard/Supplements';
import Profile from '../components/dashboard/Profile';

const DashboardPage: React.FC = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/health" element={<HealthMetrics />} />
        <Route path="/coach" element={<AICoach />} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="/supplements" element={<Supplements />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </DashboardLayout>
  );
};

export default DashboardPage;