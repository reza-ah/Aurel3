// src/app/[locale]/portfolio/[slug]/page.tsx

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import PortfolioGallery from "@/features/portfolio/components/portfolio-gallery";
import { getPortfolioItems, getAssetUrl } from "@/lib/sanity";

type PortfolioItem = {
    id: number;
    slug: string;

    title_fa: string;
    title_en: string;

    category_fa: string;
    category_en: string;

    description_fa: string;
    description_en: string;

    featured: boolean;

    tags?: {
        portfolio_tags_id?: {
            id: number;
            slug: string;
            title?: string;
        };
    }[];

    cover_image?: {
        id: string;
    };

    gallery?: {
        directus_files_id: {
            id: string;
        };
    }[];
};

type Props = {
    params: Promise<{
        locale: string;
        slug: string;
    }>;
};

export default async function ProjectPage({
    params,
}: Props) {

    const { locale, slug } = await params;

    const isFa =
        locale === "fa";

    const portfolioItems:
        PortfolioItem[] =
        await getPortfolioItems();

    const project =
        portfolioItems.find(
            (item) =>
                item.slug === slug
        );

    if (!project) {
        notFound();
    }

    const title =
        isFa
            ? project.title_fa
            : project.title_en;

    const category =
        isFa
            ? project.category_fa
            : project.category_en;

    const description =
        isFa
            ? project.description_fa
            : project.description_en;

    const imageUrl =
        getAssetUrl(project.cover_image) ||
        "/placeholder.jpg";

    /* =========================
       GALLERY IMAGES
    ========================= */

    const galleryImages =
        (project.gallery || [])
            .map((g) => g.directus_files_id)
            .filter(Boolean)
            .map((img) =>
                getAssetUrl(img) || "/placeholder.jpg"
            );

    /* =========================
       RELATED PROJECTS
    ========================= */

    const currentTags =
        (project.tags || []).map(
            (tag) =>
                tag
                    .portfolio_tags_id
                    ?.slug
        );

    const relatedProjects =
        portfolioItems
            .filter((item) => {

                if (
                    item.slug ===
                    project.slug
                ) {
                    return false;
                }

                const itemTags =
                    (
                        item.tags || []
                    ).map(
                        (tag) =>
                            tag
                                .portfolio_tags_id
                                ?.slug
                    );

                return itemTags.some(
                    (tag) =>
                        currentTags.includes(
                            tag
                        )
                );

            })
            .slice(0, 3);

    return (

        <main className="
            min-h-screen
            bg-transparent
            text-white
        ">

            {/* HERO */}

            <section className="
                pt-32
                pb-24
            ">

                <div className="
                    max-w-7xl
                    mx-auto
                    px-6
                ">

                    <Link
                        href={`/${locale}/portfolio`}
                        className="
                            inline-flex
                            items-center
                            gap-2
                            text-sm
                            tracking-[0.2em]
                            uppercase
                            text-zinc-400
                            hover:text-white
                            transition
                            mb-12
                        "
                    >
                        ← {
                            isFa
                                ? "بازگشت"
                                : "Back"
                        }
                    </Link>

                    <div className="
                        grid
                        lg:grid-cols-2
                        gap-16
                        items-center
                    ">

                        {/* CONTENT */}

                        <div>

                            <p className="
                                text-[#d4af37]
                                uppercase
                                tracking-[0.3em]
                                text-sm
                                mb-5
                            ">
                                {category}
                            </p>

                            <h1 className="
                                text-5xl
                                md:text-6xl
                                lg:text-7xl
                                font-extralight
                                leading-tight
                                mb-8
                            ">
                                {title}
                            </h1>

                            <div className="
                                w-24
                                h-px
                                bg-[#d4af37]
                                mb-8
                            " />

                            <p className="
                                text-zinc-400
                                leading-9
                                text-lg
                                max-w-xl
                            ">
                                {description}
                            </p>

                        </div>

                        {/* IMAGE */}

                        <div className="
                            relative
                            aspect-[4/5]
                            overflow-hidden
                            rounded-[32px]
                            bg-zinc-900
                            group
                        ">

                            <Image
                                src={imageUrl}
                                alt={title}
                                fill
                                priority
                                unoptimized
                                className="
                                    object-cover
                                    transition
                                    duration-700
                                    group-hover:scale-105
                                "
                            />

                        </div>

                    </div>

                </div>

            </section>

            {/* GALLERY */}

            {galleryImages.length > 0 && (

                <section className="pb-32">

                    <div className="
                        max-w-7xl
                        mx-auto
                        px-6
                    ">

                        <PortfolioGallery
                            title={title}
                            images={galleryImages}
                        />

                    </div>

                </section>

            )}

            {/* ALL PROJECTS CTA */}

            <section className="pb-24">

                <div className="
                    max-w-7xl
                    mx-auto
                    px-6
                ">

                    <div className="
                        border
                        border-white/10
                        rounded-[32px]
                        px-8
                        py-14
                        flex
                        flex-col
                        md:flex-row
                        items-center
                        justify-between
                        gap-8
                        bg-white/[0.02]
                    ">

                        <div>

                            <p className="
                                text-[#d4af37]
                                uppercase
                                tracking-[0.3em]
                                text-xs
                                mb-4
                            ">
                                Portfolio
                            </p>

                            <h2 className="
                                text-3xl
                                md:text-4xl
                                font-extralight
                                mb-3
                            ">
                                {isFa
                                    ? "مشاهده همه پروژه‌ها"
                                    : "Explore All Projects"}
                            </h2>

                            <p className="
                                text-zinc-400
                                max-w-2xl
                                leading-8
                            ">
                                {isFa
                                    ? "مجموعه کامل پروژه‌های طراحی و اجرا شده را مشاهده کنید."
                                    : "Discover the complete collection of crafted luxury projects."}
                            </p>

                        </div>

                        <Link
                            href={`/${locale}/portfolio`}
                            className="
                                inline-flex
                                items-center
                                justify-center
                                h-14
                                px-8
                                rounded-full
                                border
                                border-[#d4af37]
                                text-[#d4af37]
                                uppercase
                                tracking-[0.2em]
                                text-sm
                                hover:bg-[#d4af37]
                                hover:text-black
                                transition-all
                                duration-300
                                shrink-0
                            "
                        >
                            {isFa
                                ? "همه پروژه‌ها"
                                : "View Portfolio"}
                        </Link>

                    </div>

                </div>

            </section>

            {/* RELATED */}

            {relatedProjects.length > 0 && (

                <section className="
                    border-t
                    border-white/10
                    pt-24
                    pb-32
                ">

                    <div className="
                        max-w-7xl
                        mx-auto
                        px-6
                    ">

                        <div className="mb-14">

                            <p className="
                                text-[#d4af37]
                                tracking-[0.3em]
                                uppercase
                                text-sm
                                mb-4
                            ">
                                Portfolio
                            </p>

                            <h2 className="
                                text-4xl
                                md:text-5xl
                                font-extralight
                            ">
                                {
                                    isFa
                                        ? "پروژه‌های مشابه"
                                        : "Related Projects"
                                }
                            </h2>

                        </div>

                        <div className="
                            grid
                            md:grid-cols-2
                            lg:grid-cols-3
                            gap-8
                        ">

                            {relatedProjects.map(
                                (item) => {

                                    const itemTitle =
                                        isFa
                                            ? item.title_fa
                                            : item.title_en;

                                    const itemCategory =
                                        isFa
                                            ? item.category_fa
                                            : item.category_en;

                                    const itemImage =
                                        getAssetUrl(item.cover_image) ||
                                        "/placeholder.jpg";

                                    return (

                                        <Link
                                            key={item._id}
                                            href={`/${locale}/portfolio/${item.slug}`}
                                            className="group"
                                        >

                                            <div className="
                                                relative
                                                aspect-[4/5]
                                                overflow-hidden
                                                rounded-[28px]
                                                bg-zinc-900
                                                mb-5
                                            ">

                                                <Image
                                                    src={itemImage}
                                                    alt={itemTitle}
                                                    fill
                                                    unoptimized
                                                    className="
                                                        object-cover
                                                        transition
                                                        duration-700
                                                        group-hover:scale-105
                                                    "
                                                />

                                            </div>

                                            <p className="
                                                text-[#d4af37]
                                                text-xs
                                                tracking-[0.25em]
                                                uppercase
                                                mb-2
                                            ">
                                                {itemCategory}
                                            </p>

                                            <h3 className="
                                                text-2xl
                                                font-light
                                                transition
                                                group-hover:text-[#d4af37]
                                            ">
                                                {itemTitle}
                                            </h3>

                                        </Link>

                                    );

                                }
                            )}

                        </div>

                    </div>

                </section>

            )}

        </main>

    );

}
