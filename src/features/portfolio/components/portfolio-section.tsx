import Image from "next/image";
import Link from "next/link";

type PortfolioItem = {
    id: number;
    slug: string;

    title_en: string;
    title_fa: string;

    featured: boolean;

    cover_image?: string;
};

async function getPortfolioItems(): Promise<PortfolioItem[]> {
    try {
        const res = await fetch(
            `${process.env.DIRECTUS_URL}/items/portfolio?filter[featured][_eq]=true&limit=3`,
            {
                cache: "no-store",
            }
        );

        const data = await res.json();

        return data.data || [];
    } catch (error) {
        console.error("Portfolio fetch error:", error);
        return [];
    }
}

export default async function PortfolioSection({
    locale,
}: {
    locale: string;
}) {
    const items = await getPortfolioItems();

    return (
        <section className="bg-transparent py-20 relative overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10">

                <div className="mb-16 text-center">

                    <h2 className="mb-4 text-4xl font-extralight tracking-[0.2em] text-[#D4AF37] md:text-5xl">
                        {locale === "fa" ? "نمونه کارها" : "PORTFOLIO"}
                    </h2>

                    <p className="text-gray-400">
                        {locale === "fa"
                            ? "برخی از پروژه های انجام شده توسط تیم ما"
                            : "Some of ours latest projects"}
                    </p>

                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

                    {items.map((item) => {

                        const imageUrl = item.cover_image
                            ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${item.cover_image}`
                            : "/placeholder.jpg";

                        const title =
                            locale === "fa"
                                ? item.title_fa
                                : item.title_en;

                        return (
                            <Link
                                key={item.id}
                                href={`/${locale}/portfolio/${item.slug}`}
                                className="
                                    group
                                    relative
                                    block
                                    aspect-[4/5]
                                    overflow-hidden
                                    rounded-[32px]
                                    border
                                    border-white/10
                                    bg-white/5
                                    backdrop-blur-sm
                                    transition-all
                                    duration-500
                                    hover:border-amber-300/40
                                "
                            >
                                <Image
                                    src={imageUrl}
                                    alt={title}
                                    fill
                                    unoptimized
                                    sizes="
                                        (max-width: 768px) 100vw,
                                        (max-width: 1200px) 50vw,
                                        33vw
                                    "
                                    className="
                                        object-cover
                                        transition-transform
                                        duration-700
                                        ease-out
                                        group-hover:scale-105
                                    "
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                                <div className="absolute bottom-0 left-0 z-10 w-full p-8">

                                    <h3 className="mb-2 text-3xl font-light tracking-[0.15em] text-white">
                                        {title}
                                    </h3>

                                </div>
                            </Link>
                        );
                    })}

                </div>

                <div className="mt-16 flex justify-center">

                    <Link
                        href={`/${locale}/portfolio`}
                        className="inline-flex items-center rounded-full border border-[#D4AF37]/40 px-8 py-4 text-sm uppercase tracking-[0.2em] text-[#D4AF37] transition-all duration-300 hover:bg-[#D4AF37] hover:text-black hover:shadow-[0_0_30px_rgba(212,175,55,0.35)]"
                    >
                        {locale === "fa"
                            ? "مشاهده همه پروژه‌ها"
                            : "VIEW FULL PORTFOLIO"}
                    </Link>

                </div>

            </div>
        </section>
    );
}