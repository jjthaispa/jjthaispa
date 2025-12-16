import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import ReviewsSection from './components/ReviewsSection';
import Gallery from './components/Gallery';
import CTA from './components/CTA';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import PromoCarousel from './components/PromoCarousel';
import PrivacyPolicy from './components/PrivacyPolicy';
import Policies from './components/Policies';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'privacy' | 'policies'>('home');
  const [showCookieSettings, setShowCookieSettings] = useState(false);

  // Handle URL changes for simple routing
  useEffect(() => {
    const handleRoute = () => {
      const path = window.location.pathname;
      if (path === '/privacy-policy') {
        setCurrentPage('privacy');
      } else if (path === '/policies') {
        setCurrentPage('policies');
      } else {
        setCurrentPage('home');
      }
    };

    handleRoute();
    window.addEventListener('popstate', handleRoute);
    return () => window.removeEventListener('popstate', handleRoute);
  }, []);

  // Expose function to open cookie settings globally
  useEffect(() => {
    (window as any).openCookieSettings = () => setShowCookieSettings(true);
    return () => {
      delete (window as any).openCookieSettings;
    };
  }, []);

  // Handle navigation
  const navigateTo = (page: 'home' | 'privacy' | 'policies') => {
    let path = '/';
    if (page === 'privacy') path = '/privacy-policy';
    if (page === 'policies') path = '/policies';

    window.history.pushState({}, '', path);
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Expose navigation function
  useEffect(() => {
    (window as any).navigateTo = navigateTo;
  }, []);

  if (currentPage === 'privacy') {
    return (
      <div className="relative flex min-h-screen w-full flex-col font-display">
        <Header />
        <main className="flex-grow">
          <PrivacyPolicy />
        </main>
        <Footer />
      </div>
    );
  }

  if (currentPage === 'policies') {
    return (
      <div className="relative flex min-h-screen w-full flex-col font-display">
        <Header />
        <main className="flex-grow">
          <Policies />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col font-display">
      <Header />
      <main className="flex-grow">
        <Hero />
        <PromoCarousel />
        <Services />
        <Gallery />
        <ReviewsSection />
        <CTA />
      </main>
      <Footer />
      <CookieBanner />
      {showCookieSettings && (
        <CookieBanner
          forceOpen={true}
          onClose={() => setShowCookieSettings(false)}
        />
      )}
    </div>
  );
}

export default App;
