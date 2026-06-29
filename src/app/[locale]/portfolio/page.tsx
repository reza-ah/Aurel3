// src/app/[locale]/portfolio/page.tsx
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';
import { getPortfolioItems } from "@/lib/sanity";

import PortfolioGrid from "@/features/portfolio/components/portfolio-grid";

export async function generateMetadata({
    params,
}: {
    params: { locale: "en" | "fa" };
}): Promise<Metadata> {
    const isFa = params.locale === "fa";
    return {
        title: isFa
            ? "نمونه‌کارها | استودیو طراحی جواهرات اورل"
            : "Portfolio | Aurel Jewelry Design Studio",
        description: isFa
            ? "نمونه‌کارهای طراحی و ساخت جواهرات اورل. مدل‌های سه‌بعدی، طلا و جواهر دست‌ساز"
            : "Aurel jewelry design portfolio. CAD models, 3D printed and cast jewelry pieces",
    };
}




type PortfolioItem = {
    id: number;
    slug: string;

    title_fa: string;
    title_en: string;

    category_fa: string;
    category_en: string;

    featured: boolean;

    cover_image?: {
        id: string;
    };

    tags?: {
        portfolio_tags_id?: {
            id: number;
            slug: string;
            title?: string;
        };
    }[];
};

type Props = {
    params: Promise<{
        locale: string;
    }>;
};

export default async function PortfolioPage({
    params,
}: Props) {

    const { locale } = await params;

    const isFa =
        locale === "fa";

    const portfolioItems:
        PortfolioItem[] =
        await getPortfolioItems();

    return (

        <main className="
            min-h-screen
            bg-transparent
            text-white
        ">

            <section className="
                max-w-7xl
                mx-auto
                px-6
                py-24
            ">

                {/* HEADER */}

                <div className="mb-20">

                    <p className="
                        text-zinc-400
                        uppercase
                        tracking-[0.3em]
                        text-sm
                        mb-4
                    ">
                        {isFa
                            ? "نمونه کارها"
                            : "Portfolio"}
                    </p>

                    <h1 className="
                        text-5xl
                        md:text-7xl
                        font-light
                        leading-tight
                    ">
                        {isFa
                            ? "مجموعه پروژه‌ها"
                            : "Selected Projects"}
                    </h1>

                </div>

                {/* FILTERABLE GRID */}

                <PortfolioGrid
                    locale={locale}
                    items={portfolioItems}
                />

            </section>

        </main>

    );

}