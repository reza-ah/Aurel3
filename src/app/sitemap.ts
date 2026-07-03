import { MetadataRoute } from 'next';
import { client } from '@/lib/sanity';

// ✅ تابع کمکی برای جلوگیری از crash در صورت null بودن date_created
function safeDate(dateString: string | null | undefined): Date {
    if (!dateString) return new Date();
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? new Date() : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.aureldesign.ir';

    // صفحات استاتیک
    const staticPages = [
        { url: `${baseUrl}/en`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
        { url: `${baseUrl}/fa`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
        { url: `${baseUrl}/en/portfolio`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
        { url: `${baseUrl}/fa/portfolio`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
        { url: `${baseUrl}/en/journal`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
        { url: `${baseUrl}/fa/journal`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
        { url: `${baseUrl}/en/pricing`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
        { url: `${baseUrl}/fa/pricing`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
        { url: `${baseUrl}/en/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
        { url: `${baseUrl}/fa/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
        { url: `${baseUrl}/en/faq`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
        { url: `${baseUrl}/fa/faq`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
        { url: `${baseUrl}/en/about`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.4 },
        { url: `${baseUrl}/fa/about`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.4 },
    ];

    // صفحات پویا از Sanity
    const portfolioItems = await client.fetch(
        `*[_type == "portfolio" && status == "published"] { _id, slug, date_created }`
    );

    const journalPosts = await client.fetch(
        `*[_type == "journal" && status == "published"] { _id, slug, date_created }`
    );

    const portfolioPages = portfolioItems.flatMap((item: any) => [
        {
            url: `${baseUrl}/en/portfolio/${item.slug?.current || item._id}`,
            lastModified: safeDate(item.date_created),  // ✅ اصلاح
            changeFrequency: "monthly" as const,
            priority: 0.6,
        },
        {
            url: `${baseUrl}/fa/portfolio/${item.slug?.current || item._id}`,
            lastModified: safeDate(item.date_created),  // ✅ اصلاح
            changeFrequency: "monthly" as const,
            priority: 0.6,
        },
    ]);

    const journalPages = journalPosts.flatMap((item: any) => [
        {
            url: `${baseUrl}/en/journal/${item.slug?.current || item._id}`,
            lastModified: safeDate(item.date_created),  // ✅ اصلاح
            changeFrequency: "yearly" as const,
            priority: 0.5,
        },
        {
            url: `${baseUrl}/fa/journal/${item.slug?.current || item._id}`,
            lastModified: safeDate(item.date_created),  // ✅ اصلاح
            changeFrequency: "yearly" as const,
            priority: 0.5,
        },
    ]);

    return [...staticPages, ...portfolioPages, ...journalPages];
}