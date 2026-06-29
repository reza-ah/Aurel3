"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

type PortfolioItem = {
    id: number;
    slug: string;
    title_fa: string;
    title_en: string;
    cover_image?: {
        id: string;
    };
};

type Props = {
    items: PortfolioItem[];
};

export default function PortfolioSectionClient({ items }: Props) {
    return (
        // افزودن padding برای فاصله استاندارد و استفاده از bg-transparent
        <section className="relative px-6 py-24 bg-transparent">
            <div className="mx-auto max-w-7xl">

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center"
                >
                    <h2 className="mb-4 text-4xl font-extralight tracking-[0.2em] text-[#D4AF37] md:text-5xl">
                        PORTFOLIO
                    </h2>

                    <p className="text-gray-400">
                        Timeless luxury crafted with precision.
                    </p>
                </motion.div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {items.map((item, index) => {

                        const imageUrl = item.cover_image?.id
                            ? `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${item.cover_image.id}`
                            : "/placeholder.jpg";

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 60 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.8,
                                    delay: index * 0.2,
                                }}
                                viewport={{ once: true }}
                            >
                                <Link
                                    href={`/en/portfolio?project=${item.slug}`}
                                    className="
                                        group
                                        relative
                                        block
                                        aspect-[4/5]
                                        overflow-hidden
                                        rounded-[32px]
                                        border
                                        border-white/10
                                        bg-white/[0.03]
                                        backdrop-blur-sm
                                        transition-all
                                        duration-500
                                        hover:border-amber-300/40
                                    "
                                >
                                    <Image
                                        src={imageUrl}
                                        alt={item.title_en}
                                        fill
                                        unoptimized
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                                    <div className="absolute bottom-0 left-0 z-10 w-full p-8">
                                        <h3 className="mb-2 text-3xl font-light tracking-[0.15em] text-white">
                                            {item.title_en}
                                        </h3>
                                        <p className="text-sm uppercase tracking-[0.2em] text-white/70">
                                            Luxury Collection
                                        </p>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

