import FAQAccordion from "@/features/journal/components/faq-accordion";


import Reveal from "@/components/reveal";
import { headers } from "next/headers";
import Link from "next/link";

export default async function Page({
    params,
}: {
    params: { locale: "en" | "fa" };
}) {
    const { locale } = await params;
    const isFa = locale === "fa";

    const headersList = await headers();
    const host = headersList.get("host");

    const protocol = "http";

    const res = await fetch(
        `${protocol}://${host}/api/atelier-dashboard/faq?locale=${locale}`,
        { cache: "no-store" }
    );

    let faqItems: any[] = [];

    if (res.ok) {
        try {
            faqItems = await res.json();
        } catch {
            faqItems = [];
        }
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

                <FAQAccordion locale={locale} items={faqItems} />

                <Reveal className="mt-32">
                    <div className="relative overflow-hidden border border-white/10 rounded-2xl py-16 px-8 md:px-16 text-center">

                        <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/10 via-transparent to-transparent pointer-events-none" />

                        <div className="relative max-w-2xl mx-auto">

                            <h2 className="text-3xl md:text-4xl font-light mb-6">
                                {isFa
                                    ? "پاسخ سوال خود را پیدا نکردید؟"
                                    : "Didn't Find Your Answer?"}
                            </h2>

                            <p className="text-gray-400 leading-relaxed mb-10">
                                {isFa
                                    ? "اگر پاسخ سوال مورد نظر خود را در این صفحه پیدا نکردید، می‌توانید از طریق صفحه تماس با ما با ما در ارتباط باشید. ما با خوشحالی به سوالات شما پاسخ می‌دهیم."
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