import React, { useState, useEffect } from 'react';
import {
  CookiePreferences,
  getCookiePreferences,
  saveCookiePreferences,
  acceptAllCookies,
  declineOptionalCookies,
  hasConsentChoice,
  initializeConsent,
} from '../utils/cookieConsent';

interface CookieBannerProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

const CookieBanner: React.FC<CookieBannerProps> = ({ forceOpen = false, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
    timestamp: 0,
  });

  useEffect(() => {
    // Initialize consent system
    initializeConsent();

    // Check if user has already consented
    const existingPrefs = getCookiePreferences();
    
    if (forceOpen) {
      // Force open for settings page
      setShouldRender(true);
      setShowPreferences(true);
      if (existingPrefs) {
        setPreferences(existingPrefs);
      }
      setTimeout(() => setIsVisible(true), 100);
    } else if (!hasConsentChoice()) {
      setShouldRender(true);
      // Small delay for smooth entrance animation
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [forceOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setShouldRender(false);
      onClose?.();
    }, 500);
  };

  const handleAcceptAll = () => {
    acceptAllCookies();
    handleClose();
  };

  const handleDecline = () => {
    declineOptionalCookies();
    handleClose();
  };

  const handleSavePreferences = () => {
    saveCookiePreferences(preferences);
    handleClose();
  };

  const togglePreference = (key: 'analytics' | 'marketing') => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!shouldRender) return null;

  return (
    <div 
      className={`fixed inset-0 z-[60] transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/40 transition-opacity duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={forceOpen ? handleClose : undefined}
      />
      
      {/* Banner */}
      <div 
        className={`fixed bottom-0 left-0 right-0 p-4 md:p-6 transition-all duration-500 ease-out transform ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="max-w-3xl mx-auto bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-[0_8px_30px_rgb(0,0,0,0.2)] rounded-xl overflow-hidden">
          {/* Header */}
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-accent text-2xl">cookie</span>
                <h3 className="font-serif text-xl font-bold text-text-light dark:text-text-dark">
                  Cookie Preferences
                </h3>
              </div>
              {forceOpen && (
                <button
                  onClick={handleClose}
                  className="text-text-light/60 hover:text-text-light dark:text-text-dark/60 dark:hover:text-text-dark transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              )}
            </div>
            <p className="text-sm text-text-light/80 dark:text-text-dark/80 leading-relaxed">
              We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
              You can choose which cookies you'd like to allow.
            </p>
          </div>

          {/* Cookie Categories */}
          {showPreferences && (
            <div className="px-6 pb-4 space-y-3">
              {/* Essential Cookies */}
              <div className="flex items-start justify-between gap-4 p-4 bg-background-light dark:bg-background-dark rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-primary text-lg">lock</span>
                    <h4 className="font-semibold text-text-light dark:text-text-dark text-sm">Essential Cookies</h4>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Required</span>
                  </div>
                  <p className="text-xs text-text-light/70 dark:text-text-dark/70 leading-relaxed">
                    These cookies are necessary for the website to function and cannot be disabled. They include session management and security features.
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-6 bg-primary rounded-full flex items-center justify-end px-1 cursor-not-allowed opacity-60">
                    <div className="w-4 h-4 bg-white rounded-full shadow" />
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start justify-between gap-4 p-4 bg-background-light dark:bg-background-dark rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-primary text-lg">analytics</span>
                    <h4 className="font-semibold text-text-light dark:text-text-dark text-sm">Analytics Cookies</h4>
                  </div>
                  <p className="text-xs text-text-light/70 dark:text-text-dark/70 leading-relaxed">
                    Help us understand how visitors interact with our website by collecting anonymous usage data. This helps us improve our services.
                  </p>
                </div>
                <button
                  onClick={() => togglePreference('analytics')}
                  className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                    preferences.analytics ? 'bg-primary justify-end' : 'bg-border-light dark:bg-border-dark justify-start'
                  }`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow transition-transform" />
                </button>
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-start justify-between gap-4 p-4 bg-background-light dark:bg-background-dark rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-primary text-lg">campaign</span>
                    <h4 className="font-semibold text-text-light dark:text-text-dark text-sm">Marketing Cookies</h4>
                  </div>
                  <p className="text-xs text-text-light/70 dark:text-text-dark/70 leading-relaxed">
                    Used to track visitors across websites to display relevant advertisements. These cookies help us measure the effectiveness of our marketing campaigns.
                  </p>
                </div>
                <button
                  onClick={() => togglePreference('marketing')}
                  className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                    preferences.marketing ? 'bg-primary justify-end' : 'bg-border-light dark:bg-border-dark justify-start'
                  }`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow transition-transform" />
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="p-6 pt-2 border-t border-border-light dark:border-border-dark bg-background-light/50 dark:bg-background-dark/50">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {!showPreferences ? (
                <>
                  <button
                    onClick={() => setShowPreferences(true)}
                    className="order-3 sm:order-1 text-sm font-medium text-primary hover:underline transition-colors"
                  >
                    Customize Preferences
                  </button>
                  <div className="flex-1 hidden sm:block" />
                  <button
                    onClick={handleDecline}
                    className="order-2 px-5 py-2.5 text-sm font-bold text-text-light dark:text-text-dark border border-border-light dark:border-border-dark rounded-full hover:bg-background-light dark:hover:bg-background-dark transition-colors"
                  >
                    Decline Optional
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="order-1 sm:order-3 px-6 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-full shadow-sm transition-colors"
                  >
                    Accept All
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowPreferences(false)}
                    className="order-3 sm:order-1 text-sm font-medium text-text-light/60 dark:text-text-dark/60 hover:text-text-light dark:hover:text-text-dark transition-colors"
                  >
                    ← Back
                  </button>
                  <div className="flex-1 hidden sm:block" />
                  <a
                    href="/privacy-policy"
                    className="order-2 text-sm font-medium text-primary hover:underline transition-colors text-center"
                  >
                    Privacy Policy
                  </a>
                  <button
                    onClick={handleSavePreferences}
                    className="order-1 sm:order-3 px-6 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-full shadow-sm transition-colors"
                  >
                    Save Preferences
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
