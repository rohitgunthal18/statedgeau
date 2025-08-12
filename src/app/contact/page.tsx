import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Phone, Mail, MapPin, MessageCircle, Clock, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us | Stat Edge AU Sports Analytics | Pune, Maharashtra',
  description: 'Contact Stat Edge AU for expert sports analysis and insights. Phone: 8408088454. Located in Pune, Maharashtra. Get in touch for partnerships and support.',
  keywords: ['contact', 'stat edge au', 'sports analytics', 'pune', 'maharashtra', 'sports analysis', 'support'],
  alternates: { canonical: '/contact' },
  robots: { index: true, follow: true },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions about our sports analysis or need support? We're here to help! 
              Contact our expert team for the best betting insights and tips.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                <div className="space-y-6">
                  {/* Phone */}
                  <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-3 bg-emerald/10 rounded-lg">
                      <Phone className="w-6 h-6 text-emerald" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Phone Support</h3>
                      <p className="text-gray-600 mb-2">Call us for immediate assistance</p>
                      <a 
                        href="tel:+918408088454" 
                        className="text-lg font-semibold text-emerald hover:text-emerald/80 transition-colors"
                      >
                        +91 8408088454
                      </a>
                      <p className="text-sm text-gray-500 mt-1">Mon-Fri, 9:00 AM - 6:00 PM IST</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-3 bg-navy/10 rounded-lg">
                      <Mail className="w-6 h-6 text-navy" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email Support</h3>
                      <p className="text-gray-600 mb-2">Send us your questions</p>
                      <a 
                        href="mailto:contact.statedgeau@gmail.com" 
                        className="text-lg font-semibold text-navy hover:text-navy/80 transition-colors"
                      >
                        contact.statedgeau@gmail.com
                      </a>
                      <p className="text-sm text-gray-500 mt-1">We respond within 24 hours</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-3 bg-golden/10 rounded-lg">
                      <MapPin className="w-6 h-6 text-golden" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Office Address</h3>
                      <p className="text-gray-600 mb-2">Visit our headquarters</p>
                      <address className="text-gray-700 not-italic">
                        Stat Edge AU Analytics<br />
                        Floor 3, Tech Plaza,<br />
                        Baner Road, Baner,<br />
                        Pune, Maharashtra 411045<br />
                        India
                      </address>
                    </div>
                  </div>

                  {/* Telegram */}
                  <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <MessageCircle className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Join Our Community</h3>
                      <p className="text-gray-600 mb-3">Get instant tips and analysis</p>
                      <a 
                        href="https://t.me/+K1GjvOY331JhNGM1" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
                      >
                        <Users className="w-4 h-4" />
                        Join 10K+ Members
                      </a>
                      <p className="text-sm text-gray-500 mt-2">Free daily tips and live analysis</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-emerald" />
                  <h3 className="text-xl font-semibold text-gray-900">Business Hours</h3>
                </div>
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM IST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-medium">10:00 AM - 4:00 PM IST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-medium text-gray-500">Closed</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-emerald/10 rounded-lg">
                  <p className="text-sm text-emerald font-medium">
                    🔥 Live match analysis available during all major sporting events!
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-emerald transition-colors"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-emerald transition-colors"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-emerald transition-colors"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-emerald transition-colors"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="media">Media & Press</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald focus:border-emerald transition-colors resize-none"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald to-navy text-white font-semibold py-4 px-6 rounded-lg hover:from-emerald/90 hover:to-navy/90 transition-all duration-200 transform hover:scale-[1.02]"
                >
                  Send Message
                </button>

                <p className="text-sm text-gray-500 text-center">
                  We typically respond within 24 hours during business days.
                </p>
              </form>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-16 bg-gradient-to-r from-navy to-emerald text-white rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Why Choose Stat Edge AU?</h2>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              We're Australia's leading sports analytics platform with over 10,000+ active members 
              getting daily winning insights and expert analysis.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold text-golden mb-2">95%</div>
                <div className="text-gray-200">Accuracy Rate</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-golden mb-2">10K+</div>
                <div className="text-gray-200">Active Members</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-golden mb-2">24/7</div>
                <div className="text-gray-200">Live Support</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 