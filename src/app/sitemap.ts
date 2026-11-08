import { MetadataRoute } from 'next';
import { client } from '@/lib/sanity';

function safeDate(dateString: string | null | undefined): Date {
    if (!dateString) return new Date();
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? new Date() : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.aureldesign.ir';

    // ✅ صفحات استاتیک
    const staticPages = [
        { url: `${baseUrl}/en`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
        { url: `${baseUrl}/fa`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
        { url: `${baseUrl}/en/custom-order`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.9 },
        { url: `${baseUrl}/fa/custom-order`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.9 },
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

    // ✅ اصلاح: try-catch برای جلوگیری از crash در build
    let portfolioPages: MetadataRoute.Sitemap = [];
    let journalPages: MetadataRoute.Sitemap = [];

    try {
        const portfolioItems = await client.fetch(
            `*[_type == "portfolio" && status == "published"] { _id, slug, date_created }`
        );

        portfolioPages = portfolioItems.flatMap((item: any) => [
            {
                url: `${baseUrl}/en/portfolio/${item.slug?.current || item._id}`,
                lastModified: safeDate(item.date_created),
                changeFrequency: "monthly" as const,
                priority: 0.6,
            },
            {
                url: `${baseUrl}/fa/portfolio/${item.slug?.current || item._id}`,
                lastModified: safeDate(item.date_created),
                changeFrequency: "monthly" as const,
                priority: 0.6,
            },
        ]);
    } catch (error) {
        console.warn('⚠️ Could not fetch portfolio items for sitemap:', error);
    }

    try {
        const journalPosts = await client.fetch(
            `*[_type == "journal" && status == "published"] {
                _id, slug, date_created, _updatedAt,
                "hasFa": defined(content_fa) && length(content_fa) > 0 && defined(title_fa) && length(title_fa) > 0,
                "hasEn": defined(content_en) && length(content_en) > 0 && defined(title_en) && length(title_en) > 0
            }`
        );

        journalPages = journalPosts.flatMap((item: any) => {
            const slug = item.slug?.current || item._id;
            const faUrl = `${baseUrl}/fa/journal/${slug}`;
            const enUrl = `${baseUrl}/en/journal/${slug}`;
            const lastModified = safeDate(item._updatedAt || item.date_created);

            const languages: Record<string, string> = {};
            if (item.hasFa) languages.fa = faUrl;
            if (item.hasEn) languages.en = enUrl;
            if (item.hasFa || item.hasEn) languages["x-default"] = item.hasEn ? enUrl : faUrl;

            // فقط نسخه‌هایی که محتوای واقعی دارند وارد sitemap می‌شوند
            const entries: MetadataRoute.Sitemap = [];
            if (item.hasEn) {
                entries.push({ url: enUrl, lastModified, changeFrequency: "yearly" as const, priority: 0.5, alternates: { languages } });
            }
            if (item.hasFa) {
                entries.push({ url: faUrl, lastModified, changeFrequency: "yearly" as const, priority: 0.5, alternates: { languages } });
            }
            return entries;
        });
    } catch (error) {
        console.warn('⚠️ Could not fetch journal posts for sitemap:', error);
    }

    return [...staticPages, ...portfolioPages, ...journalPages];
}