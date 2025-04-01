import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.has('auth-token');
  const isLoginPage = request.nextUrl.pathname === '/login';
  const isGroupsPage = request.nextUrl.pathname === '/groups';
  const isGroupsApi = request.nextUrl.pathname.startsWith('/api/groups');
  const isGroupDetailPage = request.nextUrl.pathname.match(/^\/groups\/\d+$/);
  const isHomePage = request.nextUrl.pathname === '/';

  // Allow public access to home page, groups page, group detail pages, and their API
  if (isHomePage || isGroupsPage || isGroupsApi || isGroupDetailPage) {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated and not on login page
  if (!isAuthenticated && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to home if authenticated and on login page
  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 