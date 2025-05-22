import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
 
export default createMiddleware(routing);
 
export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};

// Protect /[locale]/admin/panel route
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Match /en/admin/panel, /es/admin/panel, etc.
  const adminPanelRegex = /^\/(en|es|it)\/admin\/panel$/;
  if (adminPanelRegex.test(pathname)) {
    const cookie = request.cookies.get('admin-auth');
    if (!cookie) {
      // Redirect to the correct locale login page
      const locale = pathname.split('/')[1];
      return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
    }
  }
  // Fallback to next-intl middleware
  return createMiddleware(routing)(request);
}