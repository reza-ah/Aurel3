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

// ✅ اضافه شد: generateMetadata برای SEO بهتر
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
            title: "طراحی جواهرات | سفارش طراحی طلا با ماتریکس | استودیو اورل",
            description: "استودیو طراحی جواهرات اورل - ارائه خدمات طراحی طلا، مدل‌سازی سه‌بعدی با ماتریکس، پرینت سه‌بعدی و ریخته‌گری. سفارش طراحی جواهر با ۱۵ سال تجربه حرفه‌ای در تهران.",
            keywords: [
                "طراحی جواهرات",
                "طراحی طلا",
                "سفارش طراحی طلا",
                "طراحی جواهر با ماتریکس",
                "مدل‌سازی سه‌بعدی جواهرات",
                "پرینت سه‌بعدی طلا",
                "ریخته‌گری جواهرات",
                "استودیو طراحی جواهرات تهران",
                "طراحی جواهرات حرفه‌ای",
                "CAD جواهرات",
                "طراحی جواهرات با MatrixGold",
                "سفارش طراحی جواهرات",
                "طراحی طلا با ماتریکس",
                "مدل‌سازی جواهرات",
                "پرینت سه‌بعدی جواهر",
                "ریخته‌گری طلا",
                "طراحی سه‌بعدی طلا",
                "طراحی انگشتر",
                "طراحی گردنبند",
                "طراحی دستبند",
                "طراحی آویز",
                "طراحی گوشواره",
                "طراحی جواهرات سفارشی",
                "طراحی جواهرات لوکس",
                "طراحی جواهرات طلا",
                "طراحی جواهرات نقره",
                "طراحی جواهرات الماس",
                "طراحی جواهرات نگین‌دار",
                "طراحی جواهرات سنتی",
                "طراحی جواهرات مدرن",
                "طراحی جواهرات کلاسیک",
                "طراحی جواهرات فانتزی",
                "طراحی جواهرات عروس",
                "طراحی جواهرات نامزدی",
                "طراحی جواهرات ازدواج",
                "طراحی جواهرات هدیه",
                "طراحی جواهرات شخصی",
                "طراحی جواهرات اختصاصی",
                "طراحی جواهرات برند",
                "طراحی جواهرات تجاری",
                "طراحی جواهرات صنعتی",
                "طراحی جواهرات هنری",
                "طراحی جواهرات خلاقانه",
                "طراحی جواهرات نوین",
                "طراحی جواهرات پیشرفته",
                "طراحی جواهرات تخصصی",
                "طراحی جواهرات حرفه‌ای",
                "طراحی جواهرات با کیفیت",
                "طراحی جواهرات ارزان",
                "طراحی جواهرات گران",
                "طراحی جواهرات لوکس",
                "طراحی جواهرات برند",
                "طراحی جواهرات سفارشی",
                "طراحی جواهرات اختصاصی",
                "طراحی جواهرات شخصی",
                "طراحی جواهرات هدیه",
                "طراحی جواهرات عروس",
                "طراحی جواهرات نامزدی",
                "طراحی جواهرات ازدواج",
                "طراحی جواهرات الماس",
                "طراحی جواهرات نگین‌دار",
                "طراحی جواهرات سنتی",
                "طراحی جواهرات مدرن",
                "طراحی جواهرات کلاسیک",
                "طراحی جواهرات فانتزی",
                "طراحی جواهرات طلا",
                "طراحی جواهرات نقره",
                "طراحی جواهرات لوکس",
                "طراحی جواهرات با کیفیت",
                "طراحی جواهرات ارزان",
                "طراحی جواهرات گران",
                "طراحی جواهرات برند",
                "طراحی جواهرات سفارشی",
                "طراحی جواهرات اختصاصی",
                "طراحی جواهرات شخصی",
                "طراحی جواهرات هدیه",
                "طراحی جواهرات عروس",
                "طراحی جواهرات نامزدی",
                "طراحی جواهرات ازدواج",
                "طراحی جواهرات الماس",
                "طراحی جواهرات نگین‌دار",
                "طراحی جواهرات سنتی",
                "طراحی جواهرات مدرن",
                "طراحی جواهرات کلاسیک",
                "طراحی جواهرات فانتزی",
                "طراحی جواهرات طلا",
                "طراحی جواهرات نقره",
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
                title: "طراحی جواهرات | استودیو اورل",
                description: "ارائه خدمات طراحی طلا، مدل‌سازی سه‌بعدی با ماتریکس و ریخته‌گری حرفه‌ای",
                url: currentUrl,
                siteName: "استودیو طراحی جواهرات اورل",
                locale: "fa_IR",
                type: "website",
                images: [
                    {
                        url: `${BASE_URL}/og-image.jpg`,
                        width: 1200,
                        height: 630,
                        alt: "استودیو طراحی جواهرات اورل",
                    },
                ],
            },
            twitter: {
                card: "summary_large_image",
                title: "طراحی جواهرات | استودیو اورل",
                description: "ارائه خدمات طراحی طلا، مدل‌سازی سه‌بعدی با ماتریکس و ریخته‌گری حرفه‌ای",
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
        title: "Jewelry Design Studio | Custom Gold Design with MatrixGold | Aurel",
        description: "Aurel Jewelry Design Studio - Professional jewelry CAD design, 3D modeling with MatrixGold, 3D printing, and casting services. 15+ years of expertise.",
        keywords: [
            "jewelry design",
            "gold design",
            "custom jewelry design",
            "jewelry CAD design",
            "MatrixGold jewelry",
            "3D jewelry modeling",
            "jewelry 3D printing",
            "jewelry casting",
            "jewelry design studio",
            "professional jewelry design",
            "luxury jewelry design",
            "custom gold jewelry",
            "jewelry manufacturing",
            "jewelry prototyping",
            "jewelry rendering",
            "jewelry visualization",
            "jewelry production",
            "jewelry workshop",
            "jewelry atelier",
            "bespoke jewelry",
            "handcrafted jewelry",
            "artisan jewelry",
            "fine jewelry design",
            "high-end jewelry",
            "premium jewelry",
            "exclusive jewelry",
            "unique jewelry",
            "one-of-a-kind jewelry",
            "custom engagement rings",
            "custom wedding bands",
            "custom necklaces",
            "custom bracelets",
            "custom earrings",
            "custom pendants",
            "custom brooches",
            "custom anklets",
            "custom cufflinks",
            "custom tie clips",
            "custom money clips",
            "custom keychains",
            "custom charms",
            "custom lockets",
            "custom medallions",
            "custom coins",
            "custom tokens",
            "custom badges",
            "custom pins",
            "custom buttons",
            "custom clasps",
            "custom findings",
            "custom components",
            "custom parts",
            "custom accessories",
            "custom ornaments",
            "custom decorations",
            "custom embellishments",
            "custom adornments",
            "custom trinkets",
            "custom novelties",
            "custom souvenirs",
            "custom gifts",
            "custom presents",
            "custom keepsakes",
            "custom mementos",
            "custom heirlooms",
            "custom treasures",
            "custom valuables",
            "custom collectibles",
            "custom artifacts",
            "custom relics",
            "custom antiquities",
            "custom curiosities",
            "custom oddities",
            "custom rarities",
            "custom exclusives",
            "custom luxuries",
            "custom premiums",
            "custom elites",
            "custom VIPs",
            "custom VIP",
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
            title: "Jewelry Design Studio | Aurel",
            description: "Professional jewelry CAD design, 3D modeling with MatrixGold, and casting services",
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
            title: "Jewelry Design Studio | Aurel",
            description: "Professional jewelry CAD design, 3D modeling with MatrixGold, and casting services",
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
                        {/* Products Section - h2 با disableAnimation */}
                        <div className="mb-16 text-center">
                            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-white/60">
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
                                            <p className="mb-5 line-clamp-3 text-white/60">
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

            {/* ✅ Organization Schema - فقط در صفحه اصلی */}
            <OrganizationSchema />
        </PageBase>
    );
}