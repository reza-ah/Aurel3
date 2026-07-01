"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Reveal from "@/components/reveal";
import { getAssetUrl } from "@/lib/sanity";

type Props = {
    locale: string;
    categories: any[];
    items: any[];
};

export default function PricingAccordion({
    locale,
    categories,
    items,
}: Props) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const isFa = locale === "fa";

    return (
        <div className="space-y-4">

            {categories.map((category: any, index: number) => {

                const categoryItems = items.filter((item: any) => {
                    const catId =
                        typeof item.category === "object"
                            ? item.category?._id
                            : item.category;

                    return catId === category._id;
                });

                const isOpen = openIndex === index;

                return (
                    <div
                        key={category._id}
                        className="group border-b border-white/5 last:border-none"
                    >
                        {/* HEADER */}
                        <button
                            onClick={() =>
                                setOpenIndex(isOpen ? null : index)
                            }
                            className="flex w-full items-center justify-between py-10 transition-all hover:text-[#d4af37] group-hover:px-4"
                        >
                            <div className="flex flex-col items-start gap-2">
                                <span className="text-[10px] tracking-[0.35em] text-[#d4af37] opacity-0 transition group-hover:opacity-100">
                                    0{index + 1}
                                </span>

                                <h2
                                    className={`text-2xl md:text-4xl font-light transition ${isOpen
                                        ? "text-[#d4af37]"
                                        : "text-white/95"
                                        }`}
                                >
                                    {isFa
                                        ? category.title_fa
                                        : category.title_en}
                                </h2>
                            </div>

                            <div className="relative h-6 w-6">
                                <span
                                    className={`absolute left-0 top-1/2 h-[1px] w-full bg-white transition ${isOpen ? "opacity-0" : ""
                                        }`}
                                />

                                <span
                                    className={`absolute left-0 top-1/2 h-[1px] w-full rotate-90 bg-white transition ${isOpen ? "rotate-0" : ""
                                        }`}
                                />
                            </div>
                        </button>

                        {/* BODY */}
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="overflow-hidden"
                                >
                                    <div className="pb-12 pt-2">
                                        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
                                            {categoryItems.map((item: any) => (
                                                <div
                                                    key={item._id}
                                                    className="group/item flex min-h-[28rem] flex-col overflow-hidden rounded-[32px] border border-white/10 bg-[#070707]/85 shadow-[0_24px_90px_-40px_rgba(0,0,0,0.8)] transition-all duration-500 hover:-translate-y-2 hover:border-[#d4af37]/30 hover:bg-white/[0.08]"
                                                >
                                                    {/* IMAGE */}
                                                    {item.img && (
                                                        <div className="relative overflow-hidden">
                                                            <img
                                                                src={getAssetUrl(item.img) || "/placeholder.jpg"}
                                                                alt={
                                                                    isFa
                                                                        ? item.title_fa
                                                                        : item.title_en
                                                                }
                                                                className="h-72 w-full object-cover transition duration-1000 ease-out transform scale-[1.02] group-hover/item:scale-105"
                                                                loading="lazy"
                                                            />

                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                                                        </div>
                                                    )}

                                                    {/* CONTENT */}
                                                    <div className="flex flex-1 flex-col gap-6 p-8">
                                                        <div className="flex flex-col gap-4">
                                                            <div className="flex flex-wrap items-center justify-between gap-4">
                                                                {item.is_active && (
                                                                    <span className="rounded-full bg-[#d4af37]/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.35em] text-[#d4af37] shadow-[0_0_16px_rgba(212,175,55,0.16)]">
                                                                        {isFa ? "پیشنهاد ویژه" : "Best Pick"}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <h3 className="text-2xl font-semibold tracking-tight text-white leading-tight md:text-3xl">
                                                                {isFa
                                                                    ? item.title_fa
                                                                    : item.title_en}
                                                            </h3>

                                                            <p className="text-sm leading-7 text-white/80 md:text-base">
                                                                {isFa
                                                                    ? item.description_fa
                                                                    : item.description_en}
                                                            </p>
                                                        </div>

                                                        <div className="grid gap-5 xl:grid-cols-[2fr_1fr]">
                                                            {(item.suitable_fa || item.suitable_en) && (
                                                                <div className="xl:col-span-2 rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                                                                    <span className="mb-3 block text-[15px] uppercase tracking-[0.3em] text-[#D4AF37]">
                                                                        {isFa
                                                                            ? "مناسب برای"
                                                                            : "Suitable For"}
                                                                    </span>
                                                                    <p className="text-sm leading-7 text-white/85">
                                                                        {isFa
                                                                            ? item.suitable_fa ?? ""
                                                                            : item.suitable_en ?? ""}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="mt-auto rounded-[24px] border border-white/10 bg-[#090909]/70 p-5 backdrop-blur-xl">
                                                            <div className="grid gap-4 sm:grid-cols-2 sm:items-end sm:gap-6">
                                                                <div>
                                                                    <span className="mb-3 block text-[15px] uppercase tracking-[0.3em] text-white/80">
                                                                        {isFa
                                                                            ? "شروع قیمت"
                                                                            : "Starting From"}
                                                                    </span>
                                                                    <div className="text-2xl font-extralight text-[#d4af37] md:text-3xl">
                                                                        {isFa
                                                                            ? item.price_fa
                                                                            : item.price_en}
                                                                    </div>
                                                                </div>

                                                                <div className={`${isFa ? "text-left" : "text-right"}`}>
                                                                    <span className="mb-3 block text-[15px] uppercase tracking-[0.3em] text-white/70">
                                                                        {isFa
                                                                            ? "زمان تحویل"
                                                                            : "Timeframe"}
                                                                    </span>
                                                                    <div className="text-sm text-white/100">
                                                                        {isFa
                                                                            ? item.delivery_time_fa
                                                                            : item.delivery_time_en}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <Link
                                                                href={`/${locale}/contact`}
                                                                className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-[#D4AF37]/40 px-8 py-4 text-sm uppercase tracking-[0.2em] text-[#D4AF37] transition-all duration-300 hover:bg-[#D4AF37] hover:text-black hover:shadow-[0_0_30px_rgba(212,175,55,0.35)]"
                                                            >
                                                                {isFa ? "ثبت سفارش" : "Submit Order"}
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}

            {/* CTA */}
            <Reveal className="mt-28 border-t border-white/5 pt-14 text-center">

                <div className="relative mx-auto max-w-2xl">
                    <h3 className="mb-5 text-2xl md:text-3xl font-light text-[#D4AF37]">
                        {locale === "fa"
                            ? "برای پروژه‌های سفارشی، از طراحی تا مدل ساخته شده در کنار شما هستیم."
                            : "From concept to production-ready files, we support custom jewelry projects."}
                    </h3>

                    <p className="mx-auto mb-10 max-w-xl text-sm leading-7 text-white/90">
                        {locale === "fa"
                            ? "برای ثبت سفارش روی دکمه زیر کلیک کنید."
                            : "Click the button below to place your order."}
                    </p>

                    <Link
                        href={`/${locale}/contact`}
                        className="inline-flex items-center rounded-full border border-[#D4AF37]/40 px-8 py-4 text-sm uppercase tracking-[0.2em] text-[#D4AF37] transition-all duration-300 hover:bg-[#D4AF37] hover:text-black hover:shadow-[0_0_30px_rgba(212,175,55,0.35)]"
                    >
                        <span className="relative z-10">
                            {locale === "fa" ? "درخواست مشاوره/ثبت سفارش" : "Request Consultation/Order"}
                        </span>

                        <div
                            className="
                    absolute inset-0 origin-left scale-x-0
                    bg-[#D4AF37]
                    transition-transform duration-500
                    group-hover:scale-x-100
                "
                        />
                    </Link>
                </div>

            </Reveal>
        </div>
    );
}