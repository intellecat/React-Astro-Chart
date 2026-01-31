import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, '.'),
  transpilePackages: ['@astrologer/react-chart'],
  serverExternalPackages: ['@swisseph/node'],
  webpack: (config, { isServer }) => {
    if (isServer) {
        config.externals.push('@swisseph/node'); 
    }
    config.resolve.alias['@astrologer/react-chart'] = path.resolve(__dirname, '../src/index.ts');
    return config;
  },
};

export default nextConfig;
