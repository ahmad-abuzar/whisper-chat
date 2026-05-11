import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Production optimizations */
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  
  /* Images */
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  
  /* Security headers - configure in middleware or deployment platform */
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
