import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lehlehka.b.goit.study",
      },
    ],
  },
};

export default nextConfig;
