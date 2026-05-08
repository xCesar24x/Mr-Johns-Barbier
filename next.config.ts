import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production' || process.env.GITHUB_ACTIONS === 'true';
const isVercel = process.env.VERCEL === 'true';

const nextConfig: NextConfig = {
  output: isVercel ? undefined : 'export',
  basePath: '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
