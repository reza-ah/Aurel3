import { getProductBySlug, getOptimizedImage } from "@/lib/sanity";
import SiteHeader from "@/components/site-header";
import { getDictionary } from "@/lib/utils/get-dictionary";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function ProductPage({
    params,
}: {
    params: Promise<{ locale: "en" | "fa"; slug: string }>;
}) {
    const { locale, slug } = await params;

    const dict = await getDictionary(locale);
    const product = await getProductBySlug(slug);

    if (!product) return notFound();

    const title =
        locale === "fa"
            ? product.title_fa || "محصول"
            : product.title_en || "Product";

    const description =
        locale === "fa"
            ? product.description_fa || "توضیحاتی ثبت نشده است"
            : product.description_en || "No description available";

    const formattedPrice =
        locale === "fa"
            ? `${Number(product.price || 0).toLocaleString("fa-IR")} تومان`
            : `$${product.price || 0}`;

    const imageUrl = getOptimizedImage(product.image, {
        width: 800,
        quality: 80,
        format: "webp"
    });

    return (
        <>
            <SiteHeader dict={dict} />

            <main className="min-h-screen bg-black pt-32 pb-20">
                <div className="mx-auto max-w-7xl px-6 lg:px-10">
                    <div className="grid gap-12 md:grid-cols-2">
                        {/* Image */}
                        <div className="relative aspect-square overflow-hidden rounded-3xl bg-zinc-900/30 border border-white/5">
                            {imageUrl ? (
                                <Image
                                    src={imageUrl}
                                    alt={title}
                                    fill
                                    priority
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-zinc-500">
                                    No Image
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex flex-col justify-center">
                            <h1 className="mb-6 text-4xl font-light text-white md:text-5xl">
                                {title}
                            </h1>

                            <p className="mb-8 text-lg leading-8 text-white/80">
                                {description}
                            </p>

                            <p className="mb-8 text-3xl font-light text-[#d4af37]">
                                {formattedPrice}
                            </p>

                            <button className="inline-flex w-full items-center justify-center rounded-full border border-[#d4af37]/40 px-8 py-4 text-sm uppercase tracking-[0.2em] text-[#d4af37] transition-all duration-300 hover:bg-[#d4af37] hover:text-black hover:shadow-[0_0_30px_rgba(212,175,55,0.35)] md:w-auto">
                                {locale === "fa"
                                    ? "افزودن به سبد خرید"
                                    : "Add to Cart"}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}