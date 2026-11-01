import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Emit a self-contained server bundle to .next/standalone for Docker.
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/blog/rahnamaye-entekhab-ghahve',
        destination: '/blog/clinical-skincare-selection-guide',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
