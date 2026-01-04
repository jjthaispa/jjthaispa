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
import ReleasePromo from './components/ReleasePromo';
import ServicesPage from './components/ServicesPage';
import PriceList from './components/PriceList';
import HolidayPromo from './components/HolidayPromo';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'privacy' | 'policies' | 'contact' | 'promotions' | 'services' | 'pricelist' | 'holiday_promo' | 'release_promo'>('home');
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
      } else if (path === '/pricelist') {
        setCurrentPage('pricelist');
      } else if (path === '/holiday-promo') {
        setCurrentPage('holiday_promo');
      } else if (path === '/release-promo') {
        setCurrentPage('release_promo');
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

  if (currentPage === 'pricelist') {
    return <PriceList />;
  }

  if (currentPage === 'holiday_promo') {
    return <HolidayPromo />;
  }

  if (currentPage === 'release_promo') {
    return <ReleasePromo />;
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
