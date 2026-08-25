import type { Metadata, Viewport } from "next";
import { Montserrat, Vazirmatn } from "next/font/google";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import AmbientLights from "@/components/ambient-lights";
import { getDictionary } from "@/lib/utils/get-dictionary";
import "../globals.css";

const montserrat = Montserrat({
    subsets: ['latin'],
    variable: "--font-montserrat",
    display: "swap",
    weight: ["300", "400", "500", "600", "700"],
    preload: true,
    fallback: ["system-ui", "sans-serif"],
});

const vazirmatn = Vazirmatn({
    subsets: ['arabic', 'latin'],
    variable: "--font-vazir",
    display: "swap",
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    preload: true,
    fallback: ["system-ui", "sans-serif"],
});

export const viewport: Viewport = {
    themeColor: "#070707",
    width: "device-width",
    initialScale: 1,
};

// ✅ فقط متادیتای پایه — بدون canonical (تا صفحات خودشان تعریف کنند)
export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = (await params) as { locale: "en" | "fa" };
    const isFa = locale === "fa";
    const baseUrl = "https://www.aureldesign.ir";
    const defaultOgImage = `${baseUrl}/og-image.jpg`;

    return {
        metadataBase: new URL(baseUrl),

        title: {
            default: isFa
                ? "استودیو طراحی جواهرات آرل | طراحی و ساخت جواهر"
                : "Aurel Jewelry Design Studio | Custom Jewelry Design & Manufacturing",
            template: isFa ? "%s | استودیو آرل" : "%s | Aurel Studio",
        },

        description: isFa
            ? "استودیو آرل ارائه‌دهنده خدمات طراحی سه‌بعدی جواهرات، مدل‌سازی تخصصی، پرینت سه‌بعدی و ریخته‌گری حرفه‌ای در ایران"
            : "Aurel is a professional jewelry design studio offering CAD design, 3D modeling, resin printing and casting services for jewelry brands and workshops worldwide",

        keywords: isFa
            ? ["طراحی جواهر", "طراحی سه بعدی جواهرات", "مدل سازی جواهر", "ساخت جواهر", "استودیو جواهرسازی", "طلا و جواهر", "CAD جواهر", "پرینت سه بعدی"]
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

        manifest: "/manifest.json",
        icons: {
            icon: [
                { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
                { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
                { url: "/icon.svg", type: "image/svg+xml" },
            ],
            shortcut: "/favicon.ico",
            apple: "/icon.ico",
        },

        // ✅ فقط hreflang — بدون canonical (مهم‌ترین تغییر!)
        alternates: {
            languages: {
                fa: `${baseUrl}/fa`,
                en: `${baseUrl}/en`,
                "x-default": `${baseUrl}/en`,
            },
        },

        openGraph: {
            siteName: isFa ? "استودیو طراحی جواهرات آرل" : "Aurel Jewelry Design Studio",
            locale: isFa ? "fa_IR" : "en_US",
            alternateLocale: isFa ? "en_US" : "fa_IR",
            type: "website",
            images: [
                {
                    url: defaultOgImage,
                    width: 1200,
                    height: 630,
                    alt: isFa ? "استودیو طراحی جواهرات آرل" : "Aurel Jewelry Design Studio",
                    type: "image/jpeg",
                },
            ],
        },

        twitter: {
            card: "summary_large_image",
            creator: "@AurelDesign",
            images: [defaultOgImage],
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
            className={`${montserrat.variable} ${vazirmatn.variable}`}
            suppressHydrationWarning
        >
            <head>
                <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
                <link rel="dns-prefetch" href="https://cdn.sanity.io" />
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="icon" href="/icon.svg" type="image/svg+xml" />
                <link rel="apple-touch-icon" href="/icon.ico" />
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
                    ${isFa ? "font-vazir" : "font-montserrat"}
                `}
                suppressHydrationWarning
            >
                <a
                    href="#main-content"
                    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-[#d4af37] focus:text-black focus:px-4 focus:py-2 focus:rounded"
                >
                    {isFa ? "رفت به محتوای اصلی" : "Skip to main content"}
                </a>

                <div
                    className="absolute inset-0 z-0 h-full w-full pointer-events-none select-none"
                    aria-hidden="true"
                >
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_3px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_3px,transparent_1px)] bg-[size:10rem_10rem]" />
                    <AmbientLights />
                </div>

                <div className="relative z-10">
                    <SmoothScrollProvider>
                        <SiteHeader dict={dict} />
                        <main id="main-content" tabIndex={-1}>
                            {children}
                        </main>
                        <SiteFooter locale={locale} />
                    </SmoothScrollProvider>
                </div>
            </body>
        </html>
    );
}