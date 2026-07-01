"use client";

import Image from "next/image";
import Link from "next/link";
import Reveal from "./reveal";

type Props = {
    locale: string;
};

export default function AboutBrand({ locale }: Props) {
    const isFa = locale === "fa";

    const content = isFa
        ? {
            /* محتوای فارسی */
            label: "طراحی، مدلسازی، تولید",

            title:
                "طراحی  جواهرات\nبا دقتی فراتر از استانداردها",

            description:
                "استودیو طراحی جواهرات AUREL خدمات تخصصی طراحی سه‌بعدی جواهرات، مدلسازی حرفه‌ای و پرینت رزینی قابل ریخته‌گری را برای گالری‌ها، برندها و کارگاه‌های طلاسازی ارائه می‌کند. هر مدل با درنظر گرفتن جزئیات فنی، دقت ساخت و فرآیند واقعی تولید آماده می‌شود تا نتیجه نهایی، دقیق، قابل اجرا و آماده تولید باشد.",

            secondary:
                "ترکیب زیبایی، دقت مهندسی و تجربه تولید، پایه اصلی زبان طراحی ماست.",

            buttonPrimary: "ثبت سفارش طراحی",

            buttonSecondary: "تعرفه و خدمات",

            stats: [
                { value: "15+", label: "سال تجربه تخصصی" },
                { value: "5000+", label: "پروژه انجام شده" },
                { value: "100%", label: "آماده تولید و ریخته‌گری" },
            ],
        }
        : {
            /* English Content */
            label: "Design • Modeling • Production",

            title:
                "Professional Jewelry Design\nBeyond Standard Precision",

            description:
                "AUREL Jewelry Design Studio provides professional jewelry CAD design, high-precision 3D modeling, and castable resin printing services for jewelry brands, workshops, and manufacturers. Every model is developed with production accuracy, structural balance, and manufacturing feasibility in mind.",

            secondary:
                "The fusion of aesthetics, engineering precision, and production expertise defines our design philosophy.",

            buttonPrimary: "Start Your Project",

            buttonSecondary: "Services & Pricing",

            stats: [
                { value: "15+", label: "Years of Expertise" },
                { value: "5000+", label: "Professional Projects" },
                { value: "100%", label: "Production-Ready Models" },
            ],
        };

    return (
        <section
            id="about"
            dir={isFa ? "rtl" : "ltr"}
            className="relative overflow-visible px-6 py-28"
        >


            <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
                <Reveal>
                    <div>
                        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#D4AF37]">
                            {content.label}
                        </p>

                        <div className="relative inline-block overflow-visible pt-4">
                            <h2 className="persian-smooth text-4xl sm:text-5xl md:text-6xl font-light leading-[1.55] text-white/0 whitespace-pre-line">
                                {content.title}
                            </h2>

                            <h2 className="persian-smooth absolute inset-0 text-4xl sm:text-5xl md:text-6xl font-light leading-[1.55] whitespace-pre-line bg-gradient-to-r from-white via-white to-[#D4AF37] bg-clip-text text-transparent pointer-events-none select-none overflow-visible">
                                {content.title}
                            </h2>
                        </div>

                        {/* ✅ اصلاح: text-gray-400 → text-white/75 */}
                        <p className="mt-8 text-base leading-8 text-white/75 sm:text-lg">
                            {content.description}
                        </p>

                        {/* ✅ اصلاح: text-gray-500 → text-white/65 */}
                        <p className="mt-6 text-base leading-8 text-white/65">
                            {content.secondary}
                        </p>

                        <div className="mt-12 grid grid-cols-3 gap-6">
                            {content.stats.map((stat, i) => (
                                <div
                                    key={i}
                                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center backdrop-blur-sm transition-all duration-300 hover:border-[#D4AF37]/30 hover:bg-white/[0.05]"
                                >
                                    <div className="text-2xl font-light text-[#D4AF37] sm:text-3xl">
                                        {stat.value}
                                    </div>
                                    {/* ✅ اصلاح: text-gray-500 → text-white/65 */}
                                    <div className="mt-2 text-xs uppercase tracking-[0.2em] text-white/65">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 flex flex-wrap gap-4">
                            <Link
                                href={isFa ? "/fa/contact" : "/en/contact"}
                                className="inline-flex items-center rounded-full border border-[#D4AF37]/40 px-8 py-4 text-sm uppercase tracking-[0.2em] text-[#D4AF37] transition-all duration-300 hover:bg-[#D4AF37] hover:text-black hover:shadow-[0_0_30px_rgba(212,175,55,0.35)]"
                            >
                                {content.buttonPrimary}
                            </Link>

                            <Link
                                href={isFa ? "/fa/pricing" : "/en/pricing"}
                                className="inline-flex items-center rounded-full border border-[#D4AF37]/40 px-8 py-4 text-sm uppercase tracking-[0.2em] text-[#D4AF37] transition-all duration-300 hover:bg-[#D4AF37] hover:text-black hover:shadow-[0_0_30px_rgba(212,175,55,0.35)]"
                            >
                                {content.buttonSecondary}
                            </Link>
                        </div>
                    </div>
                </Reveal>

                <Reveal delay={0.2}>
                    <div className="relative">
                        <div className="absolute -inset-4 rounded-[40px] bg-[#D4AF37]/10 blur-2xl" />

                        <div className="group relative overflow-hidden rounded-[36px] border border-white/10 bg-black/40 backdrop-blur-md">
                            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                            <Image
                                src="/images/jewel-2.jpg"
                                alt="Luxury Jewelry CAD Design"
                                width={900}
                                height={1200}
                                className="h-[650px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            <div className="absolute bottom-6 left-6 right-6 z-20 rounded-2xl border border-white/10 bg-black/50 p-6 backdrop-blur-xl">
                                <p className="text-sm uppercase tracking-[0.25em] text-[#D4AF37]">
                                    {isFa
                                        ? "استاندارد تولید حرفه‌ای"
                                        : "Professional Production Standards"}
                                </p>

                                <p className="mt-3 text-sm leading-7 text-gray-300">
                                    {isFa
                                        ? "تمام مدل‌ها با درنظر گرفتن محدودیت‌های واقعی تولید، ضخامت‌گذاری استاندارد، وزن مناسب و جزئیات دقیق طراحی می‌شوند تا فرآیند ساخت بدون خطا و با حداقل اصلاحات انجام شود."
                                        : "Every model is developed with real manufacturing limitations, optimized wall thickness, balanced weight, and precise detailing in mind to ensure a smooth production process with minimal adjustments."}
                                </p>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}