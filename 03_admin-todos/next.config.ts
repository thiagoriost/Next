import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
 /* partialPrefetching: true, */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tailus.io'
      }
    ]
  },
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  /* 
   */
};

export default nextConfig;
