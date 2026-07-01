import FAQAccordion from "@/features/journal/components/faq-accordion";
import Reveal from "@/components/reveal";
import Link from "next/link";

export default async function Page({
    params,
}: {
    params: Promise<{ locale: "en" | "fa" }>;
}) {
    const { locale } = await params;
    const isFa = locale === "fa";

    // ✅ اصلاح: استفاده از URL کامل
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.aureldesign.ir";

    let faqItems: any[] = [];

    try {
        const res = await fetch(
            `${baseUrl}/api/atelier-dashboard/faq?locale=${locale}`,
            {
                cache: "no-store",
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        if (res.ok) {
            faqItems = await res.json();
            console.log(`FAQ items for ${locale}:`, faqItems.length);
        } else {
            console.error(`FAQ API error: ${res.status}`);
        }
    } catch (error) {
        console.error("FAQ fetch error:", error);
        faqItems = [];
    }

    return (
        <section className="py-32">
            <div className="container mx-auto max-w-7xl px-6">

                <Reveal className="text-center mb-20">
                    <span className="text-sm uppercase tracking-[0.4em] text-[#d4af37] mb-6 block">
                        FAQ
                    </span>

                    <h1 className="text-5xl md:text-6xl font-light tracking-tight">
                        {isFa ? "سوالات متداول" : "Frequently Asked Questions"}
                    </h1>
                </Reveal>

                {faqItems.length > 0 ? (
                    <FAQAccordion locale={locale} items={faqItems} />
                ) : (
                    <div className="text-center text-white/60 py-12">
                        {isFa ? "هیچ سوالی یافت نشد" : "No FAQs found"}
                    </div>
                )}

                <Reveal className="mt-32">
                    <div className="relative overflow-hidden border border-white/10 rounded-2xl py-16 px-8 md:px-16 text-center">

                        <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/10 via-transparent to-transparent pointer-events-none" />

                        <div className="relative max-w-2xl mx-auto">

                            <h2 className="text-3xl md:text-4xl font-light mb-6">
                                {isFa
                                    ? "پاسخ سوال خود را پیدا نکردید؟"
                                    : "Didn't Find Your Answer?"}
                            </h2>

                            <p className="text-white/70 leading-relaxed mb-10">
                                {isFa
                                    ? "اگر پاسخ سوال مورد نظر خود را پیدا نکردید، می‌توانید از طریق صفحه تماس با ما در ارتباط باشید. ما با کمال میل به سوالات شما پاسخ می‌دهیم."
                                    : "If you couldn't find the answer you're looking for, feel free to reach out through our contact page. Our team will be happy to assist you."}
                            </p>

                            <Link
                                href={`/${locale}/contact`}
                                className="inline-flex items-center justify-center px-10 py-4 border border-[#d4af37] text-[#d4af37] rounded-full hover:bg-[#d4af37] hover:text-black transition-all duration-300"
                            >
                                {isFa ? "تماس با ما" : "Contact Us"}
                            </Link>

                        </div>
                    </div>
                </Reveal>

            </div>
        </section>
    );
}