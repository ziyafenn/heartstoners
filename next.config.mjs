import { hostname } from "os";

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint:{
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "d15f34w2p8l1cc.cloudfront.net",
      },
      {
        hostname: "cdn.discordapp.com"
      },
      {
        hostname: "art.hearthstonejson.com"
      }
    ],
  },
};

export default nextConfig;
