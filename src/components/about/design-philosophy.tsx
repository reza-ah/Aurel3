type Props = {
    locale: string;
};

export default function DesignPhilosophy({ locale }: Props) {
    const isFa = locale === "fa";

    return (
        <section
            className="relative overflow-hidden"
            dir={isFa ? "rtl" : "ltr"}
        >
            <div className="relative mx-auto max-w-7xl px-6 py-36 md:py-44">

                <div className="grid lg:grid-cols-2 gap-24 items-center">

                    {/* LEFT — Philosophy Quote */}
                    <div className="max-w-xl">

                        <p className="text-sm uppercase tracking-[0.45em] text-[#C6A66A] mb-10">
                            {isFa ? "فلسفه طراحی" : "Design Philosophy"}
                        </p>

                        <h2 className="text-5xl md:text-6xl font-extralight text-white leading-[1.1] whitespace-pre-line">
                            {isFa
                                ? "جواهرات باید\nزیبا، دقیق و قابل تولید باشند"
                                : "Jewelry should be\nbeautiful, precise, and manufacturable"}
                        </h2>

                        <p className="mt-10 text-xl text-[#e5e5e5] leading-relaxed">
                            {isFa
                                ? "طراحی، فراتر از زیبایی است."
                                : "Design Beyond Aesthetics."}
                        </p>
                    </div>

                    {/* RIGHT — Philosophy Text */}
                    <div className="max-w-xl text-[#e5e5e5] space-y-10 text-lg leading-relaxed">

                        <p>
                            {isFa
                                ? "در AUREL طراحی جواهرات تنها به ظاهر قطعه محدود نمی‌شود؛ هر مدل با درنظر گرفتن ساختار، جزئیات فنی، راحتی استفاده و فرآیند واقعی تولید توسعه پیدا می‌کند."
                                : "At AUREL, jewelry design goes far beyond appearance. Every piece is developed with attention to structure, technical detail, wearability, and real manufacturing requirements."}
                        </p>

                        <p>
                            {isFa
                                ? "ترکیب طراحی مفهومی، مدلسازی سه‌بعدی و تجربه مستقیم در تولید، به ما اجازه می‌دهد میان زیبایی بصری و قابلیت اجرای واقعی تعادل ایجاد کنیم."
                                : "The combination of conceptual design, advanced 3D modeling, and hands-on production experience allows us to create a balance between visual elegance and practical execution."}
                        </p>

                        <p>
                            {isFa
                                ? "هر جزئیات پیش از ساخت نهایی در فضای دیجیتال بررسی و اصلاح می‌شود تا نتیجه نهایی با بالاترین دقت و استاندارد تولید آماده شود."
                                : "Every detail is carefully reviewed and refined in the digital stage before production begins, ensuring precision, consistency, and production-ready quality."}
                        </p>

                    </div>
                </div>

            </div>
        </section>
    );
}