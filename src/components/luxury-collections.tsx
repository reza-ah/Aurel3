"use client";

import Image from "next/image";
import Reveal from "./reveal";
import Link from "next/link";

type Props = {
    locale: string;
};

export default function LuxuryCollections({ locale }: Props) {
    const isFa = locale === "fa";

    const collectionsImages = [
        "/images/sketch.jpg",
        "/images/modeling.jpg",
        "/images/print.jpg",
        "/images/final.jpg",
    ];

    const content = isFa
        ? {
            label: "خدمات تخصصی طراحی جواهرات",

            title: "از ایده اولیه تا تولید نهایی",

            subtitle:
                "استودیو طراحی جواهرات AUREL تمامی مراحل طراحی، مدلسازی، پرینت رزینی و آماده‌سازی برای تولید را با استانداردهای حرفه‌ای صنعت طلا و جواهر ارائه می‌کند.",

            items: [
                {
                    title: "طراحی جواهرات",
                    description:
                        "تبدیل ایده، تصویر یا اسکچ اولیه به طراحی حرفه‌ای و قابل تولید با تمرکز بر زیبایی، تناسب و جزئیات اجرایی.",
                    image: collectionsImages[0],
                },

                {
                    title: "مدلسازی سه‌بعدی",
                    description:
                        "مدلسازی دقیق با Rhino و MatrixGold برای ساختارهای مهندسی‌شده و استفاده از ZBrush برای فرم‌های ارگانیک و پیکره‌سازی تخصصی.",
                    image: collectionsImages[1],
                },

                {
                    title: "پرینت سه بعدی",
                    description:
                        "پرینت سه‌بعدی با موم‌های Projet و رزین‌های تخصصی Castable، با استفاده از دستگاه‌های دقیق صنعتی برای دستیابی به بالاترین سطح جزئیات و آماده‌سازی حرفه‌ای جهت ریخته‌گری.",
                    image: collectionsImages[2],
                },

                {
                    title: "ریخته‌گری و تولید",
                    description:
                        "آماده‌سازی و تولید مدل‌ها با طلا یا نقره، مطابق با استانداردهای ساخت حرفه‌ای و مناسب تولید نهایی.",
                    image: collectionsImages[3],
                },
            ],
        }
        : {
            label: "Professional Jewelry Services",

            title: "From Concept to Final Production",

            subtitle:
                "AUREL Jewelry Design Studio provides complete jewelry production services including professional design, high-precision 3D modeling, castable resin printing, and production-ready preparation for the jewelry industry.",

            items: [
                {
                    title: "Jewelry Design",
                    description:
                        "Transforming concepts, references, or hand sketches into production-ready jewelry designs with a focus on aesthetics, balance, and technical precision.",
                    image: collectionsImages[0],
                },

                {
                    title: "3D Modeling",
                    description:
                        "High-precision CAD modeling using Rhino and MatrixGold for engineered structures, combined with ZBrush for organic forms and advanced sculpting.",
                    image: collectionsImages[1],
                },

                {
                    title: "3D Printing",
                    description:
                        "Professional 3D printing using Projet wax and specialized castable resins, powered by high-precision industrial systems to achieve exceptional detail and reliable casting preparation.",
                    image: collectionsImages[2],
                },

                {
                    title: "Casting & Production",
                    description:
                        "Production-ready preparation and casting in gold or silver according to professional jewelry manufacturing standards.",
                    image: collectionsImages[3],
                },
            ],
        };

    return (
        <section
            id="collections"
            dir={isFa ? "rtl" : "ltr"}
            className="relative overflow-hidden py-20"
        >
            <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
                <Reveal>
                    <div className="mx-auto mb-20 max-w-3xl text-center">
                        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
                            {content.label}
                        </p>

                        <h2 className="text-4xl font-light leading-tight text-white sm:text-5xl md:text-6xl">
                            {content.title}
                        </h2>

                        {/* ✅ اصلاح: text-gray-400 → text-white/75 */}
                        <p className="mt-6 text-base leading-8 text-white/75">
                            {content.subtitle}
                        </p>
                    </div>
                </Reveal>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
                    {content.items.map((item, index) => (
                        <Reveal key={index} delay={index * 0.1}>
                            <div className="group overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-sm">
                                <div className="relative h-[500px] overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                                    <div className="absolute inset-0 bg-[#D4AF37]/0 transition-colors duration-500 group-hover:bg-[#D4AF37]/10" />
                                </div>

                                <div className="p-8">
                                    <h3 className="text-2xl font-light text-[#D4AF37]">
                                        {item.title}
                                    </h3>

                                    {/* ✅ اصلاح: text-gray-400 → text-white/70 */}
                                    <p className="mt-4 text-sm leading-7 text-white/70">
                                        {item.description}
                                    </p>

                                    <button aria-label="Learn more" className="mt-8 inline-flex items-center text-sm uppercase tracking-[0.2em] text-[#D4AF37] transition-all duration-300 hover:translate-x-1">
                                        {/* Optional CTA */}
                                    </button>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-16 flex justify-center">
                    <a
                        href={`/${locale}/contact`}
                        className="inline-flex items-center rounded-full border border-[#D4AF37]/40 px-8 py-4 text-sm uppercase tracking-[0.2em] text-[#D4AF37] transition-all duration-300 hover:bg-[#D4AF37] hover:text-black hover:shadow-[0_0_30px_rgba(212,175,55,0.35)]"
                    >
                        {isFa ? "ثبت سفارش خدمات" : "Start Your Project"}
                    </a>
                </div>
            </div>
        </section>
    );
}