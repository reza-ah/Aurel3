"use client";

import { useState } from "react";
import Link from "next/link";
import { getAssetUrl } from "@/lib/sanity";

type Props = {
    locale: string;
    categories: any[];
    items: any[];
};

export default function PricingCards({ locale, categories, items }: Props) {
    const isFa = locale === "fa";
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const filteredItems = activeCategory
        ? items.filter((item: any) => {
            const catId =
                typeof item.category === "object" ? item.category?._id : item.category;
            return catId === activeCategory;
        })
        : items;

    return (
        <div dir={isFa ? "rtl" : "ltr"}>
            {/* دسته‌بندی‌ها */}
            <div className="flex flex-wrap gap-3 mb-10">
                <button
                    onClick={() => setActiveCategory(null)}
                    className={`rounded-full border px-5 py-2 text-sm uppercase tracking-[0.2em] transition-all ${activeCategory === null
                        ? "border-[#D4AF37] bg-[#D4AF37] text-black"
                        : "border-white/20 text-white hover:border-[#D4AF37]/50"
                        }`}
                >
                    {isFa ? "همه" : "All"}
                </button>

                {categories.map((category: any) => (
                    <button
                        key={category._id}
                        onClick={() => setActiveCategory(category._id)}
                        className={`rounded-full border px-5 py-2 text-sm uppercase tracking-[0.2em] transition-all ${activeCategory === category._id
                            ? "border-[#D4AF37] bg-[#D4AF37] text-black"
                            : "border-white/20 text-white hover:border-[#D4AF37]/50"
                            }`}
                    >
                        {isFa ? category.title_fa : category.title_en}
                    </button>
                ))}
            </div>

            {/* گرید کارت‌ها */}
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
                {filteredItems.map((item: any) => (
                    <div
                        key={item._id}
                        className="flex flex-col overflow-hidden rounded-[32px] border border-white/10 bg-[#070707]/85 shadow-[0_24px_90px_-40px_rgba(0,0,0,0.8)] transition-all duration-500 hover:-translate-y-2 hover:border-[#d4af37]/30 hover:bg-white/[0.08]"
                    >
                        {item.img && (() => {
                            // ✅ alt هوشمند با fallback چندلایه
                            const rawAlt = isFa ? item.title_fa : item.title_en;
                            const altText = rawAlt?.trim()
                                || (isFa ? item.description_fa : item.description_en)
                                || (isFa ? "خدمات طراحی جواهرات استودیو آرل" : "Aurel Studio jewelry design service");

                            return (
                                <div className="relative overflow-hidden">
                                    <img
                                        src={getAssetUrl(item.img) || "/placeholder.jpg"}
                                        alt={altText}
                                        className="h-56 w-full object-cover"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                                </div>
                            );
                        })()}

                        <div className="flex flex-1 flex-col gap-4 p-8">
                            <h3 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
                                {isFa ? item.title_fa : item.title_en}
                            </h3>

                            <p className="text-base leading-7 text-[#e5e5e5]">
                                {isFa ? item.description_fa : item.description_en}
                            </p>

                            {(item.suitable_fa || item.suitable_en) && (
                                <p className="text-sm text-[#a3a3a3]">
                                    <span className="text-[#D4AF37]">
                                        {isFa ? "مناسب برای: " : "Suitable for: "}
                                    </span>
                                    {isFa ? item.suitable_fa : item.suitable_en}
                                </p>
                            )}

                            <div className="mt-auto flex items-end justify-between gap-4 pt-4 border-t border-white/10">
                                <div>
                                    <span className="block text-xs uppercase tracking-[0.3em] text-[#a3a3a3] mb-1">
                                        {isFa ? "شروع قیمت" : "Starting from"}
                                    </span>
                                    <div className="text-xl font-extralight text-[#d4af37]">
                                        {isFa ? item.price_fa : item.price_en}
                                    </div>
                                </div>

                                <Link
                                    href={`/${locale}/contact`}
                                    className="inline-flex items-center justify-center rounded-full border border-[#D4AF37]/40 px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-[#D4AF37] transition-all hover:bg-[#D4AF37] hover:text-black"
                                >
                                    {isFa ? "ثبت سفارش" : "Order"}
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}