type Props = {
    locale: string
}

export function ContactHero({ locale }: Props) {
    const isFa = locale === "fa"

    return (
        <section className="hero-section relative">
            {/* استفاده از کلاس جدید برای گرادینت که در css تعریف کردیم */}
            <div className="absolute inset-0 bg-hero-gradient" />

            {/* پدینگ بالا حفظ شد تا مشکل رفتن زیر هدر پیش نیاید */}
            <div className="relative container-lux text-center pt-32 pb-16 md:pt-40 md:pb-24">
                <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[var(--color-gold-studio)]">
                    {isFa ? "استودیو طراحی جواهرات AUREL" : "AUREL Jewelry Design Studio"}
                </p>

                <h1 className="mx-auto max-w-4xl text-4xl font-light leading-tight md:text-6xl text-white">
                    {isFa
                        ? "برای سفارش و همکاری با ما در ارتباط باشید"
                        : "Get in Touch for Orders & Professional Collaboration"}
                </h1>

                <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-[#e5e5e5] md:text-base">
                    {isFa
                        ? "برای ثبت سفارش طراحی، مدلسازی و پرینت از فرم سفارش استفاده کنید. برای اطلاعات بیشتر و مشاوره از فرم تماس با ما استفاده کنید."
                        : "For submitting design, modeling, and printing orders, please use the order form. For more information and consultation, please use the contact form."}
                </p>
            </div>
        </section>
    )
}