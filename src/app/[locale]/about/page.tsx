import PageBase from "@/components/page-base";
import AboutHero from "@/components/about/about-hero";
import CreativeProcess from "@/components/about/creative-process";
import FounderStory from "@/components/about/founder-story";
import DesignPhilosophy from "@/components/about/design-philosophy";
import SignatureMetrics from "@/components/about/signature-metrics";
import AboutCTA from "@/components/about/about-cta";
import type { Metadata } from "next";

const BASE_URL = "https://www.aureldesign.ir";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: "en" | "fa" }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const isFa = locale === "fa";
    const currentUrl = `${BASE_URL}/${locale}/about`;

    return {
        title: isFa
            ? "درباره ما | استودیو طراحی جواهرات Aurel"
            : "About Us | Aurel Jewelry Design Studio",
        description: isFa
            ? "استودیو آرل با سال‌ها تجربه در طراحی و ساخت جواهرات لوکسی، خدمات حرفه‌ای به برندها و کارگاه‌های جواهرسازی ارائه می‌دهد"
            : "Aurel studio brings years of experience in luxury jewelry design and manufacturing, serving jewelry brands and workshops worldwide",
        alternates: {
            canonical: currentUrl,
            languages: {
                fa: `${BASE_URL}/fa/about`,
                en: `${BASE_URL}/en/about`,
                "x-default": `${BASE_URL}/en/about`,
            },
        },
        openGraph: {
            title: isFa ? "درباره ما | استودیو آرل" : "About Us | Aurel Design Studio",
            description: isFa
                ? "استودیو طراحی جواهرات آرل با سال‌ها تجربه در طراحی و ساخت جواهرات لوکس"
                : "Aurel studio brings years of experience in luxury jewelry design and manufacturing",
            url: currentUrl,
            siteName: "Aurel Jewelry Design Studio", // ✅ اضافه شد
            type: "website",
        },
    };
}

export default async function Page({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = (await params) as { locale: "en" | "fa" };
    const isFa = locale === "fa";

    return (
        // @ts-expect-error PageBase accepts showGrid at runtime.
        <PageBase showGrid={true} dir={isFa ? "rtl" : "ltr"}>
            {/* Cinematic Hero */}
            <AboutHero locale={locale} />

            {/* Founder Story */}
            <FounderStory locale={locale} />

            {/* Interactive Creative Process */}
            <CreativeProcess locale={locale} />

            {/* Design Philosophy */}
            <DesignPhilosophy locale={locale} />

            {/* Signature Metrics */}
            <SignatureMetrics locale={locale} />

            {/* Final CTA */}
            <AboutCTA locale={locale} />
        </PageBase>
    );
}