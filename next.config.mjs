import { hostname } from "os";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/deckbuilder/neutral",
        destination: "/deckbuilder",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        hostname: "d15f34w2p8l1cc.cloudfront.net",
      },
      {
        hostname: "cdn.discordapp.com"
      }
    ],
  },
};

export default nextConfig;
