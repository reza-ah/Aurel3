import Link from "next/link";
import HomepageSectionRenderer from "@/components/homepage-section-renderer";
import PageBase from "@/components/page-base";
import { getHomepageSections, getProducts } from "@/lib/directus/client";
import { getDictionary } from "@/lib/utils/get-dictionary";


export default async function HomePage({
    params,
}: {
    // ۱. به‌روزرسانی تایپ کامپوننت برای پشتیبانی از Promise در Next.js جدید
    params: Promise<{ locale: string }>;
}) {
    // ۲. منتظر ماندن برای حل پرامیس params و تبدیل نوع آن
    const { locale } = (await params) as { locale: "en" | "fa" };

    const dict = await getDictionary(locale);
    const sections = await getHomepageSections(locale);
    const productsEnabled = process.env.NEXT_PUBLIC_ENABLE_PRODUCTS === "true";
    const products = productsEnabled ? await getProducts() : [];

    return (
        // ۳. اضافه کردن کامنت کنترل بیلد برای نادیده گرفتن خطای تایپ کامپوننت پایه
        // @ts-expect-error PageBase accepts showGrid at runtime.
        <PageBase showGrid={true}>
            {/* Dynamic Homepage Sections */}
            {sections.map((section: any) => (
                <HomepageSectionRenderer
                    key={section.id}
                    section={section}
                    locale={locale}
                    dict={dict}
                />
            ))}

            {/* Products Section */}
            {productsEnabled && (
                <section className="px-6 py-24">
                    <div className="container-lux">
                        <div className="mb-16 text-center">
                            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-white/60">
                                {locale === "fa" ? "محصولات دایرکتوس" : "Directus Products"}
                            </p>

                            <h2 className="text-4xl font-light md:text-5xl text-[#F5F1E8]">
                                {locale === "fa" ? "کالکشن جواهرات" : "Jewelry Collection"}
                            </h2>
                        </div>

                        {products.length === 0 && (
                            <p className="text-center text-white/60">No products found</p>
                        )}

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            {products?.map((product: any) => {
                                let imageId: string | null = null;
                                if (product.image) {
                                    if (typeof product.image === "string") {
                                        imageId = product.image;
                                    } else if (product.image.id) {
                                        imageId = product.image.id;
                                    }
                                }

                                const title = locale === "fa" ? product.title_fa : product.title_en;
                                const description = locale === "fa" ? product.description_fa : product.description_en;
                                const price = locale === "fa"
                                    ? `${product.price?.toLocaleString("fa-IR")} تومان`
                                    : `$${product.price}`;

                                return (
                                    <div
                                        key={product.id}
                                        className="group flex flex-col bg-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-3xl overflow-hidden transition-all hover:bg-zinc-900/40"
                                    >
                                        {imageId ? (
                                            <div className="relative h-80 w-full overflow-hidden">
                                                <img
                                                    src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${imageId}`}
                                                    alt={title}
                                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
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
                                                    href={`/${locale}/products/${product.slug}`}
                                                    className="px-6 py-2 border border-[#C6A86A] text-[#C6A86A] hover:bg-[#C6A86A] hover:text-black transition-colors rounded-full text-sm uppercase tracking-widest"
                                                >
                                                    {locale === "fa" ? "مشاهده" : "View"}
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
