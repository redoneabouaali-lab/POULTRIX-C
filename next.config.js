/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
           { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://clerk.abouaaliahmed.com https://challenges.cloudflare.com https://www.googletagmanager.com https://www.google-analytics.com https://static.cloudflareinsights.com; worker-src 'self' blob: https://*.clerk.accounts.dev https://clerk.abouaaliahmed.com; style-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; img-src 'self' data: https://images.unsplash.com https://img.clerk.com https://clerk.abouaaliahmed.com https://challenges.cloudflare.com https://www.google-analytics.com; connect-src 'self' https://*.clerk.accounts.dev https://clerk.abouaaliahmed.com https://challenges.cloudflare.com https://clerk-telemetry.com https://integrate.api.nvidia.com https://en.wikipedia.org https://ar.wikipedia.org https://chickenapi.com https://www.google-analytics.com https://analytics.google.com https://static.cloudflareinsights.com; font-src 'self'; frame-src 'self' https://*.clerk.accounts.dev https://clerk.abouaaliahmed.com https://challenges.cloudflare.com; media-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'" },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/favicon.svg',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
      {
        source: '/og-image.svg',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
      {
        source: '/fallback-chicken.svg',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/favicon.ico',
        destination: '/favicon.svg',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
