"use client";

import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/reveal";

type Props = {
    locale: string;
};

export default function AboutHero({ locale }: Props) {
    const isFa = locale === "fa";

    const content = isFa
        ? {
            label: "استودیو تخصصی طراحی و ساخت جواهرات",
            title: ["از ایده", "تا اجرا"],
            description:
                "در استودیو طراحی جواهرات AUREL، ایده‌های اولیه به طراحی حرفه‌ای، مدل سه‌بعدی و فایل آماده تولید تبدیل می‌شوند. از طراحی مفهومی و مدلسازی تخصصی در MatrixGold، Rhino و ZBrush تا پرینت رزینی و مومی و آماده‌سازی برای ریخته‌گری طلا و نقره، تمامی مراحل با تمرکز بر دقت، جزئیات و استانداردهای واقعی تولید انجام می‌شود.",
            cta: "مشاهده نمونه‌کارها",
            ctaLink: "/fa/portfolio",
        }
        : {
            label: "Jewelry CAD & Manufacturing Studio",
            title: ["From Concept", "To Production"],
            description:
                "At AUREL Jewelry Design Studio, concepts are transformed into professional jewelry designs, high-precision 3D models, and production-ready files. From conceptual development and advanced modeling in MatrixGold, Rhino, and ZBrush to castable resin and wax printing for gold and silver casting, every stage is executed with precision, technical expertise, and production-focused standards.",
            cta: "View Portfolio",
            ctaLink: "/en/portfolio",
        };

    return (
        <section
            dir={isFa ? "rtl" : "ltr"}
            className="relative min-h-screen overflow-hidden px-6 pt-32 pb-20"
        >
            <div className="relative z-10 mx-auto grid min-h-[85vh] max-w-7xl items-center gap-20 lg:grid-cols-2">
                {/* LEFT CONTENT */}
                <Reveal>
                    <div className="max-w-2xl">
                        <p className="mb-6 text-base uppercase tracking-[0.35em] text-[#D4AF37]">
                            {content.label}
                        </p>

                        <div className="space-y-10">
                            {content.title.map((line, index) => (
                                <h1
                                    key={index}
                                    className={`
                                    persian-smooth
                                    text-6xl font-light leading-[0.9]
                                    tracking-tight
                                    text-white
                                    sm:text-7xl
                                    md:text-8xl
                                    xl:text-[9rem]
                                    ${index === content.title.length - 1
                                            ? "bg-gradient-to-r from-[#D4AF37] via-[#FFE8A3] to-white bg-clip-text text-transparent"
                                            : ""
                                        }
                                `}
                                >
                                    {line}
                                </h1>
                            ))}
                        </div>

                        <p className="mt-10 max-w-xl text-base leading-8 text-white/85 sm:text-lg">
                            {content.description}
                        </p>

                        <div className="mt-12 flex flex-wrap gap-5">
                            <Link
                                href={content.ctaLink}
                                className="inline-flex items-center rounded-full border border-[#D4AF37]/40 px-8 py-4 text-sm uppercase tracking-[0.2em] text-[#D4AF37] transition-all duration-300 hover:bg-[#D4AF37] hover:text-black hover:shadow-[0_0_30px_rgba(212,175,55,0.35)]"
                            >
                                <span className="relative z-10">
                                    {content.cta}
                                </span>
                                <div className="absolute inset-0 origin-left scale-x-0 bg-[#D4AF37] transition-transform duration-500 group-hover:scale-x-100" />
                            </Link>
                        </div>
                    </div>
                </Reveal>

                {/* RIGHT VISUAL - کارت شفاف */}
                <Reveal delay={0.2}>
                    <div className="relative flex justify-center lg:justify-end">
                        <div className="group relative overflow-hidden rounded-[40px] border border-white/20 shadow-5xl">

                            <Image
                                src="/images/jewel-hero.jpg"
                                alt="Luxury Jewelry CAD Design"
                                width={900}
                                height={1200}
                                priority
                                className="h-[720px] w-[520px] object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                            />

                            <div className="absolute bottom-6 left-6 right-6 z-30 rounded-3xl border border-white/60 p-6 bg-black/80 backdrop-blur-md">
                                <p className="text-base uppercase tracking-[0.3em] text-[#D4AF37]">
                                    {isFa
                                        ? "از ایده پردازی تا اجرای نهایی کنار شما هستیم"
                                        : "We are with you from concept to final product."}
                                </p>
                                <p className="mt-3 text-base leading-7 text-gray-300">
                                    {isFa
                                        ? "تمرکز ما بر دقت ابعادی، کیفیت سطح، جزئیات ظریف و آماده‌سازی حرفه‌ای برای ریخته‌گری بدون خطاست."
                                        : "Focused on dimensional accuracy, refined surface quality, fine detailing, and reliable casting-ready production."}
                                </p>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}