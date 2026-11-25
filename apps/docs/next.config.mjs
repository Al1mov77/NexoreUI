/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  devIndicators: false,
  transpilePackages: ['nexoreui'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizePackageImports: ['nexoreui', 'lucide-react', 'framer-motion'],
  },
  async redirects() {
    return [
      {
        source: '/docs/installation',
        destination: '/create',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

