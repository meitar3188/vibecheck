import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // זה מאפשר להציג תמונות משרתים חיצוניים כמו ויקיפדיה או ספוטיפיי
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: '**.scdn.co', // השרתים של Spotify
      },
    ],
  },
  // הוספת הגדרות אבטחה לאודיו (CORS)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
    ];
  },
};

export default nextConfig;