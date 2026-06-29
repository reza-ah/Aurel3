import { getJournalPost, getJournalPosts } from "@/lib/sanity";
import { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import ShareButtons from "@/components/share-buttons";

type Params = {
    locale: string;
    slug: string;
};

// ۱. به‌روزرسانی تایپ کامپوننت برای سازگاری با پرامیس در Next.js جدید
type Props = {
    params: Promise<Params>;
};

const toFaNumber = (n: number) =>
    n.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);

const escapeRegex = (str: string) =>
    str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ✅ helper برای normalize کردن cover_image (هم string هم object)
const getCoverId = (cover_image: unknown): string | null => {
    if (!cover_image) return null;
    if (typeof cover_image === "string") return cover_image;
    if (typeof cover_image === "object" && cover_image !== null && "id" in cover_image) {
        return (cover_image as { id: string }).id ?? null;
    }
    return null;
};

/* =========================
    SEO METADATA
========================= */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    // منتظر ماندن برای حل شدن پرامیسِ params
    const { locale, slug } = (await params) as { locale: "en" | "fa"; slug: string };

    const post = await getJournalPost(slug);
    if (!post) return {};

    const isFa = locale === "fa";

    const title = isFa ? post.title_fa : post.title_en;
    const description = isFa ? post.excerpt_fa : post.excerpt_en;

    const coverId = getCoverId(post.cover_image);
    const image = coverId
        ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${coverId}`
        : null;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "article",
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

/* =========================
    PAGE
========================= */

export default async function JournalArticlePage({ params }: Props) {
    // منتظر ماندن برای حل شدن پرامیسِ params و تبدیل ایمن تایپ
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

    const currentIndex = posts.findIndex((p: any) => p.slug === slug);
    const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
    const nextPost =
        currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

    /* =========================
        AUTOMATIC RELATED ARTICLES
        (based on title similarity)
     ========================= */

    const currentTitleWords = (
        isFa ? post.title_fa : post.title_en
    )
        .toLowerCase()
        .split(/\s+/);

    const related = posts
        .filter((p: any) => p.slug !== slug)
        .map((p: any) => {
            const titleWords = (
                isFa ? p.title_fa : p.title_en
            )
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

    // ✅ fix: از getCoverId استفاده می‌کنه — هم string هم object رو handle می‌کنه
    const coverId = getCoverId(post.cover_image);
    const imageUrl = coverId
        ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${coverId}`
        : null;

    const plainText = content.replace(/<[^>]+>/g, "");
    const words = plainText.trim().split(/\s+/).length;
    const readingTime = Math.max(1, Math.round(words / 200));

    // ۲. حل قطعی مشکل تایپ با جایگزینی [...] به جای Array.from
    const headings = [...content.matchAll(/<(h2|h3)[^>]*>(.*?)<\/\1>/gi)]
        .map((match, index) => {
            const level = match[1];
            const text = match[2].replace(/<[^>]+>/g, "").trim();

            const baseId = text
                .toLowerCase()
                .replace(/[^\w\sآ-ی]/g, "") // پشتیبانی هم‌زمان از کاراکترهای فارسی و انگلیسی
                .replace(/\s+/g, "-")
                .trim();

            const id = baseId.length > 0 ? `${baseId}-${index}` : `section-${index}`;

            return { level, text, id };
        });

    let processedContent = content;

    headings.forEach((h) => {
        const safeText = escapeRegex(h.text);

        const regex = new RegExp(
            `<${h.level}([^>]*)>${safeText}</${h.level}>`,
            "i"
        );

        processedContent = processedContent.replace(
            regex,
            `<${h.level} id="${h.id}"$1>${h.text}</${h.level}>`
        );
    });

    const articleUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/journal/${post.slug}`;

    /* =========================
        FULL SEO ARTICLE SCHEMA
     ========================= */

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",

        headline: title,
        description: description,
        image: imageUrl,

        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": articleUrl,
        },

        author: {
            "@type": "Organization",
            "@name": "Atelier",
        },

        publisher: {
            "@type": "Organization",
            "name": "Atelier",
            "logo": {
                "@type": "ImageObject",
                "url": `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
            },
        },

        datePublished: post.date_created,
        dateModified: post.date_created,

        inLanguage: locale,

        wordCount: words,

        timeRequired: `PT${readingTime}M`,

        articleSection: "Jewelry",

        keywords: [
            "luxury jewelry",
            "custom jewelry design",
            "engagement ring",
            "atelier jewelry",
        ],
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: isFa ? "خانه" : "Home",
                item: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}`,
            },
            {
                "@type": "ListItem",
                position: 2,
                name: isFa ? "مقالات" : "Journal",
                item: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/journal`,
            },
            {
                "@type": "ListItem",
                position: 3,
                name: title,
                item: articleUrl,
            },
        ],
    };

    return (
        <main className="min-h-screen bg-black text-white">

            <Script
                id="article-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <Script
                id="breadcrumb-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

            <style>{`
        .highlight-active{
          background:rgba(250,204,21,0.15);
          transition:background 0.6s ease;
          padding:4px;
          border-radius:4px;
        }
      `}</style>

            <Script id="toc-highlight" strategy="afterInteractive">
                {`
        document.addEventListener("click",function(e){

          const link = e.target.closest('a[data-toc]');
          if(!link) return;

          e.preventDefault();

          const id = link.getAttribute("href").replace("#","");
          const el = document.getElementById(id);

          if(!el) return;

          el.scrollIntoView({behavior:"smooth",block:"center"});

          el.classList.add("highlight-active");

          setTimeout(()=>{
            el.classList.remove("highlight-active");
          },2000);

        });
        `}
            </Script>

            <article className="max-w-3xl mx-auto px-6 py-24">

                <nav className="text-sm text-neutral-500 mb-6">
                    <ol className="flex items-center gap-2">

                        <li>
                            <Link href={`/${locale}`} className="hover:underline">
                                {isFa ? "خانه" : "Home"}
                            </Link>
                        </li>

                        <li>/</li>

                        <li>
                            <Link href={`/${locale}/journal`} className="hover:underline">
                                {isFa ? "مقالات" : "Journal"}
                            </Link>
                        </li>

                        <li>/</li>

                        <li className="text-neutral-300 font-medium">
                            {title}
                        </li>

                    </ol>
                </nav>

                <h1 className="text-4xl md:text-6xl font-light mb-6">
                    {title}
                </h1>

                <p className="text-sm text-neutral-400 mb-10">
                    {isFa
                        ? `${toFaNumber(readingTime)} دقیقه مطالعه`
                        : `${readingTime} min read`}
                </p>

                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full mb-12"
                    />
                )}

                {headings.length > 0 && (
                    <nav className="mb-16 border border-neutral-800 p-6">

                        <p className="text-sm text-neutral-400 mb-4">
                            {isFa ? "فهرست مقاله" : "Table of Contents"}
                        </p>

                        <ul className="space-y-2">

                            {headings.map((h) => (
                                <li
                                    key={h.id}
                                    className={h.level === "h3" ? "ml-4 text-sm" : ""}
                                >
                                    <a
                                        href={`#${h.id}`}
                                        data-toc
                                        className="hover:text-neutral-300"
                                    >
                                        {h.text}
                                    </a>
                                </li>
                            ))}

                        </ul>

                    </nav>
                )}

                <div
                    className="prose prose-invert max-w-none mb-24"
                    dangerouslySetInnerHTML={{
                        __html: processedContent,
                    }}
                />

                <ShareButtons
                    isFa={isFa}
                    shareUrl={`${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/journal/${slug}`}
                />

                <div className="grid grid-cols-2 gap-6 border-t border-neutral-800 pt-12 mb-24">

                    {prevPost && (
                        <Link
                            href={`/${locale}/journal/${prevPost.slug}`}
                            className="text-neutral-400 hover:text-white"
                        >
                            ← {isFa ? "مقاله قبلی" : "Previous Article"}
                            <p className="text-white mt-2">
                                {isFa ? prevPost.title_fa : prevPost.title_en}
                            </p>
                        </Link>
                    )}

                    {nextPost && (
                        <Link
                            href={`/${locale}/journal/${nextPost.slug}`}
                            className="text-right text-neutral-400 hover:text-white"
                        >
                            {isFa ? "مقاله بعدی" : "Next Article"} →
                            <p className="text-white mt-2">
                                {isFa ? nextPost.title_fa : nextPost.title_en}
                            </p>
                        </Link>
                    )}

                </div>

                {related.length > 0 && (
                    <section>

                        <h2 className="text-2xl font-light mb-8">
                            {isFa ? "مقالات مرتبط" : "Related Articles"}
                        </h2>

                        <div className="grid md:grid-cols-3 gap-8">

                            {related.map((p: any) => {

                                const relTitle = isFa ? p.title_fa : p.title_en;

                                // ✅ fix: از getCoverId استفاده می‌کنه
                                const relCoverId = getCoverId(p.cover_image);
                                const relImage = relCoverId
                                    ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${relCoverId}`
                                    : null;

                                return (
                                    <Link
                                        key={p.slug}
                                        href={`/${locale}/journal/${p.slug}`}
                                        className="group"
                                    >

                                        {relImage && (
                                            <img
                                                src={relImage}
                                                alt={relTitle}
                                                className="mb-4 group-hover:opacity-80 transition"
                                            />
                                        )}

                                        <p className="text-sm text-neutral-300 group-hover:text-white">
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
