import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/api/(.*)',
  '/dashboard(.*)',
]);

const AI_TOOL_ROUTES = [
  '/api/flock', '/api/egg-records', '/api/health-events', '/api/inventory',
  '/api/expenses', '/api/stocking', '/api/products', '/api/orders', '/api/invoices',
  '/api/dashboard', '/api/predictions', '/api/analytics', '/api/farms', '/api/feed',
];

export default clerkMiddleware(
  async (auth, req) => {
    if (AI_TOOL_ROUTES.some(route => req.nextUrl.pathname.startsWith(route))) return;
    if (req.nextUrl.pathname.startsWith('/api/img')) return;
    if (req.nextUrl.pathname.startsWith('/api/facts')) return;
    if (req.nextUrl.pathname.startsWith('/chicken-img')) return;
    if (isProtectedRoute(req)) {
      await auth.protect();
    }
  },
  {
    signInUrl: 'https://poultrix.abouaaliahmed.com/login',
    signUpUrl: 'https://poultrix.abouaaliahmed.com/sign-up',
  },
);

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*'],
};
