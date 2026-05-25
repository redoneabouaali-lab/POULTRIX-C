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
      const { userId } = await auth();
      if (!userId) {
        const loginUrl = new URL('/login', 'https://poultrix.abouaaliahmed.com');
        loginUrl.searchParams.set('redirect_url', `https://poultrix.abouaaliahmed.com${req.nextUrl.pathname}`);
        return Response.redirect(loginUrl.toString());
      }
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
