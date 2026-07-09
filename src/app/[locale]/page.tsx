import Link from "next/link";
import HomepageSectionRenderer from "@/components/homepage-section-renderer";
import PageBase from "@/components/page-base";
import { getHomepageSections, getProducts, getOptimizedImage } from "@/lib/sanity";
import { getDictionary } from "@/lib/utils/get-dictionary";
import Image from "next/image";
import PortfolioSection from "@/features/portfolio/components/portfolio-section";
import OrganizationSchema from "@/components/seo/organization-schema";
import type { Metadata } from "next";

const BASE_URL = "https://www.aureldesign.ir";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const isFa = locale === "fa";
    const currentUrl = `${BASE_URL}/${locale}`;

    if (isFa) {
        return {
            title: "طراحی جواهرات | سفارش طراحی طلا با ماتریکس | استودیو آرل",
            description: "استودیو طراحی جواهرات آرل - ارائه خدمات طراحی ، مدل‌سازی سه‌بعدی، پرینت سه‌بعدی و ریخته‌گری طلا و جواهرات. ",
            keywords: [
                "طراحی جواهرات ",
                "طراحی طلا",
                "طراحی جواهرات با ماتریکس",
                "طراحی طلا با ماتریکس",
                "مدل سازی جواهرات با ماتریکس",
                "سفارش طراحی جواهر",
                "سفارش طراحی طلا",
                "طراحی سه بعدی جواهرات",
                "مدل سازی سه بعدی جواهر",
                "پرینت سه بعدی جواهر",
                "پرینت مومی جواهر",
                "پرینت رزینی جواهر",
                "ریخته گری طلا",
                "ریخته گری جواهر",
                "طراحی جواهر با راینو",
                "سفارش مدل سازی جواهر",
                "طراح جواهرات حرفه ای تهران",
                "استودیو طراحی جواهرات تهران",
                " طراحی جواهرات تهران",
                "طراحی جواهر اختصاصی",
                "ساخت مدل طلا",
                "فایل آماده ریخته گری جواهر",
                "طراحی انگشتر با ماتریکس",
                "طراحی گردنبند سه بعدی",
                "طراحی آویز جواهر",
                "طراحی سرویس جواهر",
                "مخراج کاری سه بعدی",
                "ZBrush جواهر",
                " طراحی Zbrush",
            ],
            authors: [{ name: "Aurel Design Studio", url: BASE_URL }],
            creator: "Aurel Design Studio",
            publisher: "Aurel Design Studio",
            formatDetection: {
                email: false,
                address: false,
                telephone: false,
            },
            metadataBase: new URL(BASE_URL),
            alternates: {
                canonical: currentUrl,
                languages: {
                    fa: `${BASE_URL}/fa`,
                    en: `${BASE_URL}/en`,
                    "x-default": `${BASE_URL}/en`,
                },
            },
            openGraph: {
                title: "طراحی جواهرات | استودیو طراحی آرل",
                description: "ارائه خدمات طراحی طلا، طراحی ,مدلسازی و ساخت جواهرات",
                url: currentUrl,
                siteName: "استودیو طراحی جواهرات آرل",
                locale: "fa_IR",
                type: "website",
                images: [
                    {
                        url: `${BASE_URL}/og-image.jpg`,
                        width: 1200,
                        height: 630,
                        alt: "استودیو طراحی جواهرات آرل",
                    },
                ],
            },
            twitter: {
                card: "summary_large_image",
                title: "طراحی جواهرات | استودیو آرل",
                description: "ارائه خدمات طراحی طلا، مدل‌سازی سه‌بعدی و ریخته‌گری حرفه‌ای",
                images: [`${BASE_URL}/og-image.jpg`],
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
    }

    return {
        title: "Jewelry Design | Custom Gold Design with MatrixGold | Aurel Studio",
        description: "Aurel Jewelry Design Studio - Professional jewelry design, 3D modeling, 3D printing, and gold & jewelry casting services.",
        keywords: [
            "jewelry design",
            "gold design",
            "jewelry design with MatrixGold",
            "gold design with MatrixGold",
            "jewelry modeling with MatrixGold",
            "custom jewelry design order",
            "custom gold design order",
            "3D jewelry design",
            "3D jewelry modeling",
            "jewelry 3D printing",
            "wax printing jewelry",
            "resin printing jewelry",
            "gold casting",
            "jewelry casting",
            "jewelry design with Rhino",
            "custom jewelry modeling order",
            "professional jewelry designer Tehran",
            "jewelry design studio Tehran",
            "jewelry design Tehran",
            "custom jewelry design",
            "gold model making",
            "casting-ready jewelry file",
            "ring design with MatrixGold",
            "3D necklace design",
            "jewelry pendant design",
            "jewelry set design",
            "3D stone setting",
            "ZBrush jewelry",
            "ZBrush design",
        ],
        authors: [{ name: "Aurel Design Studio", url: BASE_URL }],
        creator: "Aurel Design Studio",
        publisher: "Aurel Design Studio",
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },
        metadataBase: new URL(BASE_URL),
        alternates: {
            canonical: currentUrl,
            languages: {
                fa: `${BASE_URL}/fa`,
                en: `${BASE_URL}/en`,
                "x-default": `${BASE_URL}/en`,
            },
        },
        openGraph: {
            title: "Jewelry Design | Aurel Design Studio",
            description: "Professional jewelry design, modeling, and manufacturing services",
            url: currentUrl,
            siteName: "Aurel Jewelry Design Studio",
            locale: "en_US",
            type: "website",
            images: [
                {
                    url: `${BASE_URL}/og-image.jpg`,
                    width: 1200,
                    height: 630,
                    alt: "Aurel Jewelry Design Studio",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: "Jewelry Design | Aurel Studio",
            description: "Professional jewelry design, 3D modeling, and casting services",
            images: [`${BASE_URL}/og-image.jpg`],
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
}

export default async function HomePage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = (await params) as { locale: "en" | "fa" };
    const isFa = locale === "fa";

    const dict = await getDictionary(locale);
    const sections = await getHomepageSections(locale);

    const uniqueSections = sections.reduce((acc: any[], section: any) => {
        if (section.type === "hero") {
            if (!acc.some(s => s.type === "hero")) {
                acc.push(section);
            }
        } else {
            acc.push(section);
        }
        return acc;
    }, []);

    const productsEnabled = process.env.NEXT_PUBLIC_ENABLE_PRODUCTS === "true";
    const products = productsEnabled ? await getProducts() : [];

    return (
        // @ts-expect-error PageBase accepts showGrid at runtime
        <PageBase showGrid={true}>
            {/* ✅ اضافه شد: H1 مخفی برای SEO و Accessibility */}
            <h1 className="sr-only">
                {isFa
                    ? "استودیو طراحی جواهرات آرل - طراحی، مدل‌سازی و تولید حرفه‌ای جواهرات"
                    : "Aurel Jewelry Design Studio - Professional Jewelry Design, 3D Modeling & Production"}
            </h1>

            {uniqueSections.map((section: any) => (
                <HomepageSectionRenderer
                    key={section._id || section.id}
                    section={section}
                    locale={locale}
                    dict={dict}
                />
            ))}

            <PortfolioSection locale={locale} />

            {productsEnabled && products.length > 0 && (
                <section className="px-6 py-24">
                    <div className="container-lux">
                        <div className="mb-16 text-center">
                            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#e5e5e5]">
                                {isFa ? "محصولات" : "Products"}
                            </p>

                            <h2 className="text-4xl font-light md:text-5xl text-[#F5F1E8]">
                                {isFa ? "کالکشن جواهرات" : "Jewelry Collection"}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            {products.map((product: any) => {
                                const imageUrl = getOptimizedImage(product.image, {
                                    width: 800,
                                    quality: 75,
                                    format: "webp"
                                });

                                const title = isFa ? product.title_fa : product.title_en;
                                const description = isFa ? product.description_fa : product.description_en;

                                const price = isFa
                                    ? `${Number(product.price || 0).toLocaleString("fa-IR")} تومان`
                                    : `$${product.price || 0}`;

                                const slug = typeof product.slug === "string"
                                    ? product.slug
                                    : product.slug?.current || product._id;

                                return (
                                    <div
                                        key={product._id}
                                        className="group flex flex-col bg-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-3xl overflow-hidden transition-all hover:bg-zinc-900/40"
                                    >
                                        {imageUrl ? (
                                            <div className="relative h-80 w-full overflow-hidden">
                                                <Image
                                                    src={imageUrl}
                                                    alt={title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex h-80 w-full items-center justify-center bg-white/5 text-white/20">
                                                No Image
                                            </div>
                                        )}

                                        <div className="p-6 flex flex-col flex-grow">
                                            <h3 className="mb-3 text-2xl font-light text-white">
                                                {title}
                                            </h3>
                                            <p className="mb-5 line-clamp-3 text-[#e5e5e5]">
                                                {description}
                                            </p>
                                            <div className="mt-auto flex items-center justify-between">
                                                <span className="text-xl font-medium text-[#C6A86A]">
                                                    {price}
                                                </span>
                                                <Link
                                                    href={`/${locale}/products/${slug}`}
                                                    className="px-6 py-2 border border-[#C6A86A] text-[#C6A86A] hover:bg-[#C6A86A] hover:text-black transition-colors rounded-full text-sm uppercase tracking-widest"
                                                >
                                                    {isFa ? "مشاهده" : "View"}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            <OrganizationSchema />
        </PageBase>
    );
}