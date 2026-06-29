import PageBase from "@/components/page-base";
import AboutHero from "@/components/about/about-hero";
import CreativeProcess from "@/components/about/creative-process";
import FounderStory from "@/components/about/founder-story";
import DesignPhilosophy from "@/components/about/design-philosophy";
import SignatureMetrics from "@/components/about/signature-metrics";
import AboutCTA from "@/components/about/about-cta";
import type { Metadata } from "next";

export async function generateMetadata({
    params,
}: {
    params: { locale: "en" | "fa" };
}): Promise<Metadata> {
    const isFa = params.locale === "fa";
    return {
        title: isFa
            ? "درباره ما | استودیو طراحی جواهرات Aurel"
            : "About Us | Aurel Jewelry Design Studio",
        description: isFa
            ? "استودیو اورل با سال‌ها تجربه در طراحی و ساخت جواهرات لوکس، خدمات حرفه‌ای به برندها و کارگاه‌های جواهرسازی ارائه می‌دهد"
            : "Aurel studio brings years of experience in luxury jewelry design and manufacturing, serving jewelry brands and workshops worldwide",
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
