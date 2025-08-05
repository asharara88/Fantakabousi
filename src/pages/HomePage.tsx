import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Heart, 
  Activity, 
  Zap, 
  Shield, 
  Sparkles,
  ArrowRight,
  Play,
  CheckCircle,
  Star,
  Users,
  TrendingUp
} from 'lucide-react';
import Navigation from '../components/layout/Navigation';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import HowItWorks from '../components/home/HowItWorks';
import Testimonials from '../components/home/Testimonials';
import Pricing from '../components/home/Pricing';
import Footer from '../components/layout/Footer';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <Navigation />
      
      <main>
        <Hero onGetStarted={() => navigate('/auth')} />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing onGetStarted={() => navigate('/auth')} />
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;