import Image from "next/image";

type Props = {
    locale: string;
};

export default function FounderStory({ locale }: Props) {
    const isFa = locale === "fa";

    return (
        <section className="relative py-24 md:py-32 overflow-hidden">
            <div className="relative mx-auto max-w-7xl px-6 grid gap-16 md:grid-cols-2 items-center">

                {/* image side */}
                <div className="relative">
                    <div className="relative overflow-hidden rounded-xl">
                        <Image
                            src="/images/founder.webp"
                            alt="Founder"
                            width={900}
                            height={1100}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    {/* subtle gold border */}
                    <div className="absolute -inset-2 rounded-xl border border-[#C6A66A]/20 pointer-events-none" />
                </div>

                {/* text side */}
                <div className={`${isFa ? "text-right" : "text-left"}`}>
                    <p className="mb-6 text-sm tracking-[0.35em] text-[#D4AF37] uppercase">
                        {isFa ? "نگاه بنیان‌گذار" : "Founder"}
                    </p>

                    <h2 className="mb-8 text-4xl md:text-5xl font-light leading-tight">
                        {isFa
                            ? "طراحی جواهرات\nبر پایه تجربه واقعی در تولید"
                            : "Jewelry Design\nBuilt on Real Manufacturing Experience"}
                    </h2>

                    <p className="text-white/70 leading-relaxed mb-6 text-lg whitespace-pre-line">
                        {isFa
                            ? "فعالیت AUREL بر پایه تجربه مستقیم در تمامی مراحل طراحی و تولید جواهرات شکل گرفته است؛ از ساخت سنتی، مخراجکاری و فرآیندهای تولید، تا مدلسازی سه‌بعدی، پرینت تخصصی و آماده‌سازی برای ریخته‌گری. این شناخت فنی و اجرایی باعث می‌شود هر مدل، علاوه بر زیبایی بصری، کاملاً قابل تولید و منطبق با واقعیت ساخت باشد."
                            : "AUREL was built upon hands-on experience across every stage of jewelry design and production — from traditional craftsmanship, stone setting, and manufacturing processes to advanced 3D modeling, professional printing, and casting preparation. This technical and practical understanding allows every piece to be not only visually refined, but fully aligned with real production requirements."}
                    </p>

                    <p className="text-white/70 leading-relaxed mb-6 text-lg">
                        {isFa
                            ? "امروز تمرکز استودیو بر طراحی مفهومی، مدلسازی دقیق و توسعه مدل‌های آماده تولید است؛ آثاری که پیش از ورود به مرحله ساخت، در فضای دیجیتال به‌طور کامل بررسی، اصلاح و بهینه‌سازی می‌شوند."
                            : "Today, the studio focuses on conceptual jewelry design, precision 3D modeling, and developing professional production-ready models that are carefully reviewed, refined, and optimized in the digital stage before manufacturing begins."}
                    </p>

                    <p className="text-[#D4AF37] tracking-widest text-sm mt-10">
                        {isFa
                            ? "— بنیان‌گذار AUREL Studio"
                            : "— Founder of AUREL Studio"}
                    </p>
                </div>
            </div>
        </section>
    );
}