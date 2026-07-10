import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/reveal";
import { getJournalPosts, getOptimizedImage } from "@/lib/sanity";
import type { Metadata } from "next";

const BASE_URL = "https://www.aureldesign.ir";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const isFa = locale === "fa";
    const currentUrl = `${BASE_URL}/${locale}/journal`;

    return {
        title: isFa
            ? "مقالات و مجله | استودیو طراحی جواهرات آرل"
            : "Journal | Aurel Jewelry Design Studio",
        description: isFa
            ? "مقالات تخصصی درباره طراحی جواهرات، الهام‌بخشی در طراحی و داستان پشت هر قطعه"
            : "Insights into jewelry craftsmanship, design inspiration, and the stories behind each piece",
        alternates: {
            canonical: currentUrl,
            languages: {
                fa: `${BASE_URL}/fa/journal`,
                en: `${BASE_URL}/en/journal`,
                "x-default": `${BASE_URL}/en/journal`,
            },
        },
        openGraph: {
            title: isFa ? "مقالات و مجله | استودیو آرل" : "Journal | Aurel Design Studio",
            description: isFa
                ? "مقالات تخصصی درباره طراحی جواهرات"
                : "Insights into jewelry craftsmanship and design",
            url: currentUrl,
            siteName: "Aurel Jewelry Design Studio",
            type: "website",
        },
    };
}

const getSlug = (slug: any): string => {
    if (!slug) return "";
    if (typeof slug === "string") return slug;
    return slug.current || "";
};

export default async function JournalPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = (await params) as { locale: "en" | "fa" };
    const isFa = locale === "fa";
    const posts = await getJournalPosts();

    // ✅ اصلاح: تقسیم به featured و regular
    const featuredPosts = posts.slice(0, 1);
    const regularPosts = posts.slice(1);

    return (
        <section dir={isFa ? "rtl" : "ltr"} className="relative overflow-hidden bg-black px-6 py-28">
            {/* Background Glow */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#D4AF37]/5 blur-[180px]" />
                <div className="absolute left-0 top-1/3 h-96 w-96 rounded-full bg-white/[0.02] blur-[140px]" />
                <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-[#D4AF37]/[0.03] blur-[140px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl">
                {/* Header */}
                <Reveal>
                    <div className="mx-auto mb-20 max-w-3xl text-center">
                        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
                            {isFa ? "مقالات " : "Brand Journal"}
                        </p>
                        <h1 className="text-4xl font-light leading-tight text-white sm:text-5xl md:text-6xl">
                            <span className="bg-gradient-to-r from-white via-white to-[#D4AF37] bg-clip-text text-transparent">
                                {isFa ? "مقالات و یادداشتها" : "Stories & Insights"}
                            </span>
                        </h1>
                        <p className="mt-6 text-base leading-8 text-[#e5e5e5]">
                            {isFa
                                ? "نگاهی به فرآیند طراحی تا تولید جواهرات"
                                : "A closer look at jewelry craftsmanship, design inspiration, and the stories behind each piece."}
                        </p>
                    </div>
                </Reveal>

                {/* ✅ Featured Article (First Post) */}
                {featuredPosts.length > 0 && (
                    <Reveal>
                        <div className="mb-16">
                            {featuredPosts.map((post: any) => {
                                const title = isFa ? post.title_fa : post.title_en;
                                const excerpt = isFa ? post.excerpt_fa : post.excerpt_en;
                                const image = getOptimizedImage(post.cover_image, {
                                    width: 1200,
                                    quality: 80,
                                    format: "webp"
                                }) || "/images/jewel-1.jpg";
                                const slug = getSlug(post.slug);

                                return (
                                    <Link
                                        key={post._id}
                                        href={`/${locale}/journal/${slug}`}
                                        className="group relative block overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-sm transition-all duration-500 hover:border-[#D4AF37]/30"
                                    >
                                        <div className="grid gap-0 lg:grid-cols-2">
                                            {/* Image */}
                                            <div className="relative h-[400px] overflow-hidden lg:h-[500px]">
                                                <Image
                                                    src={image}
                                                    alt={title}
                                                    fill
                                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                                    priority
                                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent lg:bg-gradient-to-r" />
                                            </div>

                                            {/* Content */}
                                            <div className="flex flex-col justify-center p-8 lg:p-12">
                                                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 px-4 py-1.5">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                                                    <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]">
                                                        {isFa ? "مقاله ویژه" : "Featured"}
                                                    </span>
                                                </div>

                                                <h2 className="text-3xl font-light leading-tight text-white transition-colors group-hover:text-[#FFE8A3] lg:text-4xl">
                                                    {title}
                                                </h2>

                                                {excerpt && (
                                                    <p className="mt-6 text-base leading-8 text-[#e5e5e5] line-clamp-4">
                                                        {excerpt}
                                                    </p>
                                                )}

                                                <div className="mt-8 flex items-center gap-4">
                                                    <span className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-[#D4AF37] transition-all duration-300 group-hover:gap-3">
                                                        {isFa ? "ادامه مطلب" : "Read More"}
                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isFa ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                                                        </svg>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </Reveal>
                )}

                {/* ✅ Regular Articles Grid */}
                {regularPosts.length > 0 && (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {regularPosts.map((post: any, index: number) => {
                            const title = isFa ? post.title_fa : post.title_en;
                            const excerpt = isFa ? post.excerpt_fa : post.excerpt_en;
                            const image = getOptimizedImage(post.cover_image, {
                                width: 800,
                                quality: 75,
                                format: "webp"
                            }) || "/images/jewel-1.jpg";
                            const slug = getSlug(post.slug);

                            return (
                                <Reveal key={post._id} delay={index * 0.08}>
                                    <Link
                                        href={`/${locale}/journal/${slug}`}
                                        className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-sm transition-all duration-500 hover:border-[#D4AF37]/30 hover:bg-white/[0.04]"
                                    >
                                        {/* Image */}
                                        <div className="relative h-[320px] overflow-hidden">
                                            <Image
                                                src={image}
                                                alt={title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                            <div className="absolute inset-0 bg-[#D4AF37]/0 transition-colors duration-500 group-hover:bg-[#D4AF37]/10" />
                                        </div>

                                        {/* Content */}
                                        <div className="flex flex-1 flex-col p-8">
                                            <h2 className="text-2xl font-light leading-tight text-white transition-colors group-hover:text-[#FFE8A3]">
                                                {title}
                                            </h2>

                                            {excerpt && (
                                                <p className="mt-4 text-sm leading-7 text-[#e5e5e5] line-clamp-3">
                                                    {excerpt}
                                                </p>
                                            )}

                                            <div className="mt-auto pt-6">
                                                <span className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-[#D4AF37] transition-all duration-300 group-hover:gap-3">
                                                    {isFa ? "مشاهده مقاله" : "Read Article"}
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isFa ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </Reveal>
                            );
                        })}
                    </div>
                )}

                {/* Empty State */}
                {posts.length === 0 && (
                    <div className="py-24 text-center">
                        <p className="text-lg text-[#a3a3a3]">
                            {isFa ? "هنوز مقاله‌ای منتشر نشده است" : "No articles published yet"}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}