"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutCTA({
    locale = "en",
}: {
    locale?: string;
}) {
    const isFa = locale === "fa";

    return (
        <section className="relative overflow-hidden px-6 py-40 md:px-12">
            <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="relative z-10 mx-auto max-w-5xl text-center"
            >
                <p className="mb-6 text-sm uppercase tracking-[0.4em] text-[#D4AF37]">
                    {isFa ? "شروع همکاری" : "Start a Project"}
                </p>

                <h2 className="mb-10 whitespace-pre-line text-5xl font-extralight leading-[1.05] md:text-7xl text-white">
                    {isFa
                        ? "ایده شما،\nبا دقت به واقعیت تبدیل می‌شود"
                        : "Your Concept,\nDeveloped With Precision"}
                </h2>

                <p className="mx-auto mb-14 max-w-2xl text-lg leading-8 text-[#e5e5e5]">
                    {isFa
                        ? "از طراحی مفهومی و مدلسازی سه‌بعدی تا پرینت تخصصی و آماده‌سازی برای تولید، AUREL در تمام مراحل کنار شماست."
                        : "From conceptual jewelry design and precision 3D modeling to professional printing and production preparation, AUREL supports every stage of the process."}
                </p>

                {/* BUTTONS (UPDATED SYSTEM) */}
                <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">

                    {/* PRIMARY BUTTON */}
                    <Link
                        href={`/${locale}/contact`}
                        className="
                            inline-flex items-center rounded-full
                            border border-[#D4AF37]/40
                            px-10 py-4
                            text-sm uppercase tracking-[0.2em]
                            text-[#D4AF37]
                            transition-all duration-300
                            hover:bg-[#D4AF37]
                            hover:text-black
                            hover:shadow-[0_0_30px_rgba(212,175,55,0.35)]
                        "
                    >
                        {isFa ? "ثبت سفارش" : "Request a Project"}
                    </Link>

                    {/* SECONDARY BUTTON */}
                    <Link
                        href={`/${locale}/portfolio`}
                        className="
                            inline-flex items-center rounded-full
                            border border-[#D4AF37]/40
                            px-10 py-4
                            text-sm uppercase tracking-[0.2em]
                            text-[#D4AF37]
                            transition-all duration-300
                            hover:bg-[#D4AF37]
                            hover:text-black
                            hover:shadow-[0_0_30px_rgba(212,175,55,0.35)]
                        "
                    >
                        {isFa ? "مشاهده نمونه‌کارها" : "View Portfolio"}
                    </Link>

                </div>
            </motion.div>
        </section>
    );
}