import createNextIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing'; // Assuming this path is correct
import { NextRequest, NextResponse } from 'next/server';

// Initialize next-intl middleware with its configuration
const nextIntlMiddleware = createNextIntlMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Regex to match locale-prefixed admin panel paths
  const adminPanelRegex = new RegExp(`^/(${routing.locales.join('|')})/admin/panel$`);

  if (adminPanelRegex.test(pathname)) {
    const cookie = request.cookies.get('admin-auth');
    if (!cookie) {
      const locale = pathname.split('/')[1];
      // Redirect to the locale-specific login page
      return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
    }
  }

  // For all other requests, apply the next-intl middleware.
  return nextIntlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\..*).*)'
};
