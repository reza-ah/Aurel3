import { ContactHero } from "@/features/contact/components/contact-hero";
import { ContactSection } from "@/features/contact/components/contact-section";
import { ContactTabs } from "@/features/contact/components/contact-tabs";
import type { Metadata } from "next";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: "en" | "fa" }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const isFa = locale === "fa";
    return {
        title: isFa
            ? "سفارش طراحی جواهر | استودیو Aurel"
            : "Custom Jewelry Order | Aurel Design Studio",
        description: isFa
            ? "سفارش طراحی و ساخت جواهر اختصاصی. طراحی سه‌بعدی، مدل‌سازی و ریخته‌گری حرفه‌ای جواهرات"
            : "Order custom jewelry design and manufacturing. Professional CAD design, 3D modeling and casting services",
    };
}

export default async function ContactPage({
    params,
}: {
    params: { locale: "en" | "fa" };
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

                    {/* فقط دسکتاپ نشون میده */}
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