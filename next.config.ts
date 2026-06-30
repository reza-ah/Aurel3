import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ بهینه‌سازی import برای کاهش bundle size
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@dnd-kit/core",
      "@dnd-kit/sortable",
      "swiper",
      "lenis",
      "react-hook-form",
      "@hookform/resolvers",
    ],
  },

  // ✅ تنظیمات تصاویر
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
    // ✅ فرمت‌های مدرن + کاهش quality
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 روز cache
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // ✅ کاهش quality پیش‌فرض
    quality: 75,
  },

  // ✅ بهینه‌سازی compiler
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error", "warn"],
    } : false,
  },

  // ✅ Security Headers
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
      // ✅ Cache headers برای فایل‌های استاتیک
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // ✅ Cache headers برای تصاویر
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;