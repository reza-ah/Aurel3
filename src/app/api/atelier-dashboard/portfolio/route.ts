import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/api-auth";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PortfolioCreateBody = {
    title_en?: string;
    title_fa?: string;
    slug?: string;
    category_fa?: string;
    category_en?: string;
    description_fa?: string;
    description_en?: string;
    featured?: boolean;
    cover_image?: string | null;
    status?: string;
    gallery?: string[];
    tags?: string[];
    titleEn?: string;
    titleFa?: string;
    categoryFa?: string;
    categoryEn?: string;
    descriptionFa?: string;
    descriptionEn?: string;
    coverImage?: string | null;
};

const DIRECTUS_URL = process.env.DIRECTUS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL;
const DIRECTUS_ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

function authHeaders(): Record<string, string> {
    return DIRECTUS_ADMIN_TOKEN ? { Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}` } : {};
}

const noCacheHeaders = {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
    "Pragma": "no-cache",
    "Expires": "0",
};

export async function GET() {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    try {
        // 👈 اضافه شدن فیلتر وضعیت برای دریافت همزمان منتشرشده‌ها، پیش‌نویس‌ها و آرشیوی‌ها از دایرکتوس
        const res = await fetch(
            `${DIRECTUS_URL}/items/portfolio?fields=*,gallery.directus_files_id.*,tags.portfolio_tags_id.*&sort=-date_created&filter[status][_in]=published,draft,archived`,
            {
                headers: authHeaders(),
                cache: "no-store",
            }
        );

        if (!res.ok) {
            return NextResponse.json(
                { error: "Failed to fetch portfolios" },
                { status: res.status, headers: noCacheHeaders }
            );
        }

        const data = await res.json();
        return NextResponse.json(data, { headers: noCacheHeaders });
    } catch (error) {
        console.error("💥 GET Portfolios Catch Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500, headers: noCacheHeaders }
        );
    }
}

export async function POST(request: Request) {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    try {
        const body = (await request.json()) as PortfolioCreateBody;
        console.log("📥 Incoming Create Payload from Frontend:", body);

        const createData: Record<string, unknown> = {
            title_en: body.title_en ?? body.titleEn,
            title_fa: body.title_fa ?? body.titleFa,
            slug: body.slug,
            category_fa: body.category_fa ?? body.categoryFa,
            category_en: body.category_en ?? body.categoryEn,
            description_fa: body.description_fa ?? body.descriptionFa,
            description_en: body.description_en ?? body.descriptionEn,
            featured: body.featured ?? false,
            cover_image: body.cover_image ?? body.coverImage,
            status: body.status || "published",
        };

        if (Array.isArray(body.gallery)) {
            createData.gallery = body.gallery.map((id: string) => ({
                directus_files_id: id,
            }));
        }

        if (Array.isArray(body.tags)) {
            createData.tags = body.tags.map((tagId: string) => ({
                portfolio_tags_id: tagId,
            }));
        }

        Object.keys(createData).forEach((key) => {
            if (createData[key] === undefined) {
                delete createData[key];
            }
        });

        console.log("📤 Final Data Creating in Directus:", createData);

        const res = await fetch(`${DIRECTUS_URL}/items/portfolio`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...authHeaders(),
            },
            body: JSON.stringify(createData),
        });

        if (!res.ok) {
            const details = await res.text();
            console.error("❌ Directus POST Error:", details);

            return NextResponse.json(
                { error: "Failed to create portfolio", details },
                { status: res.status }
            );
        }

        const createdItem = await res.json();

        // 👈 پاک کردن کش سیستم برای اعمال تغییرات در فرانت عمومی و پنل مدیریت داشبورد
        revalidatePath("/[locale]/portfolio", "page");
        revalidatePath("/[locale]/atelier-dashboard/portfolio", "page");

        return NextResponse.json(createdItem, { status: 201, headers: noCacheHeaders });
    } catch (error) {
        console.error("💥 POST Create Catch Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}