import { ContactHero } from "@/features/contact/components/contact-hero";
import { ContactSection } from "@/features/contact/components/contact-section";
import { ContactTabs } from "@/features/contact/components/contact-tabs";
import type { Metadata } from "next";

const BASE_URL = "https://www.aureldesign.ir";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: "en" | "fa" }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const isFa = locale === "fa";
    const currentUrl = `${BASE_URL}/${locale}/contact`;

    return {
        title: isFa
            ? "سفارش طراحی جواهر | استودیو Aurel"
            : "Custom Jewelry Order | Aurel Design Studio",
        description: isFa
            ? "سفارش طراحی و ساخت جواهر اختصاصی. طراحی سه‌بعدی، مدل‌سازی و ریخته‌گری حرفه‌ای جواهرات"
            : "Order custom jewelry design and manufacturing. Professional CAD design, 3D modeling and casting services",
        alternates: {
            canonical: currentUrl,
            languages: {
                fa: `${BASE_URL}/fa/contact`,
                en: `${BASE_URL}/en/contact`,
                "x-default": `${BASE_URL}/en/contact`,
            },
        },
        openGraph: {
            title: isFa ? "سفارش طراحی جواهر | استودیو Aurel" : "Custom Jewelry Order | Aurel Design Studio",
            description: isFa
                ? "سفارش طراحی و ساخت جواهر اختصاصی با کیفیت حرفه‌ای"
                : "Order custom jewelry design and manufacturing with professional quality",
            url: currentUrl,
            siteName: "Aurel Jewelry Design Studio", // ✅ اضافه شد
            type: "website",
        },
    };
}

export default async function ContactPage({
    params,
}: {
    params: Promise<{ locale: "en" | "fa" }>;
}) {
    const { locale } = await params;

    return (
        <main
            dir={locale === "fa" ? "rtl" : "ltr"}
            className="min-h-screen bg-transparent text-[#F5F1E8]"
        >
            <ContactHero locale={locale} />

            <div className="container-lux py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* فیلد دسکتاپ نمایش داده می‌شود */}
                    <div className="hidden lg:block w-full">
                        <ContactSection locale={locale} />
                    </div>

                    <div className="w-full">
                        <ContactTabs locale={locale} />
                    </div>

                </div>
            </div>
        </main>
    );
}