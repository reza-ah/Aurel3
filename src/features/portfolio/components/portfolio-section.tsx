import Link from "next/link";
import { client, getOptimizedImage } from "@/lib/sanity";

async function getFeaturedPortfolioItems() {
    return client.fetch(
        `*[_type == "portfolio" && featured == true && status == "published"] | order(date_created desc)[0...6] {
            _id,
            slug,
            title_en,
            title_fa,
            category_en,
            category_fa,
            cover_image,
            featured
        }`
    );
}

export default async function PortfolioSection({ locale }: { locale: string }) {
    const items = await getFeaturedPortfolioItems();
    const isFa = locale === "fa";

    // ✅ فیلتر کردن آیتم‌های placeholder (Test, Sample, Demo)
    const validItems = (items || []).filter((item: any) => {
        const title = (isFa ? item.title_fa : item.title_en) || "";
        const lowerTitle = title.toLowerCase();
        return !lowerTitle.includes("test") &&
            !lowerTitle.includes("sample") &&
            !lowerTitle.includes("demo") &&
            !lowerTitle.includes("آزمایشی");
    });

    if (validItems.length === 0) {
        return null;
    }

    return (
        <section className="bg-transparent py-20 relative overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10">
                <div className="mb-16 text-center">
                    <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#e5e5e5]">
                        {isFa ? "نمونه‌کارها" : "Portfolio"}
                    </p>
                    <h2 className="text-4xl font-light md:text-5xl text-[#F5F1E8]">
                        {isFa ? "پروژه‌های منتخب" : "Featured Projects"}
                    </h2>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {validItems.map((item: any) => {
                        // ✅ استفاده از getOptimizedImage
                        const imageUrl = getOptimizedImage(item.cover_image, {
                            width: 800,
                            quality: 75,
                            format: "webp"
                        }) || "/placeholder.jpg";

                        const title = isFa ? item.title_fa : item.title_en;
                        const category = isFa ? item.category_fa : item.category_en;

                        return (
                            <Link
                                key={item._id}
                                href={`/${locale}/portfolio/${item.slug?.current || item._id}`}
                                className="group relative overflow-hidden rounded-2xl bg-zinc-900/30 backdrop-blur-sm border border-white/5"
                            >
                                <div className="relative h-80 w-full overflow-hidden">
                                    <img
                                        src={imageUrl}
                                        alt={title}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-6">
                                    <p className="mb-2 text-sm text-[#C6A86A]">{category}</p>
                                    <h3 className="text-xl font-light text-white">{title}</h3>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}