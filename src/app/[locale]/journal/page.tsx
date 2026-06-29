import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/reveal";
import { getJournalPosts, getAssetUrl } from "@/lib/sanity";

const getCoverId = (cover_image: unknown): string | null => {
    if (!cover_image) return null;
    if (typeof cover_image === "string") return cover_image;
    if (typeof cover_image === "object" && cover_image !== null && "id" in cover_image) {
        return (cover_image as { id: string }).id ?? null;
    }
    return null;
};

export default async function JournalPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = (await params) as { locale: "en" | "fa" };
    const isFa = locale === "fa";
    const posts = await getJournalPosts();

    return (
        <section dir={isFa ? "rtl" : "ltr"} className="relative overflow-hidden px-6 py-28">
            <div className="relative z-10 mx-auto max-w-7xl">
                <Reveal>
                    <div className="mx-auto mb-20 max-w-3xl text-center">
                        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
                            {isFa ? "ژورنال برند" : "Brand Journal"}
                        </p>
                        <h1 className="text-4xl font-light leading-tight text-white sm:text-5xl md:text-6xl">
                            {isFa ? "مقالات و الهام‌ها" : "Stories & Insights"}
                        </h1>
                        <p className="mt-6 text-base leading-8 text-gray-400">
                            {isFa
                                ? "نگاهی به فرآیند طراحی جواهرات، الهامات و داستان‌های شکل‌گیری هر قطعه."
                                : "A closer look at jewelry craftsmanship, design inspiration, and the stories behind each piece."}
                        </p>
                    </div>
                </Reveal>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post: any, index: number) => {
                        const title = locale === "fa" ? post.title_fa : post.title_en;
                        const excerpt = locale === "fa" ? post.excerpt_fa : post.excerpt_en;
                        const coverId = getCoverId(post.cover_image);
                        const image = coverId ? getAssetUrl(coverId) : "/images/jewel-1.jpg";
                        return (
                            <Reveal key={post.id} delay={index * 0.08}>
                                <Link
                                    href={`/${locale}/journal/${post.slug}`}
                                    className="group flex h-full flex-col overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-sm"
                                >
                                    <div className="relative h-[420px] overflow-hidden">
                                        <Image
                                            src={image || "/images/jewel-1.jpg"}
                                            alt={title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                        <div className="absolute inset-0 bg-[#D4AF37]/0 transition-colors duration-500 group-hover:bg-[#D4AF37]/10" />
                                    </div>
                                    <div className="flex flex-1 flex-col p-8">
                                        <h2 className="text-2xl font-light text-white">{title}</h2>
                                        {excerpt && (
                                            <p className="mt-4 text-sm leading-7 text-gray-400 line-clamp-3">{excerpt}</p>
                                        )}
                                        <span className="mt-auto pt-8 inline-flex items-center text-sm uppercase tracking-[0.2em] text-[#D4AF37] transition-all duration-300 group-hover:translate-x-1">
                                            {isFa ? "مطالعه مقاله" : "Read Article"}
                                        </span>
                                    </div>
                                </Link>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
