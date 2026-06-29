import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  {
    key: "Content-Security-Policy",
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: blob: http://127.0.0.1:8055 http://localhost:8055 https:;
      font-src 'self' data:;
      connect-src 'self' http://127.0.0.1:8055 http://localhost:8055 https:;
      media-src 'self' blob: data: http://127.0.0.1:8055 http://localhost:8055;
      frame-ancestors 'none';
      base-uri 'self';
      form-action 'self';
    `.replace(/\s{2,}/g, " ").trim(),
  },
];

const nextConfig: NextConfig = {

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    optimizePackageImports: [
      "react-hook-form",
      "zod",
      "@hookform/resolvers",
      "framer-motion",
      "lucide-react",
      "react-icons",
    ],
  },
  images: {
    unoptimized: false,
    formats: ["image/webp", "image/avif"],
    remotePatterns: [
      { protocol: "http", hostname: "127.0.0.1", port: "8055", pathname: "/assets/**" },
      { protocol: "http", hostname: "localhost", port: "8055", pathname: "/assets/**" },
      { protocol: "https", hostname: "aureldesign.ir", pathname: "/cms-assets/**" },
    ],
  },
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
    ];
  },
};

export default nextConfig;
