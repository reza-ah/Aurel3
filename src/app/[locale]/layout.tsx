import type { Metadata } from "next";
import localFont from "next/font/local";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import AmbientLights from "@/components/ambient-lights";
import { getDictionary } from "@/lib/utils/get-dictionary";

import "../globals.css";

const vazir = localFont({
    src: "../../fonts/Vazirmatn[wght].woff2",
    variable: "--font-vazir",
    display: "swap",
    fallback: ["Arial", "sans-serif"],
});

const cormorant = localFont({
    src: "../../fonts/CormorantGaramond[wght].woff2",
    variable: "--font-cormorant",
    display: "swap",
    fallback: ["Times New Roman", "serif"],
});

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = (await params) as { locale: "en" | "fa" };
    const isFa = locale === "fa";

    return {
        title: isFa
            ? "استودیو طراحی جواهرات اورل | طراحی و ساخت جواهر"
            : "Aurel Jewelry Design Studio | Custom Jewelry Design & Manufacturing",
        description: isFa
            ? "استودیو اورل ارائه‌دهنده خدمات طراحی سه‌بعدی جواهرات، مدل‌سازی تخصصی، پرینت سه‌بعدی و ریخته‌گری حرفه‌ای در ایران"
            : "Aurel is a professional jewelry design studio offering CAD design, 3D modeling, resin printing and casting services for jewelry brands and workshops worldwide",
        keywords: isFa
            ? ["طراحی جواهر", "طراحی سه بعدی جواهرات", "مدلسازی جواهر", "ساخت جواهر", "استودیو جواهرسازی", "طلا و جواهر"]
            : ["jewelry design", "custom jewelry", "CAD jewelry design", "3D jewelry modeling", "jewelry studio", "gold jewelry design"],
        alternates: {
            canonical: isFa ? "https://aureldesign.ir/fa" : "https://aureldesign.ir/en",
            languages: {
                fa: "https://aureldesign.ir/fa",
                en: "https://aureldesign.ir/en",
            },
        },
        openGraph: {
            title: isFa ? "استودیو طراحی جواهرات اورل" : "Aurel Jewelry Design Studio",
            description: isFa
                ? "خدمات طراحی سه‌بعدی جواهرات، مدل‌سازی تخصصی و تولید حرفه‌ای"
                : "Professional jewelry CAD design, 3D modeling and manufacturing services",
            url: isFa ? "https://aureldesign.ir/fa" : "https://aureldesign.ir/en",
            siteName: "Aurel Design",
            locale: isFa ? "fa_IR" : "en_US",
            type: "website",
        },
    };
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = (await params) as { locale: "en" | "fa" };
    const dict = await getDictionary(locale);

    return (
        <html lang={locale} dir={locale === "fa" ? "rtl" : "ltr"}>
            <body
                className={`
                    ${vazir.variable}
                    ${cormorant.variable}
                    bg-[#070707]
                    text-white
                    antialiased
                    overflow-x-hidden
                    relative
                    min-h-screen
                `}
            >
                {/* لایه پس‌زمینه که همراه اسکرول حرکت می‌کند */}
                <div className="absolute inset-0 z-0 h-full w-full pointer-events-none select-none">
                    {/* گرید */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_3px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_3px,transparent_1px)] bg-[size:10rem_10rem]"></div>

                    {/* نورهای محیطی */}
                    <AmbientLights />


                </div>

                {/* کانتینر اصلی محتوا */}
                <div className="relative z-10">
                    <SmoothScrollProvider>
                        <SiteHeader dict={dict} />
                        <main>{children}</main>
                        <SiteFooter locale={locale} />
                    </SmoothScrollProvider>
                </div>
            </body>
        </html>
    );
}