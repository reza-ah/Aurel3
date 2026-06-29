import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://aureldesign.ir'; // دامنه نهایی خود را اینجا بنویسید

    // لیست تمام بخش‌های منو که در تصویر مشخص است
    const routes = [
        '',                  // خانه
        '/portfolio',        // نمونه‌کارها
        '/pricing',          // تعرفه خدمات
        '/contact',          // تماس/سفارش
        '/faq',              // سوالات متداول
        '/about',            // درباره ما
        '/articles',         // مقالات (یا /blog)
    ];

    const sitemapEntries: MetadataRoute.Sitemap = [];

    // تولید خودکار آدرس‌ها برای هر دو زبان فارسی و انگلیسی
    routes.forEach((route) => {
        // مسیرهای فارسی
        sitemapEntries.push({
            url: `${baseUrl}/fa${route}`,
            lastModified: new Date(),
            changeFrequency: route === '/articles' ? 'weekly' : 'monthly', // مقالات ترجیحاً هفتگی آپدیت می‌شوند
            priority: route === '' ? 1.0 : 0.8, // صفحه اصلی بالاترین اولویت را دارد
        });

        // مسیرهای انگلیسی
        sitemapEntries.push({
            url: `${baseUrl}/en${route}`,
            lastModified: new Date(),
            changeFrequency: route === '/articles' ? 'weekly' : 'monthly',
            priority: route === '' ? 1.0 : 0.8,
        });
    });

    return sitemapEntries;
}

