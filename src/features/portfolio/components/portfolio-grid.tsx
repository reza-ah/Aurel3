"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getOptimizedImage } from "@/lib/sanity";

type Props = {
    locale: string;
    items: any[];
};

function slugify(input: string) {
    return input
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-");
}

export default function PortfolioGrid({ locale, items }: Props) {
    const isFa = locale === "fa";
    const [activeTags, setActiveTags] = useState<string[]>([]);

    const ITEMS_PER_PAGE = 6;
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

    const loadMoreRef = useRef<HTMLDivElement>(null);

    const toggleTag = (slug: string) => {
        setActiveTags((prev) =>
            prev.includes(slug)
                ? prev.filter((t) => t !== slug)
                : [...prev, slug]
        );
    };

    const normalizeTag = (tag: any) => {
        if (!tag) return null;

        const title_fa = tag.name_fa || "";
        const title_en = tag.name_en || "";

        if (!title_fa && !title_en) return null;

        const slug = tag._id || slugify(title_en || title_fa);

        return {
            id: tag._id,
            slug,
            title: isFa ? title_fa || title_en : title_en || title_fa,
        };
    };

    const allTags = useMemo(() => {
        const map = new Map();
        items.forEach((item) => {
            (item.tags || []).forEach((relation: any) => {
                const tag = normalizeTag(relation);
                if (!tag) return;
                if (!tag.slug || !tag.title) return;
                map.set(tag.slug, tag);
            });
        });
        return Array.from(map.values());
    }, [items, isFa]);

    const filteredItems = useMemo(() => {
        if (activeTags.length === 0) return items;
        return items.filter((item) => {
            const slugs = (item.tags || [])
                .map(normalizeTag)
                .filter(Boolean)
                .map((t: any) => t.slug);
            return activeTags.some((tag) => slugs.includes(tag));
        });
    }, [items, activeTags]);

    useEffect(() => {
        setVisibleCount(ITEMS_PER_PAGE);
    }, [activeTags]);

    const displayedItems = useMemo(() => {
        return filteredItems.slice(0, visibleCount);
    }, [filteredItems, visibleCount]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && visibleCount < filteredItems.length) {
                    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
                }
            },
            { threshold: 0.1, rootMargin: "200px" }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [filteredItems.length, visibleCount]);

    return (
        <div>
            {/* FILTER BAR */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
                <button
                    onClick={() => setActiveTags([])}
                    className={`
                        px-6 h-11 rounded-full border text-sm tracking-[0.2em] uppercase
                        transition-all duration-300
                        ${activeTags.length === 0
                            ? "bg-[#d4af37] text-black border-[#d4af37]"
                            : "border-white/10 text-zinc-300 hover:border-[#d4af37] hover:text-[#d4af37]"
                        }
                    `}
                >
                    {isFa ? "همه" : "All"}
                </button>

                {allTags.map((tag) => (
                    <button
                        key={tag.slug}
                        onClick={() => toggleTag(tag.slug)}
                        className={`
                            px-6 h-11 rounded-full border text-sm tracking-[0.2em] uppercase
                            transition-all duration-300
                            ${activeTags.includes(tag.slug)
                                ? "bg-[#d4af37] text-black border-[#d4af37]"
                                : "border-white/10 text-zinc-300 hover:border-[#d4af37] hover:text-[#d4af37]"
                            }
                        `}
                    >
                        {tag.title}
                    </button>
                ))}
            </div>

            {/* EMPTY STATE */}
            {filteredItems.length === 0 && (
                <div className="text-center py-24 text-zinc-500">
                    {isFa ? "پروژه‌ای یافت نشد" : "No projects found"}
                </div>
            )}

            {/* GRID */}
            <motion.div layout className="grid md:grid-cols-3 xl:grid-cols-3 gap-8">
                <AnimatePresence>
                    {displayedItems.map((item, index) => {
                        const title = isFa ? item.title_fa : item.title_en;
                        const category = isFa ? item.category_fa : item.category_en;
                        const imageUrl = getOptimizedImage(item.cover_image, {
                            width: 900,
                            quality: 75,
                            format: "webp"
                        }) || "/placeholder.jpg";

                        return (
                            <motion.div
                                key={item._id || item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.92 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.92 }}
                                transition={{ duration: 0.35 }}
                            >
                                <Link href={`/${locale}/portfolio/${item.slug?.current || item.slug}`} className="group block">
                                    <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-zinc-900/30 backdrop-blur-sm border border-white/5">
                                        <Image
                                            src={imageUrl}
                                            alt={title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            priority={index < 3}
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                                        <div className="absolute bottom-0 left-0 right-0 p-6">
                                            <p className="text-zinc-300 text-sm mb-2">{category}</p>
                                            <h2 className="text-2xl font-light mb-4">{title}</h2>

                                            <div className="flex flex-wrap gap-2">
                                                {(item.tags || []).map((relation: any, i: number) => {
                                                    const tag = normalizeTag(relation);
                                                    if (!tag) return null;

                                                    return (
                                                        <span
                                                            key={i}
                                                            className="text-[10px] uppercase tracking-[0.2em] border border-white/20 px-3 py-1 rounded-full text-zinc-300"
                                                        >
                                                            {tag.title}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </motion.div>

            {/* سنسور تشخیص اسکرول به انتهای صفحه */}
            <div ref={loadMoreRef} className="h-10 w-full clear-both" />
        </div>
    );
}