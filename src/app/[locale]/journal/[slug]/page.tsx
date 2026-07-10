import { getJournalPost, getJournalPosts, getOptimizedImage } from "@/lib/sanity";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import ShareButtons from "@/components/share-buttons";

type Params = {
    locale: string;
    slug: string;
};

type Props = {
    params: Promise<Params>;
};

const BASE_URL = "https://www.aureldesign.ir";

const toFaNumber = (n: number) =>
    n.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);

const escapeRegex = (str: string) =>
    str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, slug } = (await params) as { locale: "en" | "fa"; slug: string };

    const post = await getJournalPost(slug);
    if (!post) return {};

    const isFa = locale === "fa";
    const title = isFa ? post.title_fa : post.title_en;
    const description = isFa ? post.excerpt_fa : post.excerpt_en;
    const image = getOptimizedImage(post.cover_image, { width: 1200, quality: 80, format: "webp" });
    const currentUrl = `${BASE_URL}/${locale}/journal/${slug}`;

    return {
        title,
        description,
        alternates: {
            canonical: currentUrl,
            languages: {
                fa: `${BASE_URL}/fa/journal/${slug}`,
                en: `${BASE_URL}/en/journal/${slug}`,
                "x-default": `${BASE_URL}/en/journal/${slug}`,
            },
        },
        openGraph: {
            title,
            description,
            type: "article",
            url: currentUrl,
            siteName: "Aurel Jewelry Design Studio",
            images: image ? [image] : [],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: image ? [image] : [],
        },
    };
}

