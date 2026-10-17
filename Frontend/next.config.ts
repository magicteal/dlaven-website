import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    qualities: [75, 95],
    deviceSizes: [320, 420, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  async redirects() {
    return [
      {
        source: "/dlaven-limited",
        destination: "/dl-fantome",
        permanent: true,
      },
      {
        source: "/dlaven-limited/:slug*",
        destination: "/dl-fantome/:slug*",
        permanent: true,
      },
      {
        source: "/fantome",
        destination: "/dl-fantome",
        permanent: false,
      },
      {
        source: "/fantome/:slug*",
        destination: "/dl-fantome/:slug*",
        permanent: false,
      },
      {
        source: "/dl-fantom",
        destination: "/dl-fantome",
        permanent: false,
      },
      {
        source: "/dl-fantom/:slug*",
        destination: "/dl-fantome/:slug*",
        permanent: false,
      },
      {
        source: "/dl-barry",
        destination: "/dl-berry",
        permanent: true,
      },
      {
        source: "/dl-barry/:slug*",
        destination: "/dl-berry/:slug*",
        permanent: true,
      },
      {
        source: "/barry",
        destination: "/dl-berry",
        permanent: false,
      },
      {
        source: "/barry/:slug*",
        destination: "/dl-berry/:slug*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
