"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { urlFor } from "@/lib/sanity";

type SanityImage = {
    _type: "image";
    asset?: {
        _ref: string;
        _type: "reference";
    };
};

type PortfolioItem = {
    _id: string;
    slug: { current: string } | string;
    title_fa: string;
    title_en: string;
    cover_image?: SanityImage | string;
};

type Props = {
    items: PortfolioItem[];
    locale?: string;
};

// ✅ تابع کمکی برای ساخت URL تصویر Sanity
function getImageUrl(image: SanityImage | string | null | undefined): string | null {
    if (!image) return null;

    try {
        if (typeof image === "string") {
            return urlFor({ _type: "image", asset: { _ref: image } }).width(800).url();
        }

        if (image.asset) {
            return urlFor(image).width(800).url();
        }

        return null;
    } catch {
        return null;
    }
}

// ✅ تابع کمکی برای گرفتن slug
function getSlug(slug: { current: string } | string | undefined): string {
    if (!slug) return "";
    if (typeof slug === "string") return slug;
    return slug.current || "";
}

export default function PortfolioSectionClient({ items, locale = "en" }: Props) {
    const isFa = locale === "fa";

    return (
        <section className="relative px-6 py-24 bg-transparent">
            <div className="mx-auto max-w-7xl">

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center"
                >
                    <h2 className="mb-4 text-4xl font-extralight tracking-[0.2em] text-[#D4AF37] md:text-5xl">
                        PORTFOLIO
                    </h2>

                    {/* ✅ اصلاح: text-gray-400 → text-white/75 */}
                    <p className="text-white/75">
                        {isFa ? "ظرافت بی‌زمان با دقت ساخته شده." : "Timeless luxury crafted with precision."}
                    </p>
                </motion.div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {items.map((item, index) => {
                        // ✅ استفاده از urlFor برای Sanity
                        const imageUrl = getImageUrl(item.cover_image) || "/placeholder.jpg";
                        const slug = getSlug(item.slug);

                        return (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, y: 60 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.8,
                                    delay: index * 0.2,
                                }}
                                viewport={{ once: true }}
                            >
                                <Link
                                    // ✅ اصلاح: لینک به صفحه portfolio item
                                    href={`/${locale}/portfolio/${slug}`}
                                    className="
                                        group
                                        relative
                                        block
                                        aspect-[4/5]
                                        overflow-hidden
                                        rounded-[32px]
                                        border
                                        border-white/10
                                        bg-white/[0.03]
                                        backdrop-blur-sm
                                        transition-all
                                        duration-500
                                        hover:border-amber-300/40
                                    "
                                >
                                    <Image
                                        src={imageUrl}
                                        alt={isFa ? item.title_fa : item.title_en}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                                    <div className="absolute bottom-0 left-0 z-10 w-full p-8">
                                        <h3 className="mb-2 text-3xl font-light tracking-[0.15em] text-white">
                                            {isFa ? item.title_fa : item.title_en}
                                        </h3>
                                        <p className="text-sm uppercase tracking-[0.2em] text-[#e5e5e5]">
                                            {isFa ? "کالکشن لوکس" : "Luxury Collection"}
                                        </p>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}