export default async function JournalArticlePage({ params }: Props) {
    const { locale, slug } = (await params) as { locale: "en" | "fa"; slug: string };
    const isFa = locale === "fa";

    const post = await getJournalPost(slug);

    if (!post) {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center">
                {isFa ? "مقاله پیدا نشد" : "Article not found"}
            </main>
        );
    }

    const posts = await getJournalPosts();
    const currentIndex = posts.findIndex((p: any) => {
        const pSlug = typeof p.slug === "string" ? p.slug : p.slug?.current;
        return pSlug === slug;
    });
    const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
    const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

    const currentTitleWords = (isFa ? post.title_fa : post.title_en)
        .toLowerCase()
        .split(/\s+/);

    const related = posts
        .filter((p: any) => {
            const pSlug = typeof p.slug === "string" ? p.slug : p.slug?.current;
            return pSlug !== slug;
        })
        .map((p: any) => {
            const titleWords = (isFa ? p.title_fa : p.title_en)
                .toLowerCase()
                .split(/\s+/);

            const score = titleWords.filter((word: string) =>
                currentTitleWords.includes(word)
            ).length;

            return { ...p, score };
        })
        .sort((a: any, b: any) => b.score - a.score)
        .slice(0, 3);

    const title = isFa ? post.title_fa : post.title_en;
    const description = isFa ? post.excerpt_fa : post.excerpt_en;
    const content = isFa ? post.content_fa : post.content_en || "";
    const imageUrl = getOptimizedImage(post.cover_image, { width: 1200, quality: 80, format: "webp" });

    const plainText = content.replace(/<[^>]+>/g, "");
    const words = plainText.trim().split(/\s+/).length;
    const readingTime = Math.max(1, Math.round(words / 200));

    const headings = [...content.matchAll(/<(h2|h3)[^>]*>(.*?)<\/\1>/gi)]
        .map((match, index) => {
            const level = match[1];
            const text = match[2].replace(/<[^>]+>/g, "").trim();

            const baseId = text
                .toLowerCase()
                .replace(/[^\w\sآ-ی]/g, "")
                .replace(/\s+/g, "-")
                .trim();

            const id = baseId.length > 0 ? `${baseId}-${index}` : `section-${index}`;

            return { level, text, id, index: index + 1 };
        });

    let processedContent = content;

    headings.forEach((h) => {
        const safeText = escapeRegex(h.text);
        const regex = new RegExp(`<${h.level}([^>]*)>${safeText}</${h.level}>`, "i");
        processedContent = processedContent.replace(
            regex,
            `<${h.level} id="${h.id}"$1>${h.text}</${h.level}>`
        );
    });

    // ✅ اصلاح: اضافه کردن drop cap به اولین پاراگراف
    const firstParagraphRegex = /<p>(.*?)<\/p>/i;
    processedContent = processedContent.replace(firstParagraphRegex, (match: string, text: string) => {
        const firstChar = text.charAt(0);
        const rest = text.slice(1);
        return `<p><span class="drop-cap">${firstChar}</span>${rest}</p>`;
    });

    const articleUrl = `${BASE_URL}/${locale}/journal/${slug}`;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": title,
        "description": description,
        "image": imageUrl || `${BASE_URL}/og-image.jpg`,
        "url": articleUrl,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": articleUrl,
        },
        "author": {
            "@type": "Organization",
            "name": "Aurel Design Studio",
            "url": BASE_URL,
        },
        "publisher": {
            "@type": "Organization",
            "name": "Aurel Design Studio",
            "logo": {
                "@type": "ImageObject",
                "url": `${BASE_URL}/icon.svg`,
            },
        },
        "datePublished": post.date_created,
        "dateModified": post.date_created,
        "inLanguage": isFa ? "fa" : "en",
        "wordCount": words,
        "timeRequired": `PT${readingTime}M`,
        "articleSection": isFa ? "طراحی جواهر" : "Jewelry Design",
        "keywords": [
            "luxury jewelry",
            "custom jewelry design",
            "jewelry CAD",
            "3D jewelry modeling",
            "atelier jewelry",
            "jewelry design studio",
        ],
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": isFa ? "خانه" : "Home",
                "item": `${BASE_URL}/${locale}`,
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": isFa ? "مقالات" : "Journal",
                "item": `${BASE_URL}/${locale}/journal`,
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": title,
                "item": articleUrl,
            },
        ],
    };

    return (
        <main className="min-h-screen bg-black text-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

            {/* ✅ استایل‌های سفارشی */}
            <style>{`
                .highlight-active {
                    background: rgba(212, 175, 55, 0.15);
                    transition: background 0.6s ease;
                    padding: 4px 8px;
                    border-radius: 4px;
                }

                .drop-cap {
                    float: left;
                    font-size: 4.5rem;
                    line-height: 0.8;
                    padding-right: 0.5rem;
                    padding-top: 0.25rem;
                    font-weight: 300;
                    background: linear-gradient(135deg, #FFE8A3, #D4AF37);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .journal-prose h2 {
                    font-size: 2rem;
                    font-weight: 300;
                    margin-top: 3rem;
                    margin-bottom: 1.5rem;
                    background: linear-gradient(135deg, #ffffff, #D4AF37);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    padding-bottom: 0.5rem;
                    border-bottom: 1px solid rgba(212, 175, 55, 0.2);
                }

                .journal-prose h3 {
                    font-size: 1.5rem;
                    font-weight: 400;
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                    color: #D4AF37;
                }

                .journal-prose p {
                    font-size: 1.125rem;
                    line-height: 2;
                    color: #e5e5e5;
                    margin-bottom: 1.5rem;
                }

                .journal-prose blockquote {
                    border-left: 3px solid #D4AF37;
                    padding: 1.5rem 2rem;
                    margin: 2.5rem 0;
                    background: rgba(212, 175, 55, 0.05);
                    border-radius: 0 12px 12px 0;
                    font-style: italic;
                    font-size: 1.25rem;
                    color: #FFE8A3;
                }

                .journal-prose ul, .journal-prose ol {
                    margin: 1.5rem 0;
                    padding-left: 2rem;
                }

                .journal-prose li {
                    margin-bottom: 0.75rem;
                    color: #e5e5e5;
                    line-height: 1.8;
                }

                .journal-prose a {
                    color: #D4AF37;
                    text-decoration: underline;
                    text-underline-offset: 4px;
                    transition: color 0.3s;
                }

                .journal-prose a:hover {
                    color: #FFE8A3;
                }

                .journal-prose strong {
                    color: #FFE8A3;
                    font-weight: 500;
                }

                .journal-prose img {
                    border-radius: 16px;
                    margin: 2rem 0;
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in-up {
                    animation: fadeInUp 0.8s ease-out forwards;
                }
            `}</style>

            <script id="toc-highlight" dangerouslySetInnerHTML={{
                __html: `
                document.addEventListener("click", function(e) {
                    const link = e.target.closest('a[data-toc]');
                    if (!link) return;
                    e.preventDefault();
                    const id = link.getAttribute("href").replace("#", "");
                    const el = document.getElementById(id);
                    if (!el) return;
                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                    el.classList.add("highlight-active");
                    setTimeout(() => {
                        el.classList.remove("highlight-active");
                    }, 2000);
                });
            `}} />

            {/* ✅ Hero Section لوکس */}
            <section className="relative overflow-hidden pt-32 pb-16">
                {/* Background Glow */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#D4AF37]/10 blur-[180px]" />
                    <div className="absolute left-0 top-1/3 h-96 w-96 rounded-full bg-white/[0.02] blur-[140px]" />
                    <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-[#D4AF37]/[0.03] blur-[140px]" />
                </div>

                <div className="relative z-10 mx-auto max-w-4xl px-6">
                    {/* Breadcrumb */}
                    <nav className="mb-8 flex items-center gap-2 text-sm">
                        <Link href={`/${locale}`} className="text-[#a3a3a3] hover:text-[#D4AF37] transition-colors">
                            {isFa ? "خانه" : "Home"}
                        </Link>
                        <span className="text-[#D4AF37]">/</span>
                        <Link href={`/${locale}/journal`} className="text-[#a3a3a3] hover:text-[#D4AF37] transition-colors">
                            {isFa ? "مقالات" : "Journal"}
                        </Link>
                        <span className="text-[#D4AF37]">/</span>
                        <span className="text-[#e5e5e5] truncate max-w-xs">
                            {title}
                        </span>
                    </nav>

                    {/* Category Badge */}
                    {post.category && (
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 px-4 py-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                            <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]">
                                {isFa ? post.category_fa || "مقاله" : post.category_en || "Article"}
                            </span>
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="animate-fade-in-up text-4xl font-light leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                        <span className="bg-gradient-to-r from-white via-white to-[#D4AF37] bg-clip-text text-transparent">
                            {title}
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="mt-8 text-lg leading-relaxed text-[#e5e5e5] sm:text-xl">
                        {description}
                    </p>

                    {/* Meta Info */}
                    <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-white/10 pt-8">
                        {/* Author */}
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8B7332]">
                                <span className="text-sm font-medium text-black">A</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">
                                    {isFa ? "استودیو آرل" : "Aurel Studio"}
                                </p>
                                <p className="text-xs text-[#a3a3a3]">
                                    {isFa ? "تیم طراحی" : "Design Team"}
                                </p>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="hidden h-8 w-px bg-white/10 sm:block" />

                        {/* Reading Time */}
                        <div className="flex items-center gap-2 text-sm text-[#a3a3a3]">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>
                                {isFa
                                    ? `${toFaNumber(readingTime)} ${isFa ? "دقیقه مطالعه" : "min read"}`
                                    : `${readingTime} min read`}
                            </span>
                        </div>

                        {/* Divider */}
                        <div className="hidden h-8 w-px bg-white/10 sm:block" />

                        {/* Word Count */}
                        <div className="flex items-center gap-2 text-sm text-[#a3a3a3]">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>
                                {isFa
                                    ? `${toFaNumber(words)} کلمه`
                                    : `${words.toLocaleString()} words`}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ✅ Featured Image */}
            {imageUrl && (
                <section className="relative mx-auto max-w-5xl px-6 pb-16">
                    <div className="relative aspect-video overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
                        <Image
                            src={imageUrl}
                            alt={title}
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, 1024px"
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>
                </section>
            )}

            {/* ✅ Content Section */}
            <article className="relative mx-auto max-w-4xl px-6 pb-24">
                <div className="grid gap-12 lg:grid-cols-[1fr_250px]">
                    {/* Main Content */}
                    <div>
                        {/* Table of Contents */}
                        {headings.length > 0 && (
                            <nav className="mb-16 rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm">
                                <p className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                    </svg>
                                    {isFa ? "فهرست مطالب" : "Contents"}
                                </p>
                                <ul className="space-y-2">
                                    {headings.map((h) => (
                                        <li
                                            key={h.id}
                                            className={h.level === "h3" ? "ml-4" : ""}
                                        >
                                            <a
                                                href={`#${h.id}`}
                                                data-toc
                                                className={`group flex items-center gap-3 transition-colors hover:text-[#D4AF37] ${h.level === "h3" ? "text-sm text-[#a3a3a3]" : "text-base text-[#e5e5e5]"
                                                    }`}
                                            >
                                                <span className="text-xs text-[#D4AF37]/60">
                                                    {String(h.index).padStart(2, "0")}
                                                </span>
                                                <span className="h-px w-4 bg-[#D4AF37]/30 transition-all group-hover:w-8 group-hover:bg-[#D4AF37]" />
                                                <span>{h.text}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        )}

                        {/* Article Content */}
                        <div
                            className="journal-prose mb-16"
                            dangerouslySetInnerHTML={{
                                __html: processedContent,
                            }}
                        />

                        {/* Divider */}
                        <div className="my-12 flex items-center gap-4">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
                            <div className="h-2 w-2 rotate-45 bg-[#D4AF37]" />
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
                        </div>

                        {/* Share Buttons */}
                        <ShareButtons
                            isFa={isFa}
                            shareUrl={`${BASE_URL}/${locale}/journal/${slug}`}
                        />

                        {/* Author Box */}
                        <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-sm">
                            <div className="flex items-start gap-6">
                                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8B7332]">
                                    <span className="text-2xl font-light text-black">A</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
                                        {isFa ? "نوشته شده توسط" : "Written by"}
                                    </p>
                                    <h3 className="mt-2 text-xl font-light text-white">
                                        {isFa ? "استودیو طراحی جواهرات آرل" : "Aurel Jewelry Design Studio"}
                                    </h3>
                                    <p className="mt-3 text-sm leading-relaxed text-[#e5e5e5]">
                                        {isFa
                                            ? "استودیو آرل با بیش از ۱۵ سال تجربه در طراحی و مدلسازی جواهرات، خدمات تخصصی طراحی سه‌بعدی، پرینت رزینی و ریخته‌گری را ارائه می‌دهد."
                                            : "Aurel Studio brings over 15 years of expertise in jewelry design and 3D modeling, offering specialized services in CAD design, resin printing, and casting."}
                                    </p>
                                    <div className="mt-4 flex gap-3">
                                        <Link
                                            href={`/${locale}/about`}
                                            className="text-sm text-[#D4AF37] hover:text-[#FFE8A3] transition-colors"
                                        >
                                            {isFa ? "درباره ما ←" : "About Us →"}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Desktop Only */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-32">
                            {headings.length > 0 && (
                                <nav className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm">
                                    <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
                                        {isFa ? "در این مقاله" : "In this article"}
                                    </p>
                                    <ul className="space-y-2">
                                        {headings.map((h) => (
                                            <li key={h.id}>
                                                <a
                                                    href={`#${h.id}`}
                                                    data-toc
                                                    className={`block text-xs leading-relaxed transition-colors hover:text-[#D4AF37] ${h.level === "h3"
                                                        ? "ml-3 text-[#a3a3a3]"
                                                        : "text-[#e5e5e5]"
                                                        }`}
                                                >
                                                    {h.text}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            )}
                        </div>
                    </aside>
                </div>

                {/* ✅ CTA Section */}
                <section className="mt-24 rounded-3xl border border-[#D4AF37]/20 bg-gradient-to-br from-[#D4AF37]/5 to-transparent p-12 text-center">
                    <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
                        {isFa ? "پروژه‌ای در ذهن دارید؟" : "Have a project in mind?"}
                    </p>
                    <h2 className="text-3xl font-light text-white sm:text-4xl">
                        {isFa ? "بیایید با هم خلق کنیم" : "Let's Create Together"}
                    </h2>
                    <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#e5e5e5]">
                        {isFa
                            ? "از طراحی مفهومی تا تولید نهایی، تیم آرل در کنار شماست. همین حالا با ما تماس بگیرید."
                            : "From conceptual design to final production, the Aurel team is with you. Get in touch today."}
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Link
                            href={`/${locale}/contact`}
                            className="inline-flex items-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37] px-8 py-3 text-sm uppercase tracking-[0.2em] text-black transition-all hover:bg-[#FFE8A3] hover:shadow-[0_0_30px_rgba(212,175,55,0.35)]"
                        >
                            {isFa ? "ثبت سفارش" : "Start Your Project"}
                        </Link>
                        <Link
                            href={`/${locale}/portfolio`}
                            className="inline-flex items-center rounded-full border border-white/20 px-8 py-3 text-sm uppercase tracking-[0.2em] text-white transition-all hover:border-white/40"
                        >
                            {isFa ? "نمونه‌کارها" : "View Portfolio"}
                        </Link>
                    </div>
                </section>

                {/* Prev/Next Navigation */}
                <div className="mt-24 grid gap-6 border-t border-white/10 pt-12 md:grid-cols-2">
                    {prevPost && (
                        <Link
                            href={`/${locale}/journal/${typeof prevPost.slug === "string" ? prevPost.slug : prevPost.slug?.current}`}
                            className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all hover:border-[#D4AF37]/30 hover:bg-white/[0.04]"
                        >
                            <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#D4AF37]">
                                <span>←</span>
                                {isFa ? "مقاله قبلی" : "Previous"}
                            </p>
                            <p className="mt-3 text-lg font-light text-white group-hover:text-[#FFE8A3] transition-colors">
                                {isFa ? prevPost.title_fa : prevPost.title_en}
                            </p>
                        </Link>
                    )}

                    {nextPost && (
                        <Link
                            href={`/${locale}/journal/${typeof nextPost.slug === "string" ? nextPost.slug : nextPost.slug?.current}`}
                            className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-right transition-all hover:border-[#D4AF37]/30 hover:bg-white/[0.04]"
                        >
                            <p className="flex items-center justify-end gap-2 text-xs uppercase tracking-[0.2em] text-[#D4AF37]">
                                {isFa ? "مقاله بعدی" : "Next"}
                                <span>→</span>
                            </p>
                            <p className="mt-3 text-lg font-light text-white group-hover:text-[#FFE8A3] transition-colors">
                                {isFa ? nextPost.title_fa : nextPost.title_en}
                            </p>
                        </Link>
                    )}
                </div>

                {/* Related Articles */}
                {related.length > 0 && (
                    <section className="mt-24">
                        <div className="mb-12 flex items-center gap-4">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D4AF37]/40" />
                            <h2 className="text-2xl font-light text-white">
                                {isFa ? "مقالات مرتبط" : "Related Articles"}
                            </h2>
                            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D4AF37]/40" />
                        </div>

                        <div className="grid gap-8 md:grid-cols-3">
                            {related.map((p: any) => {
                                const relTitle = isFa ? p.title_fa : p.title_en;
                                const relSlug = typeof p.slug === "string" ? p.slug : p.slug?.current;
                                const relImage = getOptimizedImage(p.cover_image, {
                                    width: 600,
                                    quality: 75,
                                    format: "webp"
                                });

                                return (
                                    <Link
                                        key={p._id}
                                        href={`/${locale}/journal/${relSlug}`}
                                        className="group"
                                    >
                                        {relImage && (
                                            <div className="relative mb-4 aspect-video overflow-hidden rounded-2xl border border-white/10">
                                                <Image
                                                    src={relImage}
                                                    alt={relTitle}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 33vw"
                                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                            </div>
                                        )}
                                        <p className="text-sm text-[#e5e5e5] transition-colors group-hover:text-[#D4AF37]">
                                            {relTitle}
                                        </p>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                )}
            </article>
        </main>
    );
}