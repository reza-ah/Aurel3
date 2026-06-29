"use client";

import { motion } from "framer-motion";

const metrics = {
    en: [
        { value: "15+", label: "Years of Experience", description: "Hands-on experience across jewelry design, manufacturing, stone setting, 3D modeling, and professional production workflows." },
        { value: "5000+", label: "Professional Projects", description: "Production-ready jewelry models developed for brands, galleries, workshops, and custom jewelry collections." },
        { value: "100%", label: "Production-Ready", description: "Every model is developed with real manufacturing standards, casting feasibility, stone setting accuracy, and technical precision in mind." },
        { value: "CAD", label: "Advanced Modeling", description: "Precision modeling with Rhino, MatrixGold, and ZBrush for professionally engineered jewelry development." },
    ],
    fa: [
        { value: "۱۵+", label: "سال تجربه تخصصی", description: "تجربه مستقیم در طراحی جواهرات، تولید، مخراجکاری، مدلسازی سه‌بعدی و فرآیندهای تخصصی ساخت." },
        { value: "۵۰۰۰+", label: "پروژه حرفه‌ای", description: "توسعه مدل‌های حرفه‌ای و قابل تولید برای برندها، گالری‌ها، کارگاه‌های طلاسازی و کالکشن‌های اختصاصی." },
        { value: "۱۰۰٪", label: "آماده تولید", description: "تمام مدل‌ها با درنظر گرفتن ضخامت، وزن، مخراجکاری، ریخته‌گری و استانداردهای واقعی تولید توسعه پیدا می‌کنند." },
        { value: "CAD", label: "مدلسازی تخصصی", description: "مدلسازی دقیق با Rhino، MatrixGold و ZBrush برای توسعه جواهرات حرفه‌ای با جزئیات مهندسی‌شده." },
    ],
};

export default function SignatureMetrics({ locale = "en" }: { locale?: string }) {
    const isFa = locale === "fa";
    const content = isFa ? metrics.fa : metrics.en;

    return (
        <section className="relative overflow-hidden py-32">
            <div className="container-lux">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className={`mb-20 ${isFa ? "text-right" : "text-left"}`}
                >
                    <p className="mb-6 text-sm uppercase tracking-[0.45em] text-[var(--color-gold-studio)]">
                        {isFa ? "استانداردهای AUREL" : "AUREL Standards"}
                    </p>
                    <h2 className="text-4xl md:text-6xl font-light leading-[1.1] text-[var(--color-text-primary)]">
                        {isFa ? "تجربه واقعی تولید\nدر کنار طراحی دقیق" : "Real Production Experience\nCombined With Precision Design"}
                    </h2>
                </motion.div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {content.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="lux-card group p-10 md:p-12 transition-all duration-500 hover:border-[var(--color-gold-studio)]/30"
                        >
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[var(--color-gold-studio)]/0 via-[var(--color-gold-studio)]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="mb-6 text-5xl md:text-6xl font-light text-[var(--color-gold-studio)]">
                                {item.value}
                            </div>
                            <h3 className="mb-4 text-xl font-light text-[var(--color-text-primary)] tracking-wide">
                                {item.label}
                            </h3>
                            <p className="text-sm md:text-base leading-relaxed text-[var(--color-text-muted)]/70 group-hover:text-[var(--color-text-muted)] transition-colors">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}