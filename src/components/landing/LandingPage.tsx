import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import Navigation from '../layout/Navigation';
import Hero from '../home/Hero';
import Features from '../home/Features';
import HowItWorks from '../home/HowItWorks';
import Pricing from '../home/Pricing';
import Testimonials from '../home/Testimonials';
import Footer from '../layout/Footer';

interface LandingPageProps {
  onShowAuth: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onShowAuth }) => {
  const { actualTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <Navigation />
      
      <main>
        <Hero onGetStarted={onShowAuth} />
        <Features />
        <HowItWorks />
        <Pricing onGetStarted={onShowAuth} />
        <Testimonials />
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;