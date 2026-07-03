import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import AmbientLights from "@/components/ambient-lights";
import { getDictionary } from "@/lib/utils/get-dictionary";
import OrganizationSchema from "@/components/seo/organization-schema";
import "../globals.css";

// ✅ فونت اصلی با preload
const vazir = localFont({
    src: "../../fonts/Vazirmatn[wght].woff2",
    variable: "--font-vazir",
    display: "swap",
    preload: true,
    fallback: ["system-ui", "sans-serif"],
    weight: "100 900",
});

// ✅ فونت دوم بدون preload
const cormorant = localFont({
    src: "../../fonts/CormorantGaramond[wght].woff2",
    variable: "--font-cormorant",
    display: "swap",
    preload: false,
    fallback: ["Georgia", "serif"],
    weight: "300 700",
});

// ✅ Viewport metadata
export const viewport: Viewport = {
    themeColor: "#070707",
    width: "device-width",
    initialScale: 1,
};

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = (await params) as { locale: "en" | "fa" };
    const isFa = locale === "fa";

    const baseUrl = "https://www.aureldesign.ir";
    const currentUrl = `${baseUrl}/${locale}`;

    return {
        metadataBase: new URL(baseUrl),

        title: {
            default: isFa
                ? "استودیو طراحی جواهرات اورل | طراحی و ساخت جواهر"
                : "Aurel Jewelry Design Studio | Custom Jewelry Design & Manufacturing",
            template: isFa ? "%s | استودیو اورل" : "%s | Aurel Studio",
        },

        description: isFa
            ? "استودیو اورل ارائه‌دهنده خدمات طراحی سه‌بعدی جواهرات، مدل‌سازی تخصصی، پرینت سه‌بعدی و ریخته‌گری حرفه‌ای در ایران"
            : "Aurel is a professional jewelry design studio offering CAD design, 3D modeling, resin printing and casting services for jewelry brands and workshops worldwide",

        keywords: isFa
            ? ["طراحی جواهر", "طراحی سه بعدی جواهرات", "مدلسازی جواهر", "ساخت جواهر", "استودیو جواهرسازی", "طلا و جواهر", "CAD جواهر", "پرینت سه بعدی"]
            : ["jewelry design", "custom jewelry", "CAD jewelry design", "3D jewelry modeling", "jewelry studio", "gold jewelry design", "jewelry CAD", "3D printing jewelry"],

        authors: [{ name: "Aurel Design Studio" }],
        creator: "Aurel Design Studio",
        publisher: "Aurel Design Studio",

        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },

        alternates: {
            canonical: currentUrl,
            languages: {
                fa: `${baseUrl}/fa`,
                en: `${baseUrl}/en`,
                "x-default": `${baseUrl}/en`,
            },
        },

        openGraph: {
            title: isFa ? "استودیو طراحی جواهرات اورل" : "Aurel Jewelry Design Studio",
            description: isFa
                ? "خدمات طراحی سه‌بعدی جواهرات، مدل‌سازی تخصصی و تولید حرفه‌ای"
                : "Professional jewelry CAD design, 3D modeling and manufacturing services",
            url: currentUrl,
            siteName: "Aurel Design",
            locale: isFa ? "fa_IR" : "en_US",
            type: "website",
            images: [
                {
                    url: `${baseUrl}/og-image.jpg`,
                    width: 1200,
                    height: 630,
                    alt: isFa ? "استودیو طراحی جواهرات اورل" : "Aurel Jewelry Design Studio",
                },
            ],
        },

        twitter: {
            card: "summary_large_image",
            title: isFa ? "استودیو طراحی جواهرات اورل" : "Aurel Jewelry Design Studio",
            description: isFa
                ? "خدمات طراحی سه‌بعدی جواهرات، مدل‌سازی تخصصی و تولید حرفه‌ای"
                : "Professional jewelry CAD design, 3D modeling and manufacturing services",
            images: [`${baseUrl}/og-image.jpg`],
            creator: "@AurelDesign",
        },

        category: "Jewelry Design",
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
    const isFa = locale === "fa";

    return (
        <html
            lang={locale}
            dir={isFa ? "rtl" : "ltr"}
            className={`${vazir.variable} ${cormorant.variable}`}
            suppressHydrationWarning
        >
            <head>
                {/* ✅ Preconnect برای منابع خارجی */}
                <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
                <link rel="dns-prefetch" href="https://cdn.sanity.io" />

                {/* ✅ Favicon */}
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="icon" href="/icon.svg" type="image/svg+xml" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

                {/* ✅ Manifest */}
                <link rel="manifest" href="/manifest.json" />
            </head>
            <body
                className={`
                    bg-[#070707]
                    text-white
                    antialiased
                    overflow-x-hidden
                    relative
                    min-h-screen
                    ${isFa ? "font-vazir" : "font-cormorant"}
                `}
                suppressHydrationWarning
            >
                {/* ✅ Skip to main content (Accessibility) */}
                <a
                    href="#main-content"
                    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-[#d4af37] focus:text-black focus:px-4 focus:py-2 focus:rounded"
                >
                    {isFa ? "رفتن به محتوای اصلی" : "Skip to main content"}
                </a>

                {/* لایه پس‌زمینه */}
                <div
                    className="absolute inset-0 z-0 h-full w-full pointer-events-none select-none"
                    aria-hidden="true"
                >
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_3px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_3px,transparent_1px)] bg-[size:10rem_10rem]" />
                    <AmbientLights />
                </div>

                {/* کانتینر اصلی محتوا */}
                <div className="relative z-10">
                    <SmoothScrollProvider>
                        <SiteHeader dict={dict} />
                        <main id="main-content" tabIndex={-1}>
                            {children}
                        </main>
                        <SiteFooter locale={locale} />
                    </SmoothScrollProvider>
                </div>

                {/* ✅ اضافه شد: Organization Schema */}
                <OrganizationSchema />
            </body>
        </html>
    );
}