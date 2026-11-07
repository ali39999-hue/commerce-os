import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Emit a self-contained server bundle to .next/standalone for Docker.
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  async redirects() {
    return [
      {
        source: '/blog/rahnamaye-entekhab-ghahve',
        destination: '/blog/clinical-skincare-selection-guide',
        permanent: true,
      },
      {
        source: '/carbox',
        destination: '/carboxygel',
        permanent: true,
      },
      {
        source: '/plasmax',
        destination: '/carboxygel',
        permanent: true,
      },
      {
        source: '/academy',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/b2b/:path*',
        destination: '/#products',
        permanent: true,
      },
      {
        source: '/vendors/:path*',
        destination: '/#products',
        permanent: true,
      },
      {
        source: '/vendors',
        destination: '/#products',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
