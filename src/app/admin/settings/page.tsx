"use client";

import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  Save, 
  Globe, 
  Hash, 
  Share2, 
  Shield, 
  Palette,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface SiteSettings {
  // General Settings
  site_title: string;
  site_description: string;
  site_url: string;
  admin_email: string;
  
  // SEO Settings
  default_meta_title: string;
  default_meta_description: string;
  google_analytics_id: string;
  google_search_console: string;
  
  // Social Media
  facebook_url: string;
  twitter_url: string;
  instagram_url: string;
  linkedin_url: string;
  telegram_url: string;
  youtube_url: string;
  
  // Contact Info
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  
  // Legal
  privacy_policy_url: string;
  terms_of_service_url: string;
  responsible_gambling_url: string;
  
  // Appearance
  primary_color: string;
  logo_url: string;
  favicon_url: string;
}

const defaultSettings: SiteSettings = {
  // General Settings
  site_title: 'SportsPulse AU - Australian Sports Analysis',
  site_description: 'Expert sports analysis and predictions for Australian AFL, NRL, Horse Racing, Cricket and more.',
  site_url: 'https://sportspulse-au.com',
  admin_email: 'admin@sportspulse-au.com',
  
  // SEO Settings
  default_meta_title: 'SportsPulse AU - Australian Sports Analysis & Expert Predictions',
  default_meta_description: 'Get expert sports analysis, match predictions, and data-driven insights for AFL, NRL, Horse Racing, and Australian sports. Trusted analysis for sports enthusiasts.',
  google_analytics_id: 'G-XXXXXXXXXX',
  google_search_console: '',
  
  // Social Media
  facebook_url: 'https://facebook.com/sportspulseau',
  twitter_url: 'https://twitter.com/sportspulseau',
  instagram_url: 'https://instagram.com/sportspulseau',
  linkedin_url: 'https://linkedin.com/company/sportspulseau',
  telegram_url: 'https://t.me/sportspulseau',
  youtube_url: 'https://youtube.com/@sportspulseau',
  
  // Contact Info
  contact_email: 'contact@sportspulse-au.com',
  contact_phone: '+61 2 1234 5678',
  contact_address: 'Sydney, NSW, Australia',
  
  // Legal
  privacy_policy_url: '/privacy',
  terms_of_service_url: '/terms',
  responsible_gambling_url: '',
  
  // Appearance
  primary_color: '#1a237e',
  logo_url: '/logo.png',
  favicon_url: '/favicon.ico'
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const handleSave = async () => {
    setSaving(true);
    try {
      // In real app, this would call API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof SiteSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Globe },
    { id: 'seo', name: 'SEO', icon: Hash },
    { id: 'social', name: 'Social Media', icon: Share2 },
    { id: 'contact', name: 'Contact', icon: Mail },
    { id: 'legal', name: 'Legal', icon: Shield },
    { id: 'appearance', name: 'Appearance', icon: Palette }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Configure your website settings and preferences.</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-lg hover:bg-navy/90 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        {/* Success Message */}
        {saved && (
          <div className="bg-emerald/10 border border-emerald/20 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald" />
            <span className="text-emerald font-medium">Settings saved successfully!</span>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-navy text-navy'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Title *
                    </label>
                    <input
                      type="text"
                      value={settings.site_title}
                      onChange={(e) => handleInputChange('site_title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                      placeholder="Your site title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site URL *
                    </label>
                    <input
                      type="url"
                      value={settings.site_url}
                      onChange={(e) => handleInputChange('site_url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                      placeholder="https://yourdomain.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Description
                  </label>
                  <textarea
                    value={settings.site_description}
                    onChange={(e) => handleInputChange('site_description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                    placeholder="Brief description of your website"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Email *
                  </label>
                  <input
                    type="email"
                    value={settings.admin_email}
                    onChange={(e) => handleInputChange('admin_email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                    placeholder="admin@yourdomain.com"
                  />
                </div>
              </div>
            )}

            {/* SEO Settings */}
            {activeTab === 'seo' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Meta Title
                  </label>
                  <input
                    type="text"
                    value={settings.default_meta_title}
                    onChange={(e) => handleInputChange('default_meta_title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                    placeholder="Default page title for SEO"
                    maxLength={60}
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    {settings.default_meta_title.length}/60 characters
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Meta Description
                  </label>
                  <textarea
                    value={settings.default_meta_description}
                    onChange={(e) => handleInputChange('default_meta_description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                    placeholder="Default meta description for SEO"
                    maxLength={160}
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    {settings.default_meta_description.length}/160 characters
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Google Analytics ID
                    </label>
                    <input
                      type="text"
                      value={settings.google_analytics_id}
                      onChange={(e) => handleInputChange('google_analytics_id', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                      placeholder="G-XXXXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Google Search Console
                    </label>
                    <input
                      type="text"
                      value={settings.google_search_console}
                      onChange={(e) => handleInputChange('google_search_console', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                      placeholder="Search console verification code"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Social Media Settings */}
            {activeTab === 'social' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facebook URL
                    </label>
                    <input
                      type="url"
                      value={settings.facebook_url}
                      onChange={(e) => handleInputChange('facebook_url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter URL
                    </label>
                    <input
                      type="url"
                      value={settings.twitter_url}
                      onChange={(e) => handleInputChange('twitter_url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                      placeholder="https://twitter.com/yourhandle"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      value={settings.instagram_url}
                      onChange={(e) => handleInputChange('instagram_url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                      placeholder="https://instagram.com/yourprofile"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={settings.linkedin_url}
                      onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                      placeholder="https://linkedin.com/company/yourcompany"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telegram Channel
                    </label>
                    <input
                      type="url"
                      value={settings.telegram_url}
                      onChange={(e) => handleInputChange('telegram_url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                      placeholder="https://t.me/yourchannel"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      YouTube Channel
                    </label>
                    <input
                      type="url"
                      value={settings.youtube_url}
                      onChange={(e) => handleInputChange('youtube_url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                      placeholder="https://youtube.com/@yourchannel"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Contact Settings */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={settings.contact_email}
                      onChange={(e) => handleInputChange('contact_email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                      placeholder="contact@yourdomain.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={settings.contact_phone}
                      onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                      placeholder="+61 2 1234 5678"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Address
                  </label>
                  <textarea
                    value={settings.contact_address}
                    onChange={(e) => handleInputChange('contact_address', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                    placeholder="Your business address"
                  />
                </div>
              </div>
            )}

            {/* Legal Settings */}
            {activeTab === 'legal' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Privacy Policy URL
                    </label>
                    <input
                      type="url"
                      value={settings.privacy_policy_url}
                      onChange={(e) => handleInputChange('privacy_policy_url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                      placeholder="/privacy-policy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Terms of Service URL
                    </label>
                    <input
                      type="url"
                      value={settings.terms_of_service_url}
                      onChange={(e) => handleInputChange('terms_of_service_url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                      placeholder="/terms-of-service"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Responsible Gambling URL
                  </label>
                  <input
                    type="url"
                    value={settings.responsible_gambling_url}
                    onChange={(e) => handleInputChange('responsible_gambling_url', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                    placeholder="https://www.gamblinghelponline.org.au"
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    Link to responsible gambling resources
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={settings.primary_color}
                        onChange={(e) => handleInputChange('primary_color', e.target.value)}
                        className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.primary_color}
                        onChange={(e) => handleInputChange('primary_color', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                        placeholder="#1a237e"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo URL
                    </label>
                    <input
                      type="url"
                      value={settings.logo_url}
                      onChange={(e) => handleInputChange('logo_url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                      placeholder="/logo.png"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Favicon URL
                  </label>
                  <input
                    type="url"
                    value={settings.favicon_url}
                    onChange={(e) => handleInputChange('favicon_url', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors"
                    placeholder="/favicon.ico"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 