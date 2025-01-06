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
        hostname: "jobfinder-storage.s3.us-west-2.amazonaws.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
