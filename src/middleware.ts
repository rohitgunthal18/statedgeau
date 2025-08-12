import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/database';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });

  // Always refresh auth cookies for SSR/API
  await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  // Skip auth enforcement on public admin routes to avoid loops
  const isPublicAdminRoute = pathname === '/admin/login' || pathname.startsWith('/admin/reset-password');

  // Protect admin pages (except the public ones)
  if (pathname.startsWith('/admin') && !isPublicAdminRoute) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@aussieinsights.com';

    if (!session || session.user.email !== adminEmail) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('redirectedFrom', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
}; 