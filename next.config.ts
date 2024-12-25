import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
      },
      {
        protocol: "https",
        hostname: "jobfinder-bucket.s3.amazonaws.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
