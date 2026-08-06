import Link from "next/link"

type Props = {
    locale: string
}

export function ContactHero({ locale }: Props) {
    const isFa = locale === "fa"

    return (
        <section className="hero-section relative">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-hero-gradient" />

            <div className="relative container-lux pt-32 pb-16 text-center md:pt-40 md:pb-24">
                <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[var(--color-gold-studio)]">
                    {isFa
                        ? "استودیو طراحی جواهرات AUREL"
                        : "AUREL Jewelry Design Studio"}
                </p>

                <h1 className="mx-auto max-w-4xl text-4xl font-light leading-tight text-white md:text-6xl">
                    {isFa
                        ? "سفارش خدمات طراحی و همکاری حرفه‌ای"
                        : "Professional Jewelry Design Services & Collaboration"}
                </h1>

                <p className="mx-auto mt-6 max-w-3xl text-sm leading-8 text-[#e5e5e5] md:text-base">
                    {isFa ? (
                        <>
                            این صفحه برای ثبت سفارش خدمات طراحی، مدلسازی سه‌بعدی،
                            پرینت رزینی و همکاری با برندها، گالری‌ها و کارگاه‌های
                            طلاسازی است.
                            <br />
                            اگر قصد سفارش <strong>ساخت جواهرات سفارشی</strong> برای
                            خودتان را دارید، لطفاً از{" "}
                            <Link
                                href="/fa/custom-order"
                                className="font-medium text-[var(--color-gold-studio)] underline underline-offset-4 transition-opacity hover:opacity-80"
                            >
                                صفحه سفارش اختصاصی
                            </Link>{" "}
                            استفاده کنید.
                        </>
                    ) : (
                        <>
                            This page is intended for professional jewelry design,
                            CAD modeling, resin printing, and collaboration with
                            jewelry brands, galleries, and workshops.
                            <br />
                            If you would like to order a{" "}
                            <strong>custom-made jewelry piece</strong> for
                            yourself, please visit our{" "}
                            <Link
                                href="/en/custom-order"
                                className="font-medium text-[var(--color-gold-studio)] underline underline-offset-4 transition-opacity hover:opacity-80"
                            >
                                Custom Jewelry Order
                            </Link>{" "}
                            page.
                        </>
                    )}
                </p>
            </div>
        </section>
    )
}