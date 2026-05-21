/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['nexoreui'],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
