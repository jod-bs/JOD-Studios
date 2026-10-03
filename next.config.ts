import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: { formats: ["image/avif", "image/webp"], remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }] },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.html$/,
      resourceQuery: /raw/,
      type: "asset/source",
    });
    return config;
  },
};
export default nextConfig;
