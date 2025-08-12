import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Fetch latest published posts
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        id, title, slug, excerpt, content, featured_image, published_at, updated_at,
        categories(name, slug, sport_type)
      `)
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching posts for RSS:', error);
      return new NextResponse('Error generating RSS feed', { status: 500 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://statedgeau.vercel.app';
    const currentDate = new Date().toISOString();

    // Generate RSS XML
    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:wfw="http://wellformedweb.org/CommentAPI/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:sy="http://purl.org/rss/1.0/modules/syndication/" xmlns:slash="http://purl.org/rss/1.0/modules/slash/">
  <channel>
    <title>Stat Edge AU - Expert Australian Sports Analysis</title>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <link>${baseUrl}</link>
    <description>Australia's premier sports analysis platform. Expert AFL predictions, NRL insights, horse racing tips, cricket analysis &amp; comprehensive Australian sports data. Trusted by 50K+ sports fans.</description>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <language>en-AU</language>
    <sy:updatePeriod>hourly</sy:updatePeriod>
    <sy:updateFrequency>1</sy:updateFrequency>
    <managingEditor>contact.statedgeau@gmail.com (Stat Edge AU Expert Team)</managingEditor>
    <webMaster>contact.statedgeau@gmail.com (Stat Edge AU Technical Team)</webMaster>
    <category>Sports Analysis</category>
    <category>AFL Analysis</category>
    <category>NRL Predictions</category>
    <category>Horse Racing Tips</category>
    <category>Australian Sports</category>
    <ttl>60</ttl>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>Stat Edge AU</title>
      <link>${baseUrl}</link>
      <width>144</width>
      <height>144</height>
      <description>Expert Australian Sports Analysis</description>
    </image>
    ${posts?.map(post => {
      const postUrl = `${baseUrl}/posts/${post.slug}`;
      const category = post.categories?.[0];
      const pubDate = new Date(post.published_at).toISOString();
      const updatedDate = new Date(post.updated_at || post.published_at).toISOString();
      
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <pubDate>${pubDate}</pubDate>
      <dc:creator><![CDATA[Stat Edge AU Expert Analysis Team]]></dc:creator>
      <category><![CDATA[${category?.name || 'Sports Analysis'}]]></category>
      <guid isPermaLink="false">${post.id}</guid>
      <description><![CDATA[${post.excerpt || ''}]]></description>
      <content:encoded><![CDATA[${post.content || post.excerpt || ''}]]></content:encoded>
      ${post.featured_image ? `<enclosure url="${post.featured_image}" type="image/jpeg" />` : ''}
      <dc:date>${updatedDate}</dc:date>
    </item>`;
    }).join('') || ''}
  </channel>
</rss>`;

    return new NextResponse(rssXml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
      },
    });

  } catch (error) {
    console.error('RSS feed generation error:', error);
    return new NextResponse('Error generating RSS feed', { status: 500 });
  }
} 