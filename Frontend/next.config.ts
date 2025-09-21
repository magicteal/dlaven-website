import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add the 'images' configuration here
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
