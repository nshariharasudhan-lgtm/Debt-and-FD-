import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  output: 'standalone',
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Allow access to remote image placeholder.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**', // This allows any path under the hostname
      },
    ],
  },
  transpilePackages: ['motion'],
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/master-dashboard',
        permanent: false,
      },
      {
        source: '/guides',
        destination: '/guide',
        permanent: true,
      },
      {
        source: '/directory',
        destination: '/fd-rates',
        permanent: true,
      },
      {
        source: '/bank-directory',
        destination: '/fd-rates',
        permanent: true,
      },
      {
        source: '/compare',
        destination: '/compare-rates',
        permanent: true,
      },
      {
        source: '/pension',
        destination: '/pension-planner',
        permanent: true,
      },
      {
        source: '/cashflow',
        destination: '/pension-planner',
        permanent: true,
      },
      {
        source: '/tax',
        destination: '/tax-rules-80ttb',
        permanent: true,
      },
      {
        source: '/80ttb',
        destination: '/tax-rules-80ttb',
        permanent: true,
      },
      {
        source: '/tds',
        destination: '/tax-rules-80ttb',
        permanent: true,
      },
    ];
  },
  webpack: (config, {dev}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
