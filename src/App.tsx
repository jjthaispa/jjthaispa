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
import Contact from './components/Contact';
import Promotions from './components/Promotions';
import ServicesPage from './components/ServicesPage';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'privacy' | 'policies' | 'contact' | 'promotions' | 'services'>('home');
  const [showCookieSettings, setShowCookieSettings] = useState(false);

  // Handle URL changes for simple routing
  useEffect(() => {
    const handleRoute = () => {
      const path = window.location.pathname;
      if (path === '/privacy-policy') {
        setCurrentPage('privacy');
      } else if (path === '/policies') {
        setCurrentPage('policies');
      } else if (path === '/contact') {
        setCurrentPage('contact');
      } else if (path === '/promotions') {
        setCurrentPage('promotions');
      } else if (path === '/services') {
        setCurrentPage('services');
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
  const navigateTo = (page: 'home' | 'privacy' | 'policies' | 'contact' | 'promotions' | 'services') => {
    let path = '/';
    if (page === 'privacy') path = '/privacy-policy';
    if (page === 'policies') path = '/policies';
    if (page === 'contact') path = '/contact';
    if (page === 'promotions') path = '/promotions';
    if (page === 'services') path = '/services';

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

  if (currentPage === 'contact') {
    return (
      <div className="relative flex min-h-screen w-full flex-col font-display">
        <Header />
        <main className="flex-grow">
          <Contact />
        </main>
        <Footer />
      </div>
    );
  }

  if (currentPage === 'promotions') {
    return (
      <div className="relative flex min-h-screen w-full flex-col font-display">
        <Header />
        <main className="flex-grow">
          <Promotions />
        </main>
        <Footer />
      </div>
    );
  }

  if (currentPage === 'services') {
    return (
      <div className="relative flex min-h-screen w-full flex-col font-display">
        <Header />
        <main className="flex-grow">
          <ServicesPage />
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
