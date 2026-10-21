import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  /**
   * Remote image sources allowed by `next/image`.
   * Supabase access is restricted to public property-image objects.
   */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "tlqxifkyskndndxgeirn.supabase.co",
        pathname: "/storage/v1/object/public/property-images/**",
      },
    ],
  },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
