import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { CookieConsent } from "@/components/ui/CookieConsent";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Stat Edge AU | Expert AFL, NRL & Australian Sports Analysis",
    template: "%s | Stat Edge AU"
  },
  description: "Australia's premier sports analysis platform. Get the latest AFL news, Cricket Australia updates, NRL fixtures & results. Expert AFL predictions, Big Bash League coverage, Australian Open tennis analysis & comprehensive sports tips Australia. Your trusted source for AFL live scores, NRL results, cricket match analysis & aussie sports betting insights.",
  keywords: [
    // High-Volume Australian Sports SEO Keywords
    "AFL news",
    "Cricket Australia", 
    "NRL fixtures",
    "aussie sports betting",
    "AFL predictions",
    "cricket match analysis",
    "Rugby Union Australia",
    "Australian Open tennis",
    "Soccer Australia",
    "AFL ladder",
    "Big Bash League",
    "sports tips Australia",
    "AFL live scores",
    "Cricket World Cup 2025",
    "NRL results",
    "sports blog Australia",
    "AFL trade rumours",
    "Fantasy AFL",
    "aussie sports analysis",
    "AFL finals 2025",
    
    // Primary Australian Sports Keywords  
    "stat edge au",
    "australian sports analysis",
    "AFL analysis Australia 2024",
    "NRL predictions expert tips",
    "australian football league insights",
    "horse racing analysis melbourne cup",
    "state of origin preview NRL",
    "AFL finals predictions ladder",
    "cricket analysis big bash league",
    "australian sports statistics data",
    "footy tips AFL expert analysis",
    "rugby league analysis NRL",
    "melbourne cup horse racing tips",
    "AFL brownlow medal predictions",
    "NRL dally m medal betting",
    "australian open tennis analysis",
    "A-league soccer predictions",
    "AFL match previews weekly",
    "NRL round previews expert",
    "sports news australia daily",
    "australian sports predictions",
    "AFL team analysis form guide",
    "NRL injury news updates",
    "horse racing form guide tips",
    "cricket match predictions australia",
    "AFL grand final predictions",
    "NRL grand final analysis",
    "australian sports betting insights",
    "sports data analytics australia",
    "professional sports analysis",
    "australian sports journalism",
    
    // Additional Long-tail Keywords
    "AFL news today latest updates",
    "Cricket Australia national team",
    "NRL fixtures 2025 schedule",
    "aussie sports betting tips expert",
    "AFL predictions this week accurate",
    "cricket match analysis in-depth",
    "Rugby Union Australia Wallabies",
    "Australian Open tennis grand slam",
    "Soccer Australia A-League results",
    "AFL ladder current standings",
    "Big Bash League T20 cricket",
    "sports tips Australia fantasy advice",
    "AFL live scores real-time updates",
    "Cricket World Cup 2025 predictions",
    "NRL results match outcomes",
    "sports blog Australia expert commentary",
    "AFL trade rumours player transfers",
    "Fantasy AFL strategies tips",
    "aussie sports analysis expert insights",
    "AFL finals 2025 playoff coverage"
  ],
  authors: [{ name: "Stat Edge AU Expert Analysis Team" }],
  creator: "Stat Edge AU",
  publisher: "Stat Edge AU",
  applicationName: "Stat Edge AU",
  category: "Sports Analysis",
  classification: "Sports Analytics Platform",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://statedgeau.vercel.app"),
  alternates: {
    canonical: "https://statedgeau.vercel.app",
    languages: {
      'en-AU': 'https://statedgeau.vercel.app',
      'en': 'https://statedgeau.vercel.app'
    }
  },
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "https://statedgeau.vercel.app",
    title: "Stat Edge AU | Australia's Premier Sports Analysis Platform - AFL News, Cricket Australia, NRL Fixtures",
    description: "Get latest AFL news, Cricket Australia updates & NRL fixtures. Expert AFL predictions, Big Bash League coverage, Australian Open tennis analysis. Your trusted source for AFL live scores, NRL results & aussie sports betting insights with 95% accuracy rate.",
    siteName: "Stat Edge AU",
    images: [
      {
        url: "/og-stat-edge-au.jpg",
        width: 1200,
        height: 630,
        alt: "Stat Edge AU - Expert Australian Sports Analysis Platform - AFL News, Cricket Australia, NRL",
        type: "image/jpeg"
      },
      {
        url: "/og-stat-edge-au-square.jpg",
        width: 600,
        height: 600,
        alt: "Stat Edge AU - AFL NRL Cricket Analysis",
        type: "image/jpeg"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@StatEdgeAU",
    creator: "@StatEdgeAU",
    title: "Stat Edge AU | AFL News, Cricket Australia, NRL Fixtures & Expert Analysis",
    description: "🏈 AFL News & Predictions 🏏 Cricket Australia Updates 🏉 NRL Fixtures & Results 🎾 Australian Open Tennis | Australia's most trusted sports platform with 95% accuracy rate.",
    images: ["/twitter-stat-edge-au.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "stat-edge-au-google-verification"
  },
  other: {
    'geo.region': 'AU',
    'geo.country': 'Australia',
    'geo.placename': 'Australia',
    'ICBM': '-25.274398, 133.775136',
    'audience': 'AFL fans, Cricket Australia supporters, NRL enthusiasts, Australian sports fans, fantasy sports players, sports betting community'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU" className={inter.variable}>
      <head>
        {/* 
        ====================================
        STAT EDGE AU - AUSTRALIAN SPORTS ANALYSIS
        ====================================
        
        Owner & Developer: Rohit Gunthal
        Email: rohitgunthal1819@gmail.com  
        Mobile: +91-8408088454
        Business Email: contact.statedgeau@gmail.com
        
        Platform: Stat Edge AU
        Website: https://statedgeau.vercel.app
        Founded: 2024
        
        Technology Stack:
        - Next.js 14 (React Framework)
        - TypeScript (Type Safety)
        - Tailwind CSS (Styling)
        - Supabase (Database & Auth)
        - Vercel (Hosting)
        
        Copyright © 2024 Stat Edge AU. All Rights Reserved.
        Expert AFL, NRL & Australian Sports Analysis
        
        ====================================
        */}
        
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#1a237e" />
        <meta name="msapplication-TileColor" content="#1a237e" />
        
        {/* RSS Feed */}
        <link rel="alternate" type="application/rss+xml" title="Stat Edge AU - Australian Sports Analysis RSS Feed" href="/feed.xml" />
        
        {/* Google Analytics 4 */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              
              // Set default consent state (denied until user consents)
              gtag('consent', 'default', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied',
                'functionality_storage': 'denied',
                'personalization_storage': 'denied',
                'security_storage': 'granted'
              });
              
              // Configure GA4
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_title: document.title,
                page_location: window.location.href,
                cookie_flags: 'SameSite=Lax;Secure',
                send_page_view: false // We'll handle page views manually
              });
            `
          }}
        />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://statedgeau.vercel.app/#organization",
                  name: "Stat Edge AU",
                  alternateName: ["StatEdge AU", "Stat Edge Australia"],
                  url: "https://statedgeau.vercel.app",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://statedgeau.vercel.app/logo.png",
                    width: 300,
                    height: 300
                  },
                  description: "Australia's premier sports analysis platform providing expert AFL, NRL, horse racing and cricket insights with 95% accuracy rate. Owned and developed by Rohit Gunthal.",
                  foundingDate: "2024",
                  founder: {
                    "@type": "Person",
                    name: "Rohit Gunthal",
                    email: "rohitgunthal1819@gmail.com",
                    telephone: "+91-8408088454"
                  },
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: "Floor 3, Tech Plaza, Baner Road",
                    addressLocality: "Pune",
                    addressRegion: "Maharashtra",
                    postalCode: "411045",
                    addressCountry: "IN"
                  },
                  contactPoint: [
                    {
                      "@type": "ContactPoint",
                      contactType: "Customer Service",
                      telephone: "+91-8408088454",
                      email: "contact.statedgeau@gmail.com",
                      availableLanguage: ["English", "Australian English"],
                      areaServed: "AU"
                    }
                  ],
                  sameAs: [
                    "https://t.me/+K1GjvOY331JhNGM1"
                  ],
                  areaServed: {
                    "@type": "Country",
                    name: "Australia"
                  },
                  audience: {
                    "@type": "Audience",
                    audienceType: "Sports enthusiasts",
                    geographicArea: {
                      "@type": "Country",
                      name: "Australia"
                    }
                  },
                  knowsAbout: [
                    "AFL News",
                    "Cricket Australia",
                    "NRL Fixtures", 
                    "AFL Predictions",
                    "Cricket Match Analysis",
                    "Rugby Union Australia",
                    "Australian Open Tennis",
                    "Soccer Australia",
                    "AFL Ladder",
                    "Big Bash League",
                    "Sports Tips Australia",
                    "AFL Live Scores",
                    "NRL Results",
                    "Fantasy AFL",
                    "Aussie Sports Betting",
                    "AFL Trade Rumours",
                    "AFL Analysis",
                    "NRL Predictions", 
                    "Horse Racing Tips",
                    "Cricket Analysis",
                    "Australian Sports",
                    "Sports Statistics",
                    "Match Previews",
                    "Sports Data Analytics",
                    "AFL Finals Coverage",
                    "Sports Blog Australia"
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://statedgeau.vercel.app/#website",
                  url: "https://statedgeau.vercel.app",
                  name: "Stat Edge AU",
                  description: "Expert Australian sports analysis and predictions",
                  publisher: {
                    "@id": "https://statedgeau.vercel.app/#organization"
                  },
                  potentialAction: [
                    {
                      "@type": "SearchAction",
                      target: {
                        "@type": "EntryPoint",
                        urlTemplate: "https://statedgeau.vercel.app/search?q={search_term_string}"
                      },
                      "query-input": "required name=search_term_string"
                    }
                  ],
                  inLanguage: "en-AU"
                },
                {
                  "@type": "BreadcrumbList",
                  "@id": "https://statedgeau.vercel.app/#breadcrumbs",
                  itemListElement: [
                    {
                      "@type": "ListItem",
                      position: 1,
                      name: "Home",
                      item: "https://statedgeau.vercel.app"
                    }
                  ]
                }
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <div id="progress-bar" className="progress-bar"></div>
          {children}
          <CookieConsent />
        </AuthProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Scroll progress bar
              window.addEventListener('scroll', () => {
                const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (winScroll / height) * 100;
                document.getElementById('progress-bar').style.width = scrolled + '%';
              });
            `
          }}
        />
      </body>
    </html>
  );
}
