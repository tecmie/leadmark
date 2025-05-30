/** @type {import('next').NextConfig} */
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/auth',
        destination: '/auth/signin',
        permanent: true,
      },
    ];
  },
  transpilePackages: ['@repo/tailwind-config', '@repo/ui', '@repo/types'],
};

export default nextConfig;
