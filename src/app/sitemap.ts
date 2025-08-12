import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://statedgeau.vercel.app'
  const now = new Date()
  
  return [
    // Homepage - Highest Priority
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    
    // High-Traffic Content Pages
    {
      url: `${baseUrl}/trending`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/latest`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    
    // Primary Sports Categories - High Priority
    {
      url: `${baseUrl}/afl-analysis`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/nrl-analysis`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cricket-analysis`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/horse-racing`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    
    // Secondary Sports Categories
    {
      url: `${baseUrl}/tennis-analysis`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/soccer-analysis`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/basketball-analysis`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/multi-sport`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.6,
    },
    
    // User Features
    {
      url: `${baseUrl}/search`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/saved-posts`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/liked-posts`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    
    // Content Features
    {
      url: `${baseUrl}/stories`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tips`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/analysis`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/live-odds`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    
    // Information Pages
    {
      url: `${baseUrl}/about`,
      lastModified: new Date('2024-12-01'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date('2024-12-01'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    
    // Legal Pages
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date('2024-12-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date('2024-12-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
} 