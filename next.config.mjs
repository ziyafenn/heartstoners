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
      {
        source: "/auth/login",
        destination: "/auth",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        hostname: "d15f34w2p8l1cc.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
