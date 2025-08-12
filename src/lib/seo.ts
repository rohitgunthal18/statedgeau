import { Metadata } from 'next';

export interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  category?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export class SEOUtils {
  private static readonly BASE_URL = 'https://statedgeau.vercel.app';
  private static readonly SITE_NAME = 'Stat Edge AU';
  private static readonly DEFAULT_IMAGE = '/og-stat-edge-au.jpg';

  static generateMetadata(config: SEOConfig): Metadata {
    const {
      title,
      description,
      keywords = [],
      image = this.DEFAULT_IMAGE,
      url = '',
      category = 'Sports Analysis',
      author = 'Stat Edge AU Expert Team',
      publishedTime,
      modifiedTime
    } = config;

    const fullTitle = title ? `${title} | ${this.SITE_NAME}` : `${this.SITE_NAME} | Expert AFL, NRL & Australian Sports Analysis`;
    const fullUrl = `${this.BASE_URL}${url}`;
    const fullImageUrl = image.startsWith('http') ? image : `${this.BASE_URL}${image}`;

    return {
      title: fullTitle,
      description,
      keywords: [...keywords, ...this.getDefaultKeywords()],
      authors: [{ name: author }],
      creator: this.SITE_NAME,
      publisher: this.SITE_NAME,
      category,
      metadataBase: new URL(this.BASE_URL),
      alternates: {
        canonical: fullUrl,
      },
      openGraph: {
        type: 'article',
        locale: 'en_AU',
        url: fullUrl,
        title: fullTitle,
        description,
        siteName: this.SITE_NAME,
        images: [
          {
            url: fullImageUrl,
            width: 1200,
            height: 630,
            alt: title || this.SITE_NAME,
          },
        ],
        publishedTime,
        modifiedTime,
        authors: [author],
        section: category,
      },
      twitter: {
        card: 'summary_large_image',
        site: '@StatEdgeAU',
        creator: '@StatEdgeAU',
        title: fullTitle,
        description,
        images: [fullImageUrl],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    };
  }

  static getDefaultKeywords(): string[] {
    return [
      // High-Volume Australian Sports SEO Keywords
      'AFL news',
      'Cricket Australia', 
      'NRL fixtures',
      'aussie sports betting',
      'AFL predictions',
      'cricket match analysis',
      'Rugby Union Australia',
      'Australian Open tennis',
      'Soccer Australia',
      'AFL ladder',
      'Big Bash League',
      'sports tips Australia',
      'AFL live scores',
      'Cricket World Cup 2025',
      'NRL results',
      'sports blog Australia',
      'AFL trade rumours',
      'Fantasy AFL',
      'aussie sports analysis',
      'AFL finals 2025',
      
      // Core Platform Keywords
      'stat edge au',
      'australian sports analysis',
      'AFL predictions expert',
      'NRL analysis australia',
      'horse racing tips melbourne cup',
      'cricket analysis australia',
      'australian sports betting insights',
      'footy tips expert analysis',
      'rugby league predictions',
      'sports statistics australia',
      'australian football league insights',
      'sports data analytics'
    ];
  }

  static generateSportKeywords(sport: string): string[] {
    const sportKeywords: Record<string, string[]> = {
      'afl': [
        'AFL news today',
        'AFL predictions this week',
        'AFL live scores real-time',
        'AFL ladder current standings',
        'AFL trade rumours player transfers',
        'AFL finals 2025 playoff coverage',
        'Fantasy AFL strategies tips',
        'AFL analysis 2024',
        'AFL predictions expert',
        'AFL finals predictions',
        'AFL ladder predictions',
        'AFL match previews',
        'AFL team analysis',
        'AFL brownlow medal betting',
        'AFL grand final predictions',
        'AFL round previews',
        'Australian Football League tips'
      ],
      'nrl': [
        'NRL fixtures 2025 schedule',
        'NRL results match outcomes',
        'NRL predictions 2024',
        'NRL analysis expert',
        'NRL finals predictions',
        'NRL ladder predictions',
        'NRL match previews',
        'NRL team analysis',
        'NRL dally m medal betting',
        'NRL grand final predictions',
        'NRL state of origin',
        'rugby league analysis'
      ],
      'cricket': [
        'Cricket Australia national team',
        'cricket match analysis in-depth',
        'Big Bash League T20 cricket',
        'Cricket World Cup 2025 predictions',
        'cricket analysis australia',
        'big bash league predictions',
        'test cricket analysis',
        'cricket match predictions',
        'australian cricket team',
        'cricket world cup analysis',
        'cricket betting tips',
        'cricket statistics analysis',
        'cricket match previews',
        'cricket expert analysis'
      ],
      'racing': [
        'horse racing analysis',
        'melbourne cup predictions',
        'horse racing form guide',
        'racing tips australia',
        'thoroughbred racing analysis',
        'horse racing betting tips',
        'racing carnival predictions',
        'melbourne racing analysis',
        'sydney racing tips',
        'australian horse racing'
      ],
      'tennis': [
        'Australian Open tennis grand slam',
        'australian open tennis analysis',
        'tennis predictions australia',
        'australian open coverage',
        'tennis news australia',
        'tennis betting tips',
        'tennis match analysis',
        'australian tennis players',
        'tennis tournament previews',
        'tennis expert predictions'
      ],
      'soccer': [
        'Soccer Australia A-League results',
        'A-league soccer predictions',
        'soccer australia news',
        'australian soccer analysis',
        'socceroos predictions',
        'A-league match previews',
        'soccer betting tips australia',
        'australian football federation',
        'soccer world cup australia',
        'soccer statistics australia'
      ]
    };

    return sportKeywords[sport.toLowerCase()] || [];
  }

  static generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
    return {
      "@type": "BreadcrumbList",
      "@id": `${this.BASE_URL}/#breadcrumbs`,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: `${this.BASE_URL}${item.url}`
      }))
    };
  }

  static generateArticleSchema(config: {
    headline: string;
    description: string;
    author: string;
    publishedTime: string;
    modifiedTime?: string;
    image: string;
    category: string;
    url: string;
  }) {
    return {
      "@type": "Article",
      "@id": `${this.BASE_URL}${config.url}#article`,
      headline: config.headline,
      description: config.description,
      image: config.image.startsWith('http') ? config.image : `${this.BASE_URL}${config.image}`,
      datePublished: config.publishedTime,
      dateModified: config.modifiedTime || config.publishedTime,
      author: {
        "@type": "Person",
        name: config.author,
        url: `${this.BASE_URL}/about`
      },
      publisher: {
        "@type": "Organization",
        name: this.SITE_NAME,
        logo: {
          "@type": "ImageObject",
          url: `${this.BASE_URL}/logo.png`
        }
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${this.BASE_URL}${config.url}`
      },
      articleSection: config.category,
      inLanguage: "en-AU"
    };
  }

  static generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
    return {
      "@type": "FAQPage",
      mainEntity: faqs.map(faq => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer
        }
      }))
    };
  }

  static getCanonicalUrl(pathname: string): string {
    return `${this.BASE_URL}${pathname}`;
  }

  static generateSitemapUrls(pages: Array<{ url: string; lastmod?: string; changefreq?: string; priority?: number }>) {
    return pages.map(page => ({
      url: `${this.BASE_URL}${page.url}`,
      lastModified: page.lastmod || new Date().toISOString(),
      changeFrequency: page.changefreq as any || 'weekly',
      priority: page.priority || 0.5
    }));
  }
} 