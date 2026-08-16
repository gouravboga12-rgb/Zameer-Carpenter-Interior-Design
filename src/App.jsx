import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './components/layout/SplashScreen';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import FloatingActions from './components/layout/FloatingActions';
import MobileActionBar from './components/layout/MobileActionBar';
import ScrollToTop from './components/layout/ScrollToTop';

// Independent Multi-Page Routes
import HomePage from './pages/HomePage';
import AboutUsPage from './pages/AboutUsPage';
import ServicesPage from './pages/ServicesPage';
import RecentProjectsPage from './pages/RecentProjectsPage';
import ContactPage from './pages/ContactPage';

export default function App() {
  const [splashFinished, setSplashFinished] = useState(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-luxury-bg text-luxury-charcoal selection:bg-luxury-gold selection:text-luxury-walnut relative flex flex-col justify-between">
        
        {/* Route Change Scroll Reset */}
        <ScrollToTop />

        {/* Luxury Animated Splash Screen Intro on initial load */}
        <SplashScreen onComplete={() => setSplashFinished(true)} />

        {/* Multi-Page Sticky Luxury Navigation Header */}
        <Header />

        {/* Main Content Area */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/projects" element={<RecentProjectsPage />} />
            <Route path="/recent-projects" element={<RecentProjectsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            {/* Fallback to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Multi-Page Luxury Footer */}
        <Footer />

        {/* Floating Quick Action Triggers (WhatsApp + Call) */}
        <FloatingActions />

      </div>
    </BrowserRouter>
  );
}
