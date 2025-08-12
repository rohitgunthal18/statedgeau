'use client';

import { useState, useEffect } from 'react';
import { X, Settings, Check, Info, Shield, Eye, BarChart3 } from 'lucide-react';
import { updateConsent } from '@/lib/analytics';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

const defaultPreferences: CookiePreferences = {
  necessary: true, // Always required
  analytics: false,
  marketing: false,
  functional: false
};

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
  const [hasConsented, setHasConsented] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('cookie-consent');
    const savedPreferences = localStorage.getItem('cookie-preferences');
    
    if (consent) {
      setHasConsented(true);
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
    } else {
      // Show banner after a brief delay for better UX
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-preferences', JSON.stringify(prefs));
    localStorage.setItem('cookie-consent', new Date().toISOString());
    
    // Set individual cookie flags for other scripts to check
    document.cookie = `analytics-consent=${prefs.analytics}; path=/; max-age=31536000; SameSite=Lax`;
    document.cookie = `marketing-consent=${prefs.marketing}; path=/; max-age=31536000; SameSite=Lax`;
    document.cookie = `functional-consent=${prefs.functional}; path=/; max-age=31536000; SameSite=Lax`;
    
    // Update Google Analytics consent using our analytics library
    updateConsent({
      analytics: prefs.analytics,
      marketing: prefs.marketing,
      functional: prefs.functional,
    });
    
    setPreferences(prefs);
    setHasConsented(true);
    setShowBanner(false);
    setShowPreferences(false);
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    savePreferences(allAccepted);
  };

  const handleAcceptNecessary = () => {
    savePreferences(defaultPreferences);
  };

  const handleSavePreferences = () => {
    savePreferences(preferences);
  };

  const handlePreferenceChange = (type: keyof CookiePreferences, value: boolean) => {
    if (type === 'necessary') return; // Necessary cookies can't be disabled
    setPreferences(prev => ({ ...prev, [type]: value }));
  };

  const reopenPreferences = () => {
    setShowPreferences(true);
  };

  // Don't render if user has already consented and we're not showing preferences
  if (!showBanner && !showPreferences && hasConsented) {
    return (
      <button
        onClick={reopenPreferences}
        className="fixed bottom-4 left-4 z-50 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        title="Cookie Settings"
      >
        <Settings className="w-5 h-5 text-gray-600" />
      </button>
    );
  }

  return (
    <>
      {/* Cookie Consent Banner */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 bg-navy/10 rounded-lg flex-shrink-0">
                  <Shield className="w-5 h-5 text-navy" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">We Value Your Privacy</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    We use cookies to enhance your browsing experience, provide personalized sports analysis, 
                    and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. 
                    You can customize your preferences or learn more in our{' '}
                    <a href="/privacy" className="text-navy underline hover:text-navy/80">
                      Privacy Policy
                    </a>.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <button
                  onClick={() => setShowPreferences(true)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Customize
                </button>
                <button
                  onClick={handleAcceptNecessary}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Necessary Only
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-navy to-emerald rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Cookie Preferences</h2>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-900 mb-1">About Cookies</h3>
                      <p className="text-sm text-blue-800">
                        We use cookies to improve your experience on SportsPulse AU. You can choose which 
                        types of cookies you're comfortable with below.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Necessary Cookies */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-gray-600" />
                      <h3 className="font-semibold text-gray-900">Necessary Cookies</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Always Active</span>
                      <div className="w-10 h-6 bg-emerald rounded-full flex items-center px-1">
                        <div className="w-4 h-4 bg-white rounded-full shadow transform translate-x-4"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    These cookies are essential for the website to function properly. They enable basic 
                    features like page navigation, access to secure areas, and remembering your preferences.
                  </p>
                </div>

                {/* Analytics Cookies */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-5 h-5 text-gray-600" />
                      <h3 className="font-semibold text-gray-900">Analytics Cookies</h3>
                    </div>
                    <button
                      onClick={() => handlePreferenceChange('analytics', !preferences.analytics)}
                      className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${
                        preferences.analytics ? 'bg-emerald' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                        preferences.analytics ? 'translate-x-4' : 'translate-x-0'
                      }`}></div>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    These cookies help us understand how visitors interact with our website by collecting 
                    anonymous information about page views, user behavior, and site performance.
                  </p>
                </div>

                {/* Marketing Cookies */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Eye className="w-5 h-5 text-gray-600" />
                      <h3 className="font-semibold text-gray-900">Marketing Cookies</h3>
                    </div>
                    <button
                      onClick={() => handlePreferenceChange('marketing', !preferences.marketing)}
                      className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${
                        preferences.marketing ? 'bg-emerald' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                        preferences.marketing ? 'translate-x-4' : 'translate-x-0'
                      }`}></div>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    These cookies are used to show you relevant advertisements and measure the effectiveness 
                    of our marketing campaigns. They may be set by us or third-party advertising partners.
                  </p>
                </div>

                {/* Functional Cookies */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Settings className="w-5 h-5 text-gray-600" />
                      <h3 className="font-semibold text-gray-900">Functional Cookies</h3>
                    </div>
                    <button
                      onClick={() => handlePreferenceChange('functional', !preferences.functional)}
                      className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${
                        preferences.functional ? 'bg-emerald' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                        preferences.functional ? 'translate-x-4' : 'translate-x-0'
                      }`}></div>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    These cookies enable enhanced functionality and personalization, such as remembering 
                    your favorite teams, preferred language, or customized content recommendations.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowPreferences(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-navy to-emerald rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 