import type { Metadata } from "next";
import { Vazirmatn, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const BASE_URL = "https://www.aureldesign.ir";

// ✅ فونت فارسی - Vazirmatn
const vazirmatn = Vazirmatn({
    subsets: ["arabic", "latin"],
    variable: "--font-vazir",
    display: "swap",
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    preload: false, // ✅ جلوگیری از preload خودکار
    fallback: ["system-ui", "sans-serif"], // ✅ فونت جایگزین هنگام لود
});

// ✅ فونت انگلیسی - Cormorant Garamond
const cormorant = Cormorant_Garamond({
    subsets: ["latin"],
    variable: "--font-cormorant",
    display: "swap",
    weight: ["300", "400", "500", "600", "700"],
    preload: false, // ✅ جلوگیری از preload خودکار
    fallback: ["system-ui", "serif"], // ✅ فونت جایگزین
});

export const metadata: Metadata = {
    metadataBase: new URL(BASE_URL),
    title: {
        default: "Aurel Jewelry Design Studio | Custom Jewelry Design & Manufacturing",
        template: "%s | Aurel Design Studio",
    },
    description: "Professional jewelry CAD design, 3D modeling with MatrixGold, 3D printing, and casting services. 15+ years of expertise in luxury jewelry design.",
    keywords: [
        "jewelry design",
        "custom jewelry",
        "MatrixGold",
        "3D jewelry modeling",
        "jewelry CAD",
        "luxury jewelry",
        "طراحی جواهرات",
        "طراحی طلا",
        "ماتریکس",
    ],
    authors: [{ name: "Aurel Design Studio", url: BASE_URL }],
    creator: "Aurel Design Studio",
    publisher: "Aurel Design Studio",
    manifest: "/manifest.json",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: BASE_URL,
        siteName: "Aurel Jewelry Design Studio",
        title: "Aurel Jewelry Design Studio",
        description: "Professional jewelry CAD design, 3D modeling with MatrixGold, 3D printing, and casting services.",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Aurel Jewelry Design Studio",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Aurel Jewelry Design Studio",
        description: "Professional jewelry CAD design, 3D modeling with MatrixGold, 3D printing, and casting services.",
        images: ["/og-image.jpg"],
        creator: "@AurelDesign",
    },
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
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${vazirmatn.variable} ${cormorant.variable}`}>
            <body className={`${vazirmatn.className} ${cormorant.className}`}>
                {children}
            </body>
        </html>
    );
}