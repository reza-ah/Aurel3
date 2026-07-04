"use client";

import { useState } from "react";

type Props = {
    locale: string;
};

const steps = [
    {
        id: 1,
        title_en: "Concept & Design",
        title_fa: "ایده‌پردازی و طراحی",
        desc_en: "Each piece begins with a refined concept, where form, function, and aesthetic direction are defined with precision before entering development.",
        desc_fa: "هر قطعه با یک ایده‌پردازی دقیق آغاز می‌شود؛ به گونه‌ای که فرم، عملکرد و جهت‌گیری زیبایی‌شناسی پیش از ورود به مرحله توسعه مشخص می‌گردد.",
    },
    {
        id: 2,
        title_en: "Technical Development",
        title_fa: "توسعه فنی",
        desc_en: "Structural integrity, stone setting, proportions, and weight are engineered to ensure the design is fully production-ready.",
        desc_fa: "ساختار، سنگ‌چینی، تناسب و وزن با دقت مهندسی می‌شود تا مدل برای تولید کاملاً آماده باشد.",
    },
    {
        id: 3,
        title_en: "Precision 3D Modeling",
        title_fa: "مدل‌سازی دقیق سه‌بعدی",
        desc_en: "Using Rhino, MatrixGold, and ZBrush, every detail is sculpted with high precision in a controlled digital environment.",
        desc_fa: "با استفاده از Rhino، MatrixGold و ZBrush، تمام جزئیات با دقت بالا در محیط کنترل‌شده و دیجیتال شکل می‌گیرند.",
    },
    {
        id: 4,
        title_en: "Production Preparation",
        title_fa: "آماده‌سازی تولید",
        desc_en: "Models are produced in castable wax or resin and refined for high-precision casting in gold and silver.",
        desc_fa: "مدل‌ها به موم یا رزین قابل ریخته‌گری ساخته شده و برای ریخته‌گری دقیق در طلا و نقره آماده می‌شوند.",
    },
];

export default function CreativeProcess({ locale }: Props) {
    const [active, setActive] = useState(1);
    const isFa = locale === "fa";

    return (
        <section
            className="relative overflow-hidden"
            dir={isFa ? "rtl" : "ltr"}
        >
            <div className="relative mx-auto max-w-7xl px-6 py-32 md:py-40">
                {/* Heading */}
                <div className="max-w-3xl mb-24">
                    <p className="text-sm uppercase tracking-[0.45em] text-[#D4AF37] mb-6">
                        {isFa ? "فرآیند طراحی و تولید" : "Design & Production Process"}
                    </p>
                    <h2 className="text-4xl md:text-6xl font-extralight text-white leading-[1.5] whitespace-pre-line">
                        {isFa ? "از ایده‌ای\nتا مدل آماده تولید" : "From Concept\nTo Production-Ready Models"}
                    </h2>
                    <p className="mt-8 text-white/55 text-lg leading-relaxed max-w-2xl">
                        {isFa
                            ? "هر قطعه در AUREL به ترکیبی از طراحی، دانش فنی و تجربه تولید متکی است تا نتایجی ظریف و آماده تولید ارائه دهد."
                            : "Every piece at AUREL is developed through a combination of design vision, technical expertise, and real manufacturing experience to ensure refined and production-ready results."}
                    </p>
                </div>

                {/* Main Layout */}
                <div className="grid lg:grid-cols-2 gap-24 items-start">
                    {/* LEFT — Timeline */}
                    <div className="relative">
                        <div className="sticky top-28 space-y-14">
                            {steps.map((step) => (
                                <div key={step.id} onMouseEnter={() => setActive(step.id)} onClick={() => setActive(step.id)} className="group cursor-pointer">
                                    <div className="flex items-start gap-6">
                                        <span className={`text-sm mt-3 transition-all duration-500 ${active === step.id ? "text-[#C6A66A]" : "text-white/20"}`}>
                                            0{step.id}
                                        </span>
                                        <div>
                                            <h3 className={`text-3xl md:text-4xl font-light transition-all duration-500 ${active === step.id ? "text-white" : "text-white/30"}`}>
                                                {isFa ? step.title_fa : step.title_en}
                                            </h3>
                                            <div className={`h-[1px] mt-5 transition-all duration-700 ${active === step.id ? "w-32 bg-[#C6A66A]" : "w-12 bg-white/10"}`} />
                                            <div className={`overflow-hidden transition-all duration-700 ${active === step.id ? "max-h-40 opacity-100 mt-6" : "max-h-0 opacity-0"}`}>
                                                <p className="text-white/60 leading-relaxed max-w-md text-lg">
                                                    {isFa ? step.desc_fa : step.desc_en}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT — Cinematic Visual */}
                    <div className="relative min-h-[650px] flex items-center justify-center">
                        <div className="relative w-full h-[620px] rounded-[32px] overflow-hidden border border-white/10 bg-gradient-to-br from-[#111] via-[#090909] to-black">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className={`w-[320px] h-[320px] rounded-full blur-[120px] transition-all duration-700 ${active === 1 ? "bg-[#D4AF37]/25" : active === 2 ? "bg-white/10" : active === 3 ? "bg-[#D4AF37]/20" : "bg-[#d4b06a]/30"}`} />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[180px] md:text-[240px] font-extralight tracking-tight text-white/[0.04] transition-all duration-700">0{active}</span>
                            </div>

                            {/* ✅ ترجمه شده */}
                            <div className="absolute top-10 left-10 text-white/40 text-sm tracking-[0.3em] uppercase">
                                {isFa ? "فرآیند آتلیه" : "Atelier Process"}
                            </div>
                            <div className="absolute bottom-10 right-10 text-[#D4AF37] text-sm tracking-[0.3em] uppercase">
                                {isFa ? "گردش تولید" : "Production Workflow"}
                            </div>

                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-10">
                                <h3 className="text-4xl md:text-5xl font-extralight text-white mb-6">{isFa ? steps[active - 1].title_fa : steps[active - 1].title_en}</h3>
                                <p className="text-white/55 max-w-md leading-relaxed text-lg">{isFa ? steps[active - 1].desc_fa : steps[active - 1].desc_en}</p>
                            </div>
                            <div className="absolute inset-6 border border-white/[0.04] rounded-[24px]" />
                            <div className="absolute inset-0 opacity-[0.53] mix-blend-soft-light" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}