import { getPricingCategories, getPricingItems } from "@/lib/sanity";
import PricingAccordion from "@/features/pricing/components/pricing-accordion";
import Reveal from "@/components/reveal";
import ServiceSchema from "@/components/seo/service-schema";
import type { Metadata } from "next";

const BASE_URL = "https://www.aureldesign.ir";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: "en" | "fa" }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const isFa = locale === "fa";
    const currentUrl = `${BASE_URL}/${locale}/pricing`;

    return {
        title: isFa
            ? "خدمات و تعرفه‌ها | استودیو طراحی جواهرات آرل"
            : "Services & Pricing | Aurel Jewelry Design Studio",
        description: isFa
            ? "مشاهده تعرفه خدمات طراحی جواهرات، مدل‌سازی سه‌بعدی، پرینت و ریخته‌گری حرفه‌ای"
            : "Explore pricing for professional jewelry design, 3D modeling, printing, and casting services",
        alternates: {
            canonical: currentUrl,
            languages: {
                fa: `${BASE_URL}/fa/pricing`,
                en: `${BASE_URL}/en/pricing`,
                "x-default": `${BASE_URL}/en/pricing`,
            },
        },
        openGraph: {
            title: isFa ? "خدمات و تعرفه‌ها | استودیو آرل" : "Services & Pricing | Aurel Design Studio",
            description: isFa
                ? "مشاهده تعرفه خدمات طراحی جواهرات"
                : "Explore pricing for professional jewelry design services",
            url: currentUrl,
            siteName: "Aurel Jewelry Design Studio",
            type: "website",
        },
    };
}

export default async function PricingPage({
    params,
}: {
    params: Promise<{ locale: "en" | "fa" }>;
}) {
    const { locale } = await params;
    const isFa = locale === "fa";

    const categories = await getPricingCategories();
    const items = await getPricingItems();

    const services = isFa
        ? [
            {
                name: "طراحی جواهر",
                description: "تبدیل ایده‌ها، رفرنس‌ها یا اسکچ‌های دستی به طراحی‌های جواهر آماده تولید با تمرکز بر زیبایی‌شناسی، تعادل و دقت فنی.",
            },
            {
                name: "مدل‌سازی سه‌بعدی جواهر",
                description: "مدل‌سازی CAD با دقت بالا با استفاده از Rhino و MatrixGold برای ساختارهای مهندسی شده، همراه با ZBrush برای فرم‌های ارگانیک و مجسمه‌سازی پیشرفته.",
            },
            {
                name: "پرینت سه‌بعدی جواهر",
                description: "پرینت سه‌بعدی حرفه‌ای با استفاده از رزین‌های قابل ریخته‌گری تخصصی و موم Projet، با استفاده از سیستم‌های صنعتی با دقت بالا.",
            },
            {
                name: "ریخته‌گری و تولید",
                description: "آماده‌سازی آماده تولید و ریخته‌گری در طلا یا نقره مطابق با استانداردهای حرفه‌ای تولید جواهرات.",
            },
        ]
        : [
            {
                name: "Jewelry Design",
                description: "Transforming concepts, references, or hand sketches into production-ready jewelry designs with a focus on aesthetics, balance, and technical precision.",
            },
            {
                name: "3D Jewelry Modeling",
                description: "High-precision CAD modeling using Rhino and MatrixGold for engineered structures, combined with ZBrush for organic forms and advanced sculpting.",
            },
            {
                name: "3D Printing for Jewelry",
                description: "Professional 3D printing using Projet wax and specialized castable resins, powered by high-precision industrial systems to achieve exceptional detail.",
            },
            {
                name: "Casting & Production",
                description: "Production-ready preparation and casting in gold or silver according to professional jewelry manufacturing standards.",
            },
        ];

    return (
        <main className="min-h-screen bg-transparent text-white">

            <ServiceSchema services={services} locale={locale} />

            <section className="relative overflow-hidden pt-32 pb-20">

                <div className="container mx-auto max-w-7xl px-6 relative z-10">

                    <Reveal className="flex flex-col items-center text-center" disableAnimation>
                        <span className="text-4xl md:text-4xl uppercase tracking-[0.2em] text-[#d4af37] mb-6 font-light">
                            {isFa ? "خدمات و تعرفه ها" : "Services & Pricing"}
                        </span>

                        <h1 className="text-4xl md:text-6xl font-light tracking-tight">
                            {isFa ? "طراحی و ساخت بدون محدودیت برای تولید حرفه‌ای" : "Design Beyond Limits For Professional Production"}
                        </h1>

                        <div className="h-px w-24 bg-[#d4af37]/30 my-8" />

                        <p className="max-w-4xl text-text-secondary text-base md:text-lg leading-relaxed">
                            {isFa
                                ? "در این بخش می‌توانید تعرفه تقریبی خدمات طراحی، مدل‌سازی و تولید جواهرات را مشاهده کنید. خدمات ما از ایده‌پردازی و طراحی اولیه تا مدل‌سازی سه‌بعدی، پرینت و تولید نهایی را در بر می‌گیرد. هزینه نهایی هر پروژه با توجه به پیچیدگی طراحی، میزان جزئیات و زمان موردنیاز تعیین می‌شود."
                                : "In this section you can see the approximate pricing for jewelry design, modeling, and production services. Our services range from initial ideation and design to 3D modeling, printing, and final production. The final cost of each project is determined by the complexity of the design, the level of detail, and the time required. For a detailed quote, please contact us directly."}
                        </p>

                    </Reveal>
                </div>
            </section>

            <section className="container mx-auto max-w-7xl px-6 pb-32">
                <PricingAccordion
                    locale={locale}
                    categories={categories}
                    items={items}
                />
            </section>

        </main>
    );
}