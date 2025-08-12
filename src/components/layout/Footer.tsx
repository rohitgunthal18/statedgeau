import Link from "next/link";
import { MessageCircle, Shield, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-navy text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-golden to-emerald rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">SE</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">StatEdge AU</h3>
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              Expert Australian sports analysis, predictions, and match reports.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Sports</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/afl" className="text-gray-300 hover:text-golden transition-colors">AFL Analysis</Link></li>
              <li><Link href="/nrl" className="text-gray-300 hover:text-golden transition-colors">NRL Analysis</Link></li>
              <li><Link href="/racing" className="text-gray-300 hover:text-golden transition-colors">Racing Insights</Link></li>
              <li><Link href="/cricket" className="text-gray-300 hover:text-golden transition-colors">Cricket</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/tips" className="text-gray-300 hover:text-golden transition-colors">Latest Insights</Link></li>
              <li><Link href="/analysis" className="text-gray-300 hover:text-golden transition-colors">Expert Analysis</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-golden transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-golden transition-colors">Contact</Link></li>
              <li><Link href="/feed.xml" className="text-gray-300 hover:text-golden transition-colors flex items-center gap-1">
                <span>RSS Feed</span>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a1 1 0 000 2c5.523 0 10 4.477 10 10a1 1 0 102 0C17 8.373 11.627 3 5 3z"/>
                  <path d="M4 9a1 1 0 011-1 7 7 0 017 7 1 1 0 11-2 0 5 5 0 00-5-5 1 1 0 01-1-1z"/>
                  <path d="M3 15a2 2 0 114 0 2 2 0 01-4 0z"/>
                </svg>
              </Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Join Our Community</h4>
            <p className="text-gray-300 text-sm mb-4">
              Get quick previews and updates on Telegram.
            </p>
            <a
              href="https://t.me/AussieSportsInsights"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald/90 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Join Telegram
            </a>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span>© 2024 Stat Edge AU</span>
              <Link href="/privacy" className="hover:text-golden transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-golden transition-colors">Terms of Service</Link>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Trusted Analysis Platform</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 