import Image from "next/image";
import { FaLinkedinIn } from "react-icons/fa";

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
                            src="/images/founder.jpg"
                            alt="Reza Ahmadnian - Aurel Design Studio Founder - Professional jewelry designer with 15+ years experience"
                            width={900}
                            height={1100}
                            sizes="(max-width: 768px) 100vw, 50vw"
                            loading="lazy"
                            className="h-full w-full object-cover"
                        />
                    </div>

                    {/* subtle gold border */}
                    <div className="absolute -inset-2 rounded-xl border border-[#C6A66A]/20 pointer-events-none" />
                </div>

                {/* text side */}
                <div className={`${isFa ? "text-right" : "text-left"}`}>
                    <p className="mb-6 text-sm tracking-[0.35em] text-[#D4AF37] uppercase">
                        {isFa ? "بنیان‌گذار و طراح ارشد" : "Founder & Lead Designer"}
                    </p>

                    <h2 className="mb-8 text-4xl md:text-5xl font-light leading-tight">
                        {isFa
                            ? "طراحی جواهرات\nبر پایه تجربه واقعی در تولید"
                            : "Jewelry Design\nBuilt on Real Manufacturing Experience"}
                    </h2>

                    <p className="text-[#e5e5e5] leading-relaxed mb-6 text-lg whitespace-pre-line">
                        {isFa
                            ? "فعالیت AUREL بر پایه تجربه مستقیم در تمام مراحل طراحی و تولید جواهرات شکل گرفته است؛ از ساخت سنتی، مخراج‌کاری و فرآیندهای تولیدی تا مدل‌سازی سه‌بعدی پیشرفته، پرینت حرفه‌ای و آماده‌سازی برای ریخته‌گری. این شناخت فنی و عملی باعث می‌شود هر مدل، علاوه بر ظرافت بصری، کاملاً منطبق بر واقعیت ساخت باشد."
                            : "AUREL was built upon hands-on experience across every stage of jewelry design and production — from traditional craftsmanship, stone setting, and manufacturing processes to advanced 3D modeling, professional printing, and casting preparation. This technical and practical understanding allows every piece to be not only visually refined, but fully aligned with real production requirements."}
                    </p>

                    <p className="text-[#e5e5e5] leading-relaxed mb-6 text-lg">
                        {isFa
                            ? "امروز تمرکز استودیو بر طراحی مفهومی جواهر، مدل‌سازی دقیق سه‌بعدی و توسعه مدل‌های آماده تولید حرفه‌ای است که پیش از آغاز ساخت، با دقت در فضای دیجیتال بازبینی، اصلاح و بهینه‌سازی می‌شوند."
                            : "Today, the studio focuses on conceptual jewelry design, precision 3D modeling, and developing professional production-ready models that are carefully reviewed, refined, and optimized in the digital stage before manufacturing begins."}
                    </p>

                    {/* ✅ جمله کوتاه جدید */}
                    <p className="text-[#e5e5e5] leading-relaxed mb-10 text-base italic border-r-2 border-[#D4AF37]/40 pr-4">
                        {isFa
                            ? "با ۱۵+ سال تجربه در طراحی و ساخت جواهرات، ارائه‌دهنده خدمات تخصصی از ایده‌پردازی تا تولید"
                            : "With 15+ years of experience in jewelry design and manufacturing, providing specialized services from ideation to production"}
                    </p>

                    {/* ✅ نام بنیان‌گذار + لینک LinkedIn */}
                    <div className="mt-10 pt-8 border-t border-white/10">
                        <p className="text-xl font-light text-white mb-2">
                            {isFa ? "رضا احمدنیان" : "Reza Ahmadnian"}
                        </p>
                        <p className="text-[#D4AF37] tracking-widest text-sm uppercase mb-4">
                            {isFa ? "بنیان‌گذار و طراح ارشد" : "Founder & Lead Designer"}
                        </p>
                        <a
                            href="https://www.linkedin.com/in/reza-ahmadnian-215b44b9/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-[#e5e5e5] hover:text-[#D4AF37] transition-colors duration-300"
                            aria-label="LinkedIn Profile"
                        >
                            <FaLinkedinIn className="text-base" />
                            <span className="tracking-wide">
                                {isFa ? "مشاهده پروفایل لینکدین" : "View LinkedIn Profile"}
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}