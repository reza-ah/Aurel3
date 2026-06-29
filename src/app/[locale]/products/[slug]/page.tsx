import { getProductBySlug } from "@/lib/directus/client";
import SiteHeader from "@/components/site-header";
import { getDictionary } from "@/lib/utils/get-dictionary";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function ProductPage({
    params,
}: {
    params: { locale: "en" | "fa"; slug: string };
}) {
    const { locale, slug } = await params;

    const dict = await getDictionary(locale);
    const product = await getProductBySlug(slug);

    if (!product) return notFound();

    // Safe title
    const title =
        locale === "fa"
            ? product.title_fa || "محصول"
            : product.title_en || "Product";

    // Safe description
    const description =
        locale === "fa"
            ? product.description_fa || "توضیحاتی ثبت نشده است"
            : product.description_en || "No description available";

    // Safe price
    const formattedPrice =
        locale === "fa"
            ? `${Number(product.price || 0).toLocaleString("fa-IR")} تومان`
            : `$${product.price || 0}`;

    // Safe image handling
    let imageId: string | null = null;

    if (product.image) {
        if (typeof product.image === "string") {
            imageId = product.image;
        } else if (product.image.id) {
            imageId = product.image.id;
        }
    }

    return (
        <main className="min-h-screen bg-black text-white">


            <section className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16">
                {/* Image */}
                <div className="relative w-full h-[500px] overflow-hidden rounded-2xl bg-zinc-900">
                    {imageId ? (
                        <Image
                            src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${imageId}`}
                            alt={title || "Product Image"}
                            width={800}
                            height={800}
                            className="w-full h-full object-cover"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                            No Image
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex flex-col justify-center">
                    <h1 className="text-4xl md:text-5xl font-light mb-6">
                        {title}
                    </h1>

                    <p className="text-zinc-400 mb-10 leading-relaxed">
                        {description}
                    </p>

                    <div className="text-3xl font-bold text-yellow-500 mb-10">
                        {formattedPrice}
                    </div>

                    <button className="w-fit px-8 py-3 border border-white rounded-full hover:bg-white hover:text-black transition duration-300">
                        {locale === "fa"
                            ? "افزودن به سبد خرید"
                            : "Add to Cart"}
                    </button>
                </div>
            </section>
        </main>
    );
}
