import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return new Response(
    `User-agent: *
Allow: /

# Allow all major search engines
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 1

User-agent: DuckDuckBot
Allow: /
Crawl-delay: 1

User-agent: facebookexternalhit
Allow: /

# Disallow admin and API routes
Disallow: /admin/
Disallow: /api/
Disallow: /*?*utm_source=
Disallow: /*?*utm_medium=
Disallow: /*?*utm_campaign=

# Allow important sports analysis pages
Allow: /trending
Allow: /latest
Allow: /search
Allow: /afl-analysis
Allow: /nrl-analysis
Allow: /horse-racing
Allow: /cricket-analysis
Allow: /soccer-analysis
Allow: /tennis-analysis
Allow: /stories

# Sitemap locations
Sitemap: https://statedgeau.vercel.app/sitemap.xml
Sitemap: https://statedgeau.vercel.app/feed.xml

# Crawl delay for respectful crawling
Crawl-delay: 1`,
    {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400',
      },
    }
  )
} 