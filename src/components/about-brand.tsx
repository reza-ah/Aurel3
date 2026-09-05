"use client";

import Image from "next/image";
import Link from "next/link";
import Reveal from "./reveal";
import {
    FaGem,
    FaDraftingCompass,
    FaUserTie,
    FaIndustry,
    FaArrowLeft,
    FaArrowRight,
} from "react-icons/fa";

type Props = {
    locale: string;
};

export default function AboutBrand({ locale }: Props) {
    const isFa = locale === "fa";

    const content = isFa
        ? {
            label: "طراحی، مدلسازی، تولید",
            title: "طراحی  جواهرات\nبا دقتی فراتر از استانداردها",
            description:
                "استودیو طراحی جواهرات AUREL خدمات تخصصی طراحی، مدلسازی سه‌بعدی ، پرینت سه بعدی و ساخت را برای علاقه‌مندان به ساخت جواهرات سفارشی، برندها، گالری‌ها و کارگاه‌های طلاسازی ارائه می‌کند. هر پروژه با درنظر گرفتن جزئیات فنی، قابلیت ساخت و فرآیند واقعی تولید طراحی می‌شود تا نتیجه نهایی، دقیق، قابل اجرا و آماده تولید باشد.",
            secondary:
                "ترکیب خلاقیت، دقت مهندسی و تجربه عملی در ساخت جواهرات، پایه اصلی رویکرد طراحی ماست.",
            pathQuestion: "مسیر مناسب سفارش خود را انتخاب کنید.",
            retailTag: "سفارشات ساخت",
            retailTitle: "طراحی و ساخت جواهرات سفارشی",
            retailDesc: "برای افرادی که می‌خواهند جواهری منحصربه‌فرد، مطابق سلیقه خود داشته باشند.",
            tradeTag: "هم‌صنف‌ها و طلاسازان",
            tradeTitle: "خدمات تخصصی برای همکاران",
            tradeDesc: "طراحی، مدلسازی حرفه‌ای، رندر و فایل استاندارد قابل تولید برای گالری‌ها، برندها و کارگاه‌های طلاسازی.",
            overlayTitle: "طراحی با رویکرد تولید واقعی",
            overlayDesc:
                "هر مدل از ابتدا بر اساس استانداردهای ساخت جواهر طراحی می‌شود؛ از کنترل ضخامت و وزن گرفته تا جزئیات فنی و قابلیت تولید، تا خروجی نهایی علاوه بر زیبایی، آماده اجرای دقیق در کارگاه باشد.",
            stats: [
                { value: "15+", label: "سال تجربه تخصصی" },
                { value: "5000+", label: "پروژه انجام شده" },
                { value: "100%", label: "آماده تولید و ریخته‌گری" },
            ],
            imageAlt:
                "فرآیند طراحی و مدلسازی سه‌بعدی جواهرات در استودیو آورل - فایل آماده تولید و ریخته‌گری",
        }
        : {
            label: "Design • Modeling • Production",
            title: "Professional Jewelry Design\nBeyond Standard Precision",
            description:
                "AUREL Jewelry Design Studio offers specialized design, 3D modeling, and 3D printing services for jewelry enthusiasts seeking custom pieces, as well as brands, galleries, and goldsmith workshops. Each project is designed with attention to technical details, manufacturability, and the real production process to ensure the final result is precise, feasible, and production-ready.",
            secondary:
                "The combination of creativity, engineering precision, and hands-on jewelry-making experience forms the foundation of our design approach.",
            pathQuestion: "Ordering for yourself, or as a trade partner?",
            retailTag: "End clients",
            retailTitle: "Custom Jewelry Design & Crafting",
            retailDesc: "For those who want a unique piece, tailored to their personal taste.",
            tradeTag: "Trade & workshops",
            tradeTitle: "Specialized Services for Partners",
            tradeDesc: "Professional design, 3D modeling, rendering, and production-ready standard files for galleries, brands, and goldsmith workshops.",
            overlayTitle: "Design with a Real Production Approach",
            overlayDesc:
                "Every model is designed from the ground up based on jewelry manufacturing standards — from wall thickness and weight control to technical details and producibility — ensuring the final output is not only beautiful but precisely ready for workshop execution.",
            stats: [
                { value: "15+", label: "Years of Expertise" },
                { value: "5000+", label: "Professional Projects" },
                { value: "100%", label: "Production-Ready Models" },
            ],
            imageAlt:
                "Professional jewelry CAD design process at Aurel Studio - 3D modeling and production-ready files",
        };

    return (
        <section
            id="about"
            dir={isFa ? "rtl" : "ltr"}
            className="relative overflow-visible px-5 py-16 sm:px-6 sm:py-24 lg:py-28"
        >
            {/* گرید: موبایل تک‌ستونه (ترتیب DOM)، دسکتاپ دو ستونه */}
            <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-stretch gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-10">
                {/* ===== ۱. متن معرفی ===== */}
                <div className="lg:col-start-1 lg:row-start-1">
                    <Reveal>
                        <div className="max-w-3xl">
                            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[#D4AF37] sm:text-sm">
                                {content.label}
                            </p>

                            <div className="relative inline-block overflow-visible pt-2 sm:pt-4">
                                <h2 className="persian-smooth text-3xl font-light leading-[1.45] text-white/0 whitespace-pre-line sm:text-5xl sm:leading-[1.55] md:text-6xl">
                                    {content.title}
                                </h2>
                                <h2
                                    aria-hidden="true"
                                    className="persian-smooth absolute inset-0 text-3xl font-light leading-[1.45] whitespace-pre-line bg-gradient-to-r from-white via-white to-[#D4AF37] bg-clip-text text-transparent pointer-events-none select-none overflow-visible sm:text-5xl sm:leading-[1.55] md:text-6xl"
                                >
                                    {content.title}
                                </h2>
                            </div>

                            <p className="mt-6 text-sm leading-7 text-white/75 sm:mt-8 sm:text-base sm:leading-8 md:text-lg">
                                {content.description}
                            </p>

                            <p className="mt-4 text-sm leading-7 text-white/65 sm:mt-6 sm:text-base sm:leading-8">
                                {content.secondary}
                            </p>
                        </div>
                    </Reveal>
                </div>

                {/* ===== ۲. ✅ عکس — موبایل: بعد از متن / دسکتاپ: ستون راست تمام‌قد ===== */}
                <div className="lg:col-start-2 lg:row-start-1 lg:row-span-3">
                    <Reveal delay={0.15} className="lg:h-full lg:flex lg:items-center">
                        <div className="relative w-full">
                            <div className="absolute -inset-3 rounded-[32px] bg-[#D4AF37]/10 blur-2xl sm:-inset-4 sm:rounded-[40px]" />

                            <div className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-black/40 backdrop-blur-md sm:rounded-[36px]">
                                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                                <Image
                                    src="/images/jewel-2.jpg"
                                    alt={content.imageAlt}
                                    width={900}
                                    height={1200}
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    loading="lazy"
                                    className="h-[320px] w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-[440px] lg:h-[620px]"
                                />

                                <div className="absolute bottom-4 left-4 right-4 z-20 rounded-2xl border border-white/10 bg-black/50 p-4 backdrop-blur-xl sm:bottom-6 sm:left-6 sm:right-6 sm:p-6">
                                    <h3 className="persian-smooth text-xs uppercase tracking-[0.2em] text-[#D4AF37] sm:text-sm sm:tracking-[0.25em]">
                                        {content.overlayTitle}
                                    </h3>
                                    <p className="persian-smooth mt-2 text-xs leading-6 text-gray-300 sm:mt-3 sm:text-sm sm:leading-7">
                                        {content.overlayDesc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>
                {/* ===== ۳. ✅ آمار — موبایل: بعد از عکس / دسکتاپ: ستون چپ ===== */}
                <div className="lg:col-start-1 lg:row-start-2">
                    <Reveal delay={0.2}>
                        <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
                            {content.stats.map((stat, i) => (
                                <div
                                    key={i}
                                    className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center backdrop-blur-sm transition-all duration-300 hover:border-[#D4AF37]/30 hover:bg-white/[0.05] sm:rounded-2xl sm:p-5"
                                >
                                    <div className="text-lg font-light text-[#D4AF37] sm:text-2xl lg:text-3xl">
                                        {stat.value}
                                    </div>
                                    <div className="mt-1 text-[10px] leading-4 tracking-[0.12em] text-white/65 sm:mt-2 sm:text-xs sm:tracking-[0.2em]">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Reveal>
                </div>

                {/* ===== ۴. انتخاب مسیر ===== */}
                <div className="lg:col-start-1 lg:row-start-3">
                    <Reveal delay={0.25}>
                        <div>
                            <div className="mb-3 flex items-center gap-3 sm:mb-4">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D4AF37] opacity-60" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D4AF37]" />
                                </span>
                                <p className="persian-smooth text-xs text-white/70 sm:text-sm">
                                    {content.pathQuestion}
                                </p>
                            </div>

                            <div className="flex flex-col gap-3">
                                {/* کارت ۱ — مشتری نهایی */}
                                {/* <Link
                                    href={`/${locale}/custom-order`}
                                    className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-[#D4AF37]/25 bg-gradient-to-r from-[#D4AF37]/[0.08] to-transparent p-3.5 transition-all duration-500 hover:-translate-y-0.5 hover:border-[#D4AF37]/50 hover:shadow-[0_14px_40px_-16px_rgba(212,175,55,0.4)] sm:gap-4 sm:p-4 ${isFa ? "sm:pr-5" : "sm:pl-5"}`}
                                >
                                    <span className={`absolute inset-y-0 w-1 bg-gradient-to-b from-[#D4AF37] to-[#D4AF37]/20 ${isFa ? "right-0" : "left-0"}`} />
                                    <span className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#D4AF37]/15 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

                                    <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/12 text-lg text-[#D4AF37] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 sm:h-12 sm:w-12 sm:text-xl">
                                        <FaGem />
                                    </span>

                                    <span className="relative min-w-0 flex-1">
                                        <span className="persian-smooth mb-0.5 flex items-center gap-1.5 text-[9px] uppercase tracking-[0.16em] text-[#D4AF37] sm:text-[10px] sm:tracking-[0.18em]">
                                            <FaUserTie className="text-[9px]" />
                                            {content.retailTag}
                                        </span>
                                        <h3 className="persian-smooth block text-sm font-medium leading-snug text-white sm:text-base">
                                            {content.retailTitle}
                                        </h3>
                                        <span className="persian-smooth mt-0.5 block text-[11px] leading-5 text-white/55 sm:text-xs">
                                            {content.retailDesc}
                                        </span>
                                    </span>

                                    <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D4AF37] text-black transition-transform duration-300 group-hover:scale-110 sm:h-9 sm:w-9">
                                        {isFa ? (
                                            <FaArrowLeft className="text-[10px] transition-transform duration-300 group-hover:-translate-x-0.5 sm:text-xs" />
                                        ) : (
                                            <FaArrowRight className="text-[10px] transition-transform duration-300 group-hover:translate-x-0.5 sm:text-xs" />
                                        )}
                                    </span>
                                </Link> */}

                                {/* کارت ۲ — هم‌صنف */}
                                {/* <Link
                                    href={`/${locale}/contact`}
                                    className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-white/12 bg-white/[0.02] p-3.5 transition-all duration-500 hover:-translate-y-0.5 hover:border-[#D4AF37]/40 hover:shadow-[0_14px_40px_-16px_rgba(212,175,55,0.25)] sm:gap-4 sm:p-4 ${isFa ? "sm:pr-5" : "sm:pl-5"}`}
                                >
                                    <span className={`absolute inset-y-0 w-1 bg-gradient-to-b from-[#D4AF37]/70 to-[#D4AF37]/10 ${isFa ? "right-0" : "left-0"}`} />
                                    <span className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#D4AF37]/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

                                    <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/12 text-lg text-[#D4AF37] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 sm:h-12 sm:w-12 sm:text-xl">
                                        <FaDraftingCompass />
                                    </span>

                                    <span className="relative min-w-0 flex-1">
                                        <span className="persian-smooth mb-0.5 flex items-center gap-1.5 text-[9px] uppercase tracking-[0.16em] text-[#D4AF37] sm:text-[10px] sm:tracking-[0.18em]">
                                            <FaIndustry className="text-[9px]" />
                                            {content.tradeTag}
                                        </span>
                                        <h3 className="persian-smooth block text-sm font-medium leading-snug text-white sm:text-base">
                                            {content.tradeTitle}
                                        </h3>
                                        <span className="persian-smooth mt-0.5 block text-[11px] leading-5 text-white/55 sm:text-xs">
                                            {content.tradeDesc}
                                        </span>
                                    </span>

                                    <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D4AF37] text-black transition-transform duration-300 group-hover:scale-110 sm:h-9 sm:w-9">
                                        {isFa ? (
                                            <FaArrowLeft className="text-[10px] transition-transform duration-300 group-hover:-translate-x-0.5 sm:text-xs" />
                                        ) : (
                                            <FaArrowRight className="text-[10px] transition-transform duration-300 group-hover:translate-x-0.5 sm:text-xs" />
                                        )}
                                    </span>
                                </Link> */}
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}