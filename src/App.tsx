import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
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
import Promo from './components/Promo';
import ServicesPage from './components/ServicesPage';
import PriceList from './components/PriceList';
import AdminPage from './components/AdminPage';
import AdminRestricted from './components/AdminRestricted';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'privacy' | 'policies' | 'contact' | 'promotions' | 'services' | 'pricelist' | 'promo' | 'admin'>('home');
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
      } else if (path === '/promo') {
        setCurrentPage('promo');
      } else if (path === '/admin') {
        setCurrentPage('admin');
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
    return (
      <AuthProvider>
        <AdminRestricted>
          <PriceList />
        </AdminRestricted>
      </AuthProvider>
    );
  }

  if (currentPage === 'promo') {
    return (
      <AuthProvider>
        <AdminRestricted>
          <Promo />
        </AdminRestricted>
      </AuthProvider>
    );
  }

  if (currentPage === 'admin') {
    return (
      <AuthProvider>
        <AdminRestricted>
          <AdminPage />
        </AdminRestricted>
      </AuthProvider>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col font-display">
      <Header />
      <main className="flex-grow">
        <Helmet>
          <title>J.J Thai Spa - Experience the Art of Thai Massage</title>
          <meta name="description" content="Experience the art of Thai massage, deep tissue therapy, and relaxation treatments at J.J Thai Spa. Restore your body and mind." />
          <link rel="canonical" href="https://jjthaispa.com/" />

          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://jjthaispa.com/" />
          <meta property="og:title" content="J.J Thai Spa - Experience the Art of Thai Massage" />
          <meta property="og:description" content="Experience the art of Thai massage, deep tissue therapy, and relaxation treatments at J.J Thai Spa. Restore your body and mind." />
          <meta property="og:image" content="https://jjthaispa.com/buddha.webp" />

          {/* Twitter */}
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://jjthaispa.com/" />
          <meta property="twitter:title" content="J.J Thai Spa - Experience the Art of Thai Massage" />
          <meta property="twitter:description" content="Experience the art of Thai massage, deep tissue therapy, and relaxation treatments at J.J Thai Spa. Restore your body and mind." />
          <meta property="twitter:image" content="https://jjthaispa.com/buddha.webp" />

          {/* Structured Data (JSON-LD) */}
          <script type="application/ld+json">
            {`
            {
              "@context": "https://schema.org",
              "@type": "DaySpa",
              "name": "J.J Thai Spa",
              "image": "https://jjthaispa.com/buddha.webp",
              "@id": "https://jjthaispa.com",
              "url": "https://jjthaispa.com",
              "telephone": "+15088070141",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "180 Winter St. Unit D",
                "addressLocality": "Bridgewater",
                "addressRegion": "MA",
                "postalCode": "02324",
                "addressCountry": "US"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 41.965, 
                "longitude": -70.995 
              },
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  "opens": "10:00",
                  "closes": "20:00"
                },
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Saturday", "Sunday"],
                  "opens": "10:00",
                  "closes": "18:00"
                }
              ],
              "priceRange": "$$"
            }
          `}
          </script>
        </Helmet>
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
