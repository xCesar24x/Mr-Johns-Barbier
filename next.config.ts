import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  // Reemplaza 'Mr-Johns-Barbier' con el nombre exacto de tu repo si es necesario
  basePath: isProd ? '/Mr-Johns-Barbier' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
