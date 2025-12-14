// Cookie Consent Management Utility

export interface CookiePreferences {
  essential: boolean; // Always true, required for site functionality
  analytics: boolean; // Google Analytics, etc.
  marketing: boolean; // Marketing/advertising cookies
  timestamp: number;  // When consent was given
}

const COOKIE_CONSENT_KEY = 'cookie-preferences';

// Default preferences (only essential enabled)
export const defaultPreferences: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
  timestamp: 0,
};

// Get current cookie preferences from localStorage
export const getCookiePreferences = (): CookiePreferences | null => {
  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading cookie preferences:', e);
  }
  return null;
};

// Save cookie preferences to localStorage
export const saveCookiePreferences = (preferences: CookiePreferences): void => {
  try {
    const prefsWithTimestamp = {
      ...preferences,
      essential: true, // Always ensure essential is true
      timestamp: Date.now(),
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefsWithTimestamp));
    
    // Apply preferences immediately
    applyPreferences(prefsWithTimestamp);
  } catch (e) {
    console.error('Error saving cookie preferences:', e);
  }
};

// Accept all cookies
export const acceptAllCookies = (): void => {
  saveCookiePreferences({
    essential: true,
    analytics: true,
    marketing: true,
    timestamp: Date.now(),
  });
};

// Decline optional cookies (only essential)
export const declineOptionalCookies = (): void => {
  saveCookiePreferences({
    essential: true,
    analytics: false,
    marketing: false,
    timestamp: Date.now(),
  });
};

// Check if user has made a consent choice
export const hasConsentChoice = (): boolean => {
  return getCookiePreferences() !== null;
};

// Check if a specific cookie category is allowed
export const isCategoryAllowed = (category: keyof Omit<CookiePreferences, 'timestamp'>): boolean => {
  const prefs = getCookiePreferences();
  if (!prefs) return category === 'essential';
  return prefs[category] ?? false;
};

// Apply preferences - enable/disable tracking based on consent
export const applyPreferences = (preferences: CookiePreferences): void => {
  // Google Analytics consent
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('consent', 'update', {
      analytics_storage: preferences.analytics ? 'granted' : 'denied',
      ad_storage: preferences.marketing ? 'granted' : 'denied',
      ad_user_data: preferences.marketing ? 'granted' : 'denied',
      ad_personalization: preferences.marketing ? 'granted' : 'denied',
    });
  }

  // If analytics is enabled and GA isn't loaded yet, load it
  if (preferences.analytics) {
    loadGoogleAnalytics();
  }
};

// Initialize consent on page load
export const initializeConsent = (): void => {
  const prefs = getCookiePreferences();
  
  // Set default consent state (denied until user consents)
  if (typeof window !== 'undefined') {
    // Initialize gtag with default denied state
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(args);
    }
    (window as any).gtag = gtag;

    gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      wait_for_update: 500,
    });

    // If user has already consented, apply their preferences
    if (prefs) {
      applyPreferences(prefs);
    }
  }
};

// Load Google Analytics script
const loadGoogleAnalytics = (): void => {
  // Replace with your actual GA4 Measurement ID
  const GA_MEASUREMENT_ID = 'G-BY2P2E98NJ';
  
  if (typeof window === 'undefined') return;
  if (document.querySelector(`script[src*="googletagmanager.com/gtag"]`)) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  (window as any).gtag('js', new Date());
  (window as any).gtag('config', GA_MEASUREMENT_ID);
};

// Clear consent (for testing or user request)
export const clearConsent = (): void => {
  localStorage.removeItem(COOKIE_CONSENT_KEY);
  // Also clear the old simple consent key if it exists
  localStorage.removeItem('cookie-consent');
};

