/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        tls: false,
        fs: false,
        net: false,
        dns: false,
        child_process: false,
      };
    }
    return config;
  },
};

export default nextConfig;
