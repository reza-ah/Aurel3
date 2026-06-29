// components/contact/contact-section.tsx

type Props = {
    locale: "fa" | "en"
}

export function ContactSection({ locale }: Props) {
    const isFa = locale === "fa"

    return (
        <div className="space-y-8">
            <div>
                <p className="mb-3 text-sm uppercase tracking-[0.25em] text-[#D4AF37]">
                    {isFa ? "ارتباط با AUREL" : "Contact AUREL"}
                </p>

                <h2 className="text-3xl font-light md:text-4xl">
                    {isFa
                        ? "جزییات پروژه خود را  با ما مطرح کنید."
                        : "Let’s Discuss Your Jewelry Project"}
                </h2>
            </div>

            <p className="max-w-xl leading-8 text-white/60">
                {isFa
                    ? "برای طراحی جواهرات، مدلسازی سه‌بعدی، پرینت تخصصی و آماده‌سازی تولید یا همکاری‌های حرفه‌ای، با استودیو AUREL در ارتباط باشید."
                    : "Contact AUREL for jewelry design, precision 3D modeling, professional printing, production preparation, or professional collaborations."}
            </p>

            <div className="space-y-6 border-t border-white/10 pt-8">
                {/* Email */}
                <div>
                    <p className="mb-2 text-sm text-[#C6A86A]">
                        {isFa ? "ایمیل" : "Email"}
                    </p>
                    <a href="mailto:info@aurelstudio.com" className="text-white/80 transition-colors duration-300 hover:text-[#D4AF37]">
                        info@aurelstudio.com
                    </a>
                </div>

                {/* Phone */}
                <div>
                    <p className="mb-2 text-sm text-[#C6A86A]">
                        {isFa ? "تلفن" : "Phone"}
                    </p>
                    <a href="tel:+989122987123" dir="ltr" className={`block text-white/80 transition-colors duration-300 hover:text-[#D4AF37] ${isFa ? "text-right" : "text-left"}`}>
                        +98 912 2 987 123
                    </a>
                </div>

                {/* Address */}
                <div>
                    <p className="mb-2 text-sm text-[#C6A86A]">
                        {isFa ? "آدرس" : "Address"}
                    </p>
                    <a href="https://www.google.com/maps/search/?api=1&query=35.67639440068573,51.4127901957651" target="_blank" rel="noopener noreferrer" className="leading-7 text-white/80 transition-colors duration-300 hover:text-[#D4AF37]">
                        {isFa ? "تهران، خیابان 15 خرداد" : "Tehran, Iran"}
                    </a>
                </div>

                {/* Working Hours */}
                <div>
                    <p className="mb-2 text-sm text-[#C6A86A]">
                        {isFa ? "ساعات کاری" : "Working Hours"}
                    </p>
                    <p className="text-white/80">
                        {isFa ? "شنبه تا پنجشنبه — ۹ صبح تا ۷ عصر" : "Saturday — Thursday | 9 AM — 7 PM"}
                    </p>
                </div>
            </div>
        </div>
    )
}