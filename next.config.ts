import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  // This tells it where your worker code lives
  swSrc: "app/sw.ts", 
  // This tells it where to output the final file
  swDest: "public/sw.js", 
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "img.clerk.com" },
      { hostname: "utfs.io" },
    ]
  }
};

export default withSerwist(nextConfig);