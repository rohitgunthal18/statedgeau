import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | SportsPulse AU',
  description: 'Read the terms and conditions for using SportsPulse AU. Our terms cover user responsibilities, content guidelines, and service limitations.',
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  const lastUpdated = new Date().toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Last updated:</strong> {lastUpdated}
            </p>
            <p className="text-sm text-blue-800 mt-2">
              These terms are governed by Australian law and comply with applicable regulations.
            </p>
          </div>

          <div className="prose prose-gray max-w-none space-y-8">
            
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Welcome to SportsPulse AU. These Terms of Service ("Terms") govern your use of our website 
                located at sportspulse-au.vercel.app and all related services, features, and content 
                provided by SportsPulse AU ("we", "us", or "our").
              </p>
              <p className="text-gray-700 leading-relaxed">
                By accessing or using our services, you agree to be bound by these Terms. If you do not 
                agree to these Terms, please do not use our services. We may modify these Terms at any 
                time, and such modifications will be effective immediately upon posting.
              </p>
            </section>

            {/* Service Description */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Service Description</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                SportsPulse AU provides sports analysis, predictions, news, and commentary focused on 
                Australian sports including AFL, NRL, horse racing, cricket, soccer, tennis, and basketball. 
                Our content is intended for informational and entertainment purposes only.
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Important Disclaimer</h3>
                <p className="text-sm text-yellow-800">
                  <strong>All content on SportsPulse AU is for entertainment and informational purposes only.</strong> 
                  Our analysis, predictions, and commentary should not be considered as professional advice 
                  or guarantees of outcomes. Sports analysis involves inherent uncertainty, and past 
                  performance does not guarantee future results.
                </p>
              </div>
            </section>

            {/* User Responsibilities */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Eligibility</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You must be at least 18 years old to use our services. By using our services, you represent 
                and warrant that you meet this age requirement and have the legal capacity to enter into these Terms.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Acceptable Use</h3>
              <p className="text-gray-700 leading-relaxed mb-4">You agree to use our services only for lawful purposes and in accordance with these Terms. You agree not to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on the rights of others, including intellectual property rights</li>
                <li>Transmit any harmful, offensive, or inappropriate content</li>
                <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
                <li>Use automated systems to access our services without permission</li>
                <li>Interfere with or disrupt our services or servers</li>
                <li>Use our content for commercial purposes without written permission</li>
          </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.3 Account Security</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you create an account, you are responsible for maintaining the confidentiality of your 
                account credentials and for all activities that occur under your account. You agree to 
                notify us immediately of any unauthorized use of your account.
              </p>
            </section>

            {/* Content and Intellectual Property */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Content and Intellectual Property</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Our Content</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                All content on SportsPulse AU, including but not limited to text, graphics, logos, images, 
                audio clips, video clips, data compilations, and software, is owned by us or our licensors 
                and is protected by Australian and international copyright laws.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 Limited License</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We grant you a limited, non-exclusive, non-transferable license to access and use our 
                content for personal, non-commercial purposes. This license does not permit you to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Reproduce, distribute, or display our content commercially</li>
                <li>Modify, adapt, or create derivative works from our content</li>
                <li>Remove any copyright or proprietary notices</li>
                <li>Use our content in any way that competes with our services</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.3 User-Generated Content</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you submit content to our services (comments, feedback, suggestions), you grant us a 
                worldwide, royalty-free, perpetual, irrevocable, non-exclusive license to use, reproduce, 
                modify, adapt, publish, translate, and distribute such content in any media.
              </p>
            </section>

            {/* Sports Analysis Disclaimers */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Sports Analysis Disclaimers</h2>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-red-800 mb-2">🚨 Critical Disclaimers</h3>
                <ul className="text-sm text-red-800 space-y-2">
                  <li><strong>No Guarantees:</strong> Our analysis and predictions are opinions based on available data and do not guarantee any outcomes.</li>
                  <li><strong>Not Financial Advice:</strong> Our content is not financial, investment, or professional advice.</li>
                  <li><strong>Entertainment Only:</strong> All content is provided for entertainment and educational purposes.</li>
                  <li><strong>Personal Responsibility:</strong> Any decisions based on our content are made at your own risk.</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1 Analysis Methodology</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our sports analysis is based on publicly available data, statistics, expert opinion, and 
                analytical models. We strive for accuracy but cannot guarantee the completeness or 
                correctness of all information presented.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2 Third-Party Information</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may reference or link to third-party sources, statistics, or content. We do not 
                endorse or guarantee the accuracy of third-party information and are not responsible 
                for any errors or omissions in such content.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.3 Responsible Use</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We encourage responsible consumption of sports analysis content. Always:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Conduct your own research and analysis</li>
                <li>Consider multiple sources of information</li>
                <li>Make informed decisions based on your own judgment</li>
                <li>Understand that sports outcomes are inherently unpredictable</li>
                <li>Seek professional advice for financial decisions</li>
              </ul>
            </section>

            {/* Privacy and Data */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Privacy and Data Protection</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Your privacy is important to us. Our collection, use, and protection of your personal 
                information is governed by our <Link href="/privacy" className="text-navy underline">Privacy Policy</Link>, 
                which is incorporated into these Terms by reference.
              </p>
              <p className="text-gray-700 leading-relaxed">
                By using our services, you consent to the collection and use of your information as 
                described in our Privacy Policy.
              </p>
            </section>

            {/* Service Availability */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Service Availability and Modifications</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We strive to provide reliable and continuous service, but we cannot guarantee uninterrupted 
                access. We reserve the right to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Modify, suspend, or discontinue any aspect of our services</li>
                <li>Impose limits on certain features or restrict access to parts of our services</li>
                <li>Perform maintenance and updates that may temporarily affect availability</li>
                <li>Remove or modify content at our discretion</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                We will provide reasonable notice of significant changes when possible, but are not 
                obligated to do so for all modifications.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To the maximum extent permitted by law, SportsPulse AU and its affiliates, officers, 
                directors, employees, agents, and licensors shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Loss of profits, revenue, or business opportunities</li>
                <li>Loss of data or information</li>
                <li>Personal injury or property damage</li>
                <li>Emotional distress or mental anguish</li>
                <li>Any other damages arising from your use of our services</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Our total liability for any claims related to our services shall not exceed the amount 
                you paid us in the twelve months preceding the claim, or AUD $100, whichever is greater.
              </p>
            </section>

            {/* Indemnification */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Indemnification</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You agree to indemnify, defend, and hold harmless SportsPulse AU and its affiliates, 
                officers, directors, employees, agents, and licensors from and against any claims, 
                liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) 
                arising from:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Your use or misuse of our services</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
                <li>Any content you submit or share through our services</li>
              </ul>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Termination</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may terminate or suspend your access to our services immediately, without prior 
                notice or liability, for any reason, including breach of these Terms. Upon termination, 
                your right to use our services will cease immediately.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You may also terminate your use of our services at any time by discontinuing access 
                to our website and deleting any accounts you may have created.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Governing Law and Jurisdiction</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                These Terms are governed by and construed in accordance with the laws of Australia, 
                without regard to conflict of law principles. Any legal action or proceeding arising 
                under these Terms will be brought exclusively in the courts of Australia.
              </p>
              <p className="text-gray-700 leading-relaxed">
                If you are accessing our services from outside Australia, you are responsible for 
                compliance with local laws in your jurisdiction.
              </p>
            </section>

            {/* Severability */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Severability and Entire Agreement</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If any provision of these Terms is held to be invalid or unenforceable, the remaining 
                provisions will remain in full force and effect. These Terms, together with our Privacy 
                Policy, constitute the entire agreement between you and SportsPulse AU regarding your 
                use of our services.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>Email:</strong> legal@sportspulse-au.com</p>
                <p className="text-gray-700 mb-2"><strong>Contact Form:</strong> <Link href="/contact" className="text-navy underline">Contact Us</Link></p>
                <p className="text-gray-700"><strong>Response Time:</strong> We aim to respond within 5 business days</p>
              </div>
            </section>
          </div>

          {/* Quick Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link 
                href="/privacy" 
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <h4 className="font-medium text-gray-900 mb-2">Privacy Policy</h4>
                <p className="text-sm text-gray-600">Learn how we protect your data</p>
              </Link>
              <Link 
                href="/contact" 
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <h4 className="font-medium text-gray-900 mb-2">Contact Us</h4>
                <p className="text-sm text-gray-600">Get help or ask questions</p>
              </Link>
            </div>
          </div>
        </div>
    </main>

      <Footer />
    </div>
  );
} 