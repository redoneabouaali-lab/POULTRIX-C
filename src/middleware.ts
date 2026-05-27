import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/api/(.*)',
  '/dashboard(.*)',
]);

export default clerkMiddleware(
  async (auth, req) => {
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
