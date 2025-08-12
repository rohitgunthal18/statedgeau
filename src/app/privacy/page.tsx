'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import Head from 'next/head';

export default function PrivacyPage() {
  const lastUpdated = new Date().toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Privacy Policy | SportsPulse AU</title>
        <meta name="description" content="Learn how SportsPulse AU collects, uses, and protects your personal information. Our privacy policy explains our data practices and your rights." />
        <meta name="robots" content="index, follow" />
      </Head>
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Last updated:</strong> {lastUpdated}
            </p>
            <p className="text-sm text-blue-800 mt-2">
              This policy is compliant with the Australian Privacy Act 1988, GDPR, and other applicable privacy laws.
            </p>
          </div>

          <div className="prose prose-gray max-w-none space-y-8">
            
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                SportsPulse AU ("we", "our", or "us") is committed to protecting your privacy and ensuring 
                the security of your personal information. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you visit our website 
                sportspulse-au.vercel.app and use our services.
              </p>
              <p className="text-gray-700 leading-relaxed">
                By using our website, you consent to the data practices described in this policy. 
                If you do not agree with our policies and practices, please do not use our services.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Personal Information</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may collect personal information that you voluntarily provide, including:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Contact information (email address, name) when you subscribe or contact us</li>
                <li>Comments and feedback you provide</li>
                <li>Social media profile information when you interact with our social features</li>
                <li>Survey responses and user preferences</li>
          </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Automatically Collected Information</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                When you visit our website, we automatically collect certain information:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>IP address and general location information</li>
                <li>Browser type, version, and settings</li>
                <li>Device information (operating system, screen resolution)</li>
                <li>Pages visited, time spent, and navigation patterns</li>
                <li>Referring website and search terms used</li>
                <li>Date and time of visits</li>
          </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.3 Cookies and Tracking Technologies</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use cookies and similar tracking technologies to enhance your experience:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li><strong>Necessary Cookies:</strong> Essential for website functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand user behavior and improve our services</li>
                <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                You can manage your cookie preferences through our cookie consent banner or browser settings.
              </p>
            </section>

            {/* How We Use Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use collected information for the following purposes:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Provide, maintain, and improve our sports analysis content and services</li>
                <li>Personalize your experience and content recommendations</li>
                <li>Communicate with you about updates, news, and promotional content</li>
                <li>Analyze website usage and optimize performance</li>
                <li>Detect, prevent, and address technical issues and security threats</li>
                <li>Comply with legal obligations and enforce our terms of service</li>
                <li>Conduct research and analytics to improve our content quality</li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to third parties. 
                We may share your information in the following circumstances:
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Service Providers</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We work with trusted third-party service providers who assist us in operating our website:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li><strong>Supabase:</strong> Database and backend services</li>
                <li><strong>Vercel:</strong> Website hosting and deployment</li>
                <li><strong>Google Analytics:</strong> Website analytics and performance monitoring</li>
                <li><strong>Social Media Platforms:</strong> When you share our content</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 Legal Requirements</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may disclose your information when required by law or to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
                <li>Comply with legal processes or government requests</li>
                <li>Protect our rights, property, or safety</li>
                <li>Investigate potential violations of our terms of service</li>
                <li>Protect against fraud or security threats</li>
              </ul>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We implement appropriate technical and organizational security measures to protect 
                your personal information against unauthorized access, alteration, disclosure, or destruction:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>SSL/TLS encryption for data transmission</li>
                <li>Secure server infrastructure with regular security updates</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Regular security audits and monitoring</li>
                <li>Data minimization and retention policies</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                While we strive to protect your information, no method of transmission over the internet 
                is 100% secure. We cannot guarantee absolute security but continuously work to improve our protections.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights and Choices</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Under Australian Privacy Act and GDPR, you have the following rights:
              </p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.1 Access and Portability</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Request access to your personal information we hold</li>
                <li>Obtain a copy of your data in a portable format</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.2 Correction and Updates</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Request correction of inaccurate or incomplete information</li>
                <li>Update your preferences and contact details</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.3 Deletion and Restriction</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Request deletion of your personal information</li>
                <li>Restrict processing of your data in certain circumstances</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.4 Marketing Communications</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Opt-out of marketing emails at any time</li>
                <li>Manage your communication preferences</li>
          </ul>

              <p className="text-gray-700 leading-relaxed">
                To exercise any of these rights, please contact us using the information provided in Section 10.
              </p>
            </section>

            {/* International Transfers */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. International Data Transfers</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Your information may be transferred to and processed in countries other than Australia, 
                including the United States and European Union, where our service providers are located. 
                We ensure appropriate safeguards are in place to protect your information during international transfers.
              </p>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Data Retention</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We retain your personal information only for as long as necessary to fulfill the purposes 
                outlined in this policy, unless a longer retention period is required or permitted by law:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Account information: Until account deletion or 3 years of inactivity</li>
                <li>Analytics data: Up to 26 months (Google Analytics default)</li>
                <li>Contact inquiries: Up to 2 years for customer service purposes</li>
                <li>Legal compliance: As required by applicable laws</li>
              </ul>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our services are intended for users aged 18 and older. We do not knowingly collect 
                personal information from children under 18. If we discover that we have collected 
                information from a child under 18, we will promptly delete such information.
              </p>
              <p className="text-gray-700 leading-relaxed">
                If you are a parent or guardian and believe your child has provided us with personal 
                information, please contact us immediately.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have questions, concerns, or requests regarding this Privacy Policy or our 
                data practices, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>Email:</strong> privacy@sportspulse-au.com</p>
                <p className="text-gray-700 mb-2"><strong>Website:</strong> <Link href="/contact" className="text-navy underline">Contact Form</Link></p>
                <p className="text-gray-700"><strong>Response Time:</strong> We aim to respond within 30 days</p>
              </div>
            </section>

            {/* Changes to Policy */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to This Policy</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may update this Privacy Policy from time to time to reflect changes in our practices, 
                technology, legal requirements, or other factors. We will notify you of material changes by:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Posting the updated policy on our website</li>
                <li>Updating the "Last Modified" date at the top of this policy</li>
                <li>Sending email notifications for significant changes (if you've provided your email)</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Your continued use of our services after any changes indicates your acceptance of the updated policy.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                This Privacy Policy is governed by and construed in accordance with the laws of Australia. 
                Any disputes relating to this policy will be subject to the exclusive jurisdiction of the 
                courts of Australia.
              </p>
            </section>
          </div>

          {/* Quick Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                href="/terms" 
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <h4 className="font-medium text-gray-900 mb-2">Terms of Service</h4>
                <p className="text-sm text-gray-600">Read our terms and conditions</p>
              </Link>
              <Link 
                href="/contact" 
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <h4 className="font-medium text-gray-900 mb-2">Contact Us</h4>
                <p className="text-sm text-gray-600">Get in touch with questions</p>
              </Link>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Cookie Settings</h4>
                <p className="text-sm text-gray-600">Manage your cookie preferences</p>
                <button 
                  onClick={() => {
                    localStorage.removeItem('cookie-consent');
                    window.location.reload();
                  }}
                  className="text-sm text-navy underline mt-2"
                >
                  Update Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
    </main>

      <Footer />
    </div>
  );
} 