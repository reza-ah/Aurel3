import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: `
                            default-src 'self';
                            script-src 'self' 'unsafe-inline' 'unsafe-eval';
                            style-src 'self' 'unsafe-inline';
                            img-src 'self' data: blob: https://cdn.sanity.io https:;
                            font-src 'self' data:;
                            connect-src 'self' https://cdn.sanity.io https://api.sanity.io https:;
                            media-src 'self' blob: data: https://cdn.sanity.io;
                            frame-ancestors 'none';
                        `.replace(/\s{2,}/g, " ").trim(),
          },
        ],
      },
    ];
  },

};

export default nextConfig;
