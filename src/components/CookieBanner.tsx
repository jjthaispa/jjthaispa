import React, { useState, useEffect } from 'react';

const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('cookie-consent');
    
    if (!consent) {
      setShouldRender(true);
      // Small delay for smooth entrance animation
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
    setTimeout(() => setShouldRender(false), 500); // Remove from DOM after animation
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
    setTimeout(() => setShouldRender(false), 500);
  };

  if (!shouldRender) return null;

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-[60] p-4 md:p-6 pointer-events-none transition-all duration-500 ease-out transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      <div className="pointer-events-auto max-w-5xl mx-auto bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-xl p-6 md:flex md:items-center md:justify-between md:gap-8">
        <div className="flex-1 mb-4 md:mb-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-accent">cookie</span>
            <h3 className="font-serif text-lg font-bold text-text-light dark:text-text-dark">
              We value your privacy
            </h3>
          </div>
          <p className="text-sm text-text-light/80 dark:text-text-dark/80 leading-relaxed">
            We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
            <a href="#" className="text-primary hover:underline ml-1 transition-colors">Read Policy</a>.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          <button
            onClick={handleDecline}
            className="flex-1 sm:flex-none px-5 py-2.5 text-sm font-bold text-text-light dark:text-text-dark border border-border-light dark:border-border-dark rounded-full hover:bg-background-light dark:hover:bg-background-dark transition-colors whitespace-nowrap"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-full shadow-sm transition-colors whitespace-nowrap"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;