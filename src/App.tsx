import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import ReviewsSection from './components/ReviewsSection';
import Gallery from './components/Gallery';
import CTA from './components/CTA';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import PromoCarousel from './components/PromoCarousel';

function App() {
  return (
    <div className="relative flex min-h-screen w-full flex-col font-display">
      <Header />
      <main className="flex-grow">
        <Hero />
        <PromoCarousel />
        <Services />
        <ReviewsSection />
        <Gallery />
        <CTA />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}

export default App;