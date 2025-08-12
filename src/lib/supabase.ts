import { createClient } from '@supabase/supabase-js';

// Environment variables with validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!supabaseAnonKey) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Single instance of Supabase client to prevent multiple instances warning
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const supabase = (() => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storageKey: 'statedgeau-auth',
      },
      global: {
        headers: {
          'X-Client-Info': 'stat-edge-au@1.0.0',
        },
      },
      db: {
        schema: 'public',
      },
      realtime: {
        params: {
          eventsPerSecond: 2,
        },
      },
    });
  }
  return supabaseInstance;
})();

// Server-side client for admin operations
export const createServerClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey) {
    throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        'X-Client-Info': 'stat-edge-au-server@1.0.0',
      },
    },
  });
};

// Types
export type Database = {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content?: string;
          excerpt?: string;
          featured_image?: string;
          featured_image_alt?: string;
          status: 'draft' | 'published' | 'archived';
          published_at?: string;
          created_at: string;
          updated_at: string;
          view_count: number;
          share_count: number;
          favorite_count: number;
          comment_count: number;
          like_count: number;
          reading_time?: number;
          seo_title?: string;
          seo_description?: string;
          seo_keywords?: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content?: string;
          excerpt?: string;
          featured_image?: string;
          featured_image_alt?: string;
          status?: 'draft' | 'published' | 'archived';
          published_at?: string;
          created_at?: string;
          updated_at?: string;
          view_count?: number;
          share_count?: number;
          favorite_count?: number;
          comment_count?: number;
          like_count?: number;
          reading_time?: number;
          seo_title?: string;
          seo_description?: string;
          seo_keywords?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string;
          excerpt?: string;
          featured_image?: string;
          featured_image_alt?: string;
          status?: 'draft' | 'published' | 'archived';
          published_at?: string;
          created_at?: string;
          updated_at?: string;
          view_count?: number;
          share_count?: number;
          favorite_count?: number;
          comment_count?: number;
          like_count?: number;
          reading_time?: number;
          seo_title?: string;
          seo_description?: string;
          seo_keywords?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description?: string;
          sport_type: string;
          color?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string;
          sport_type: string;
          color?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          sport_type?: string;
          color?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};

export default supabase;
