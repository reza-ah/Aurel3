import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import HomepageSectionRenderer from "@/components/homepage-section-renderer";
import PageBase from "@/components/page-base";
import { getHomepageSections, getProducts, getAssetUrl } from "@/lib/sanity";
import { getDictionary } from "@/lib/utils/get-dictionary";

// ✅ Default imports
import PortfolioSection from "@/features/portfolio/components/portfolio-section";
import PricingSection from "@/features/pricing/components/pricing-section";
import { ContactForm } from "@/features/contact/components/contact-form";

// ✅ Dynamic import برای کامپوننت‌های سنگین در صورت نیاز
// (اگر کامپوننت‌های سنگین دیگری داری که در initial render لازم نیستند)

export default async function HomePage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = (await params) as { locale: "en" | "fa" };
    const isFa = locale === "fa";

    const dict = await getDictionary(locale);
    const sections = await getHomepageSections(locale);

    const productsEnabled = process.env.NEXT_PUBLIC_ENABLE_PRODUCTS === "true";
    const products = productsEnabled ? await getProducts() : [];

    return (
        // @ts-expect-error PageBase accepts showGrid at runtime
        <PageBase showGrid={true}>
            {/* Dynamic Homepage Sections */}
            {sections.map((section: any) => (
                <HomepageSectionRenderer
                    key={section._id || section.id}
                    section={section}
                    locale={locale}
                    dict={dict}
                />
            ))}

            {/* Portfolio Section */}
            <PortfolioSection locale={locale} />

            {/* Pricing Section */}
            <PricingSection locale={locale} />

            {/* Contact Form */}
            <ContactForm locale={locale} />

            {/* Products Section */}
            {productsEnabled && products.length > 0 && (
                <section className="px-6 py-24">
                    <div className="container-lux">
                        <div className="mb-16 text-center">
                            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-white/60">
                                {isFa ? "محصولات" : "Products"}
                            </p>
                            <h2 className="text-4xl font-light md:text-5xl text-[#F5F1E8]">
                                {isFa ? "کالکشن جواهرات" : "Jewelry Collection"}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            {products.map((product: any, index: number) => {
                                // ✅ استفاده از getOptimizedImage
                                const imageUrl = getAssetUrl(product.image);

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
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
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
        </PageBase>
    );
}