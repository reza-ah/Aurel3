import { getPricingCategories, getPricingItems } from "@/lib/directus/client";

import PricingAccordion from "@/features/pricing/components/pricing-accordion";

import Reveal from "@/components/reveal";

export default async function PricingPage({
    params,
}: {
    params: { locale: "en" | "fa" };
}) {
    const { locale } = await params;
    const isFa = locale === "fa";

    const categories = await getPricingCategories();
    const items = await getPricingItems();

    return (
        <main className="min-h-screen bg-transparent text-white">

            {/* LUXURY HERO SECTION */}
            <section className="relative overflow-hidden pt-32 pb-20">

                <div className="container mx-auto max-w-7xl px-6 relative z-10">

                    <Reveal className="flex flex-col items-center text-center">

                        <span className="text-4xl md:text-4xl uppercase tracking-[0.2em] text-[#d4af37] mb-6 font-light">
                            {isFa ? "خدمات و تعرفه ها" : "Services & Pricing"}
                        </span>

                        <h1 className="text-4xl md:text-6xl font-light tracking-tight">
                            {isFa ? "طراحی و ساخت بدون محدودیت برای تولید حرفه‌ای" : "Design Beyond Limits For Professional Production"}
                        </h1>

                        <div className="h-px w-24 bg-[#d4af37]/30 my-8" />

                        <p className="max-w-4xl text-white/80 text-sm md:text-base leading-relaxed">
                            {isFa
                                ? "در این بخش می‌توانید تعرفه تقریبی خدمات طراحی، مدل‌سازی و تولید جواهرات را مشاهده کنید. خدمات ما از ایده‌پردازی و طراحی اولیه تا مدل‌سازی سه‌بعدی , پرینت و  تولید نهایی را در بر می‌گیرد. هزینه نهایی هر پروژه با توجه به پیچیدگی طراحی، میزان جزئیات و زمان موردنیاز تعیین می‌شود."
                                : "In this section you can see the approximate pricing for jewelry design, modeling, and production services. Our services range from initial ideation and design to 3D modeling, printing, and final production. The final cost of each project is determined by the complexity of the design, the amount of detail, and the time required."}
                        </p>

                    </Reveal>
                </div>
            </section>

            {/* MAIN CONTENT */}
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