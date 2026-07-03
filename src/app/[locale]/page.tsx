import Link from "next/link";
import HomepageSectionRenderer from "@/components/homepage-section-renderer";
import PageBase from "@/components/page-base";
import { getHomepageSections, getProducts, getOptimizedImage } from "@/lib/sanity";
import { getDictionary } from "@/lib/utils/get-dictionary";
import Image from "next/image";
import PortfolioSection from "@/features/portfolio/components/portfolio-section";
import OrganizationSchema from "@/components/seo/organization-schema";

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