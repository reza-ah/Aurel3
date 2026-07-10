import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOptimizedImage } from "@/lib/sanity";
import PortfolioGallery from "@/features/portfolio/components/portfolio-gallery";
import { getPortfolioItems } from "@/lib/sanity";
import BreadcrumbSchema from "@/components/seo/breadcrumb-schema";

type PortfolioItem = {
    _id: string;
    slug: { current: string } | string;
    title_fa: string;
    title_en: string;
    category_fa: string;
    category_en: string;
    description_fa: string;
    description_en: string;
    featured: boolean;
    tags?: any[];
    cover_image?: any;
    gallery?: any[];
    // ✅ فیلدهای جدید برای مشخصات
    weight?: string;
    material?: string;
    dimensions?: string;
    production_time?: string;
};

type Props = {
    params: Promise<{
        locale: string;
        slug: string;
    }>;
};

const getSlug = (slug: any): string => {
    if (!slug) return "";
    if (typeof slug === "string") return slug;
    if (typeof slug === "object" && slug.current) return slug.current;
    return "";
};

export default async function ProjectPage({ params }: Props) {
    const { locale, slug } = await params;
    const isFa = locale === "fa";

    const portfolioItems: PortfolioItem[] = await getPortfolioItems();

    const project = portfolioItems.find(
        (item) => getSlug(item.slug) === slug
    );

    if (!project) {
        notFound();
    }

    const title = isFa ? project.title_fa : project.title_en;
    const category = isFa ? project.category_fa : project.category_en;
    const description = isFa ? project.description_fa : project.description_en;

    const imageUrl = getOptimizedImage(project.cover_image, {
        width: 1200,
        quality: 80,
        format: "webp"
    }) || "/placeholder.jpg";

    const galleryImages = (project.gallery || [])
        .map((g) => getOptimizedImage(g, { width: 1200, quality: 80, format: "webp" }))
        .filter(Boolean) as string[];

    const currentTags = (project.tags || [])
        .map((tag) => tag._ref || tag.slug?.current || tag.slug)
        .filter(Boolean);

    const relatedProjects = portfolioItems
        .filter((item) => {
            if (getSlug(item.slug) === slug) {
                return false;
            }

            const itemTags = (item.tags || [])
                .map((tag) => tag._ref || tag.slug?.current || tag.slug)
                .filter(Boolean);

            return itemTags.some((tag) => currentTags.includes(tag));
        })
        .slice(0, 3);

    // ✅ Breadcrumb items
    const breadcrumbItems = [
        {
            name: isFa ? "خانه" : "Home",
            url: `/${locale}`,
        },
        {
            name: isFa ? "نمونه‌کارها" : "Portfolio",
            url: `/${locale}/portfolio`,
        },
        {
            name: title,
            url: `/${locale}/portfolio/${slug}`,
        },
    ];

    // ✅ مشخصات محصول
    const specs = {
        material: project.material || (isFa ? "طلای 18 عیار" : "18K Gold"),
        weight: project.weight || (isFa ? "حدود 10 گرم" : "Approx. 10g"),
        dimensions: project.dimensions || (isFa ? "قابل سفارشی‌سازی" : "Customizable"),
        productionTime: project.production_time || (isFa ? "10-14 روز کاری" : "10-14 business days"),
    };

    return (
        <main className="min-h-screen bg-transparent text-white">

            {/* ✅ Breadcrumb Schema */}
            <BreadcrumbSchema items={breadcrumbItems} />

            {/* ============================================
                HERO SECTION - حرفه‌ای‌تر
            ============================================ */}
            <section className="pt-32 pb-24 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute left-1/4 top-20 h-96 w-96 rounded-full bg-[#D4AF37]/5 blur-[140px]" />
                    <div className="absolute right-1/4 bottom-20 h-96 w-96 rounded-full bg-white/[0.02] blur-[140px]" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">

                    {/* ✅ Breadcrumb بصری */}
                    <nav className="flex items-center gap-2 text-sm mb-8">
                        <Link href={`/${locale}`} className="text-[#a3a3a3] hover:text-[#D4AF37] transition-colors">
                            {isFa ? "خانه" : "Home"}
                        </Link>
                        <span className="text-[#D4AF37]">/</span>
                        <Link href={`/${locale}/portfolio`} className="text-[#a3a3a3] hover:text-[#D4AF37] transition-colors">
                            {isFa ? "نمونه‌کارها" : "Portfolio"}
                        </Link>
                        <span className="text-[#D4AF37]">/</span>
                        <span className="text-white truncate max-w-xs">{title}</span>
                    </nav>

                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        {/* CONTENT */}
                        <div className="space-y-8">
                            {/* ✅ Badge با آیکون */}
                            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 px-4 py-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                                <span className="text-[#D4AF37] uppercase tracking-[0.3em] text-sm">
                                    {category}
                                </span>
                            </div>

                            {/* ✅ عنوان با gradient */}
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extralight leading-tight">
                                <span className="bg-gradient-to-r from-white via-white to-[#D4AF37] bg-clip-text text-transparent">
                                    {title}
                                </span>
                            </h1>

                            <div className="w-24 h-px bg-gradient-to-r from-[#D4AF37] to-transparent" />

                            <p className="text-[#e5e5e5] leading-9 text-lg max-w-xl">
                                {description}
                            </p>

                            {/* ✅ مشخصات سریع */}
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                                    <p className="text-xs text-[#a3a3a3] mb-1">
                                        {isFa ? "متریال" : "Material"}
                                    </p>
                                    <p className="text-white font-medium">{specs.material}</p>
                                </div>
                                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                                    <p className="text-xs text-[#a3a3a3] mb-1">
                                        {isFa ? "وزن" : "Weight"}
                                    </p>
                                    <p className="text-white font-medium">{specs.weight}</p>
                                </div>
                                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                                    <p className="text-xs text-[#a3a3a3] mb-1">
                                        {isFa ? "زمان تولید" : "Production Time"}
                                    </p>
                                    <p className="text-white font-medium">{specs.productionTime}</p>
                                </div>
                                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                                    <p className="text-xs text-[#a3a3a3] mb-1">
                                        {isFa ? "ابعاد" : "Dimensions"}
                                    </p>
                                    <p className="text-white font-medium">{specs.dimensions}</p>
                                </div>
                            </div>

                            {/* ✅ دکمه‌های CTA */}
                            <div className="flex flex-wrap gap-4 pt-4">
                                <Link
                                    href="/en/contact"
                                    className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#8B7332] text-black font-medium uppercase tracking-[0.2em] text-sm hover:from-[#FFE8A3] hover:to-[#D4AF37] transition-all duration-300 shadow-lg shadow-[#D4AF37]/25"
                                >
                                    {isFa ? "سفارش این طرح" : "Order This Design"}
                                </Link>
                                <Link
                                    href={`/${locale}/portfolio`}
                                    className="inline-flex items-center justify-center h-14 px-8 rounded-full border border-white/20 text-white uppercase tracking-[0.2em] text-sm hover:bg-white/5 transition-all duration-300"
                                >
                                    {isFa ? "مشاهده همه" : "View All"}
                                </Link>
                            </div>

                            {/* ✅ نشانه‌های اعتماد */}
                            <div className="flex items-center gap-6 pt-4 text-xs text-[#a3a3a3]">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    <span>{isFa ? "ضمانت کیفیت" : "Quality Guarantee"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{isFa ? "10-14 روز کاری" : "10-14 Days"}</span>
                                </div>
                            </div>
                        </div>

                        {/* IMAGE */}
                        <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] bg-zinc-900 group border border-white/10 shadow-2xl">
                            <Image
                                src={imageUrl}
                                alt={title}
                                fill
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover transition duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>

                    </div>
                </div>
            </section>

            {/* GALLERY - بدون تغییر */}
            {galleryImages.length > 0 && (
                <section className="pb-32">
                    <div className="max-w-7xl mx-auto px-6">
                        <PortfolioGallery
                            title={title}
                            images={galleryImages}
                        />
                    </div>
                </section>
            )}

            {/* ============================================
                CTA SECTION - جدید و قوی‌تر
            ============================================ */}
            <section className="pb-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="relative rounded-[32px] border border-[#D4AF37]/20 bg-gradient-to-br from-[#D4AF37]/5 via-transparent to-transparent px-8 py-16 overflow-hidden">
                        {/* Background Glow */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none" />

                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div>
                                <p className="text-[#D4AF37] uppercase tracking-[0.3em] text-xs mb-4">
                                    {isFa ? "طراحی اختصاصی" : "Custom Design"}
                                </p>

                                <h2 className="text-3xl md:text-4xl font-extralight mb-4">
                                    {isFa
                                        ? "آیا طرح مشابهی در ذهن دارید؟"
                                        : "Have a Similar Design in Mind?"
                                    }
                                </h2>

                                <p className="text-[#e5e5e5] max-w-2xl leading-8">
                                    {isFa
                                        ? "با تیم طراحی ما تماس بگیرید. ما می‌توانیم این طرح را با سلیقه و اندازه دلخواه شما سفارشی‌سازی کنیم."
                                        : "Get in touch with our design team. We can customize this design according to your taste and size preferences."}
                                </p>
                            </div>

                            <Link
                                href="/en/contact"
                                className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#8B7332] text-black font-medium uppercase tracking-[0.2em] text-sm hover:from-[#FFE8A3] hover:to-[#D4AF37] transition-all duration-300 shadow-lg shadow-[#D4AF37]/25 shrink-0"
                            >
                                {isFa ? "تماس با ما" : "Contact Us"} →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* RELATED PROJECTS - بدون تغییر */}
            {relatedProjects.length > 0 && (
                <section className="border-t border-white/10 pt-24 pb-32">
                    <div className="max-w-7xl mx-auto px-6">

                        <div className="mb-14">
                            <p className="text-[#d4af37] tracking-[0.3em] uppercase text-sm mb-4">
                                Portfolio
                            </p>

                            <h2 className="text-4xl md:text-5xl font-extralight">
                                {isFa ? "پروژه‌های مشابه" : "Related Projects"}
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {relatedProjects.map((item: PortfolioItem) => {
                                const itemTitle = isFa ? item.title_fa : item.title_en;
                                const itemCategory = isFa ? item.category_fa : item.category_en;
                                const itemImage = getOptimizedImage(item.cover_image, {
                                    width: 900,
                                    quality: 75,
                                    format: "webp"
                                }) || "/placeholder.jpg";

                                return (
                                    <Link
                                        key={item._id}
                                        href={`/${locale}/portfolio/${getSlug(item.slug)}`}
                                        className="group block"
                                    >
                                        <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-zinc-900 mb-5">
                                            <Image
                                                src={itemImage}
                                                alt={itemTitle}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className="object-cover transition duration-700 group-hover:scale-105"
                                            />
                                        </div>

                                        <p className="text-[#d4af37] text-xs tracking-[0.25em] uppercase mb-2">
                                            {itemCategory}
                                        </p>

                                        <h3 className="text-2xl font-light transition group-hover:text-[#d4af37]">
                                            {itemTitle}
                                        </h3>
                                    </Link>
                                );
                            })}
                        </div>

                    </div>
                </section>
            )}

        </main>
    );
}