/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
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
           { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://www.googletagmanager.com https://www.google-analytics.com https://static.cloudflareinsights.com; worker-src 'self' blob: https://*.clerk.accounts.dev; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://images.unsplash.com https://img.clerk.com https://www.google-analytics.com; connect-src 'self' https://*.clerk.accounts.dev https://clerk-telemetry.com https://integrate.api.nvidia.com https://en.wikipedia.org https://ar.wikipedia.org https://chickenapi.com https://www.google-analytics.com https://analytics.google.com https://static.cloudflareinsights.com; font-src 'self'; frame-src 'self' https://*.clerk.accounts.dev; media-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'" },
          // Cross-Origin headers removed — they blocked AI crawler browsers
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
