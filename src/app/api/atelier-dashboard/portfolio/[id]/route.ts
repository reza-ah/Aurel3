import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/api-auth";
import { revalidatePath } from "next/cache"; // 👈 اضافه شدن تابع مدیریت کش نکست

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PortfolioUpdateBody = {
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

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    try {
        const { id } = await context.params;

        const res = await fetch(
            `${DIRECTUS_URL}/items/portfolio/${id}?fields=*,gallery.directus_files_id.*,tags.portfolio_tags_id.*`,
            {
                headers: authHeaders(),
                cache: "no-store",
            }
        );

        if (!res.ok) {
            return NextResponse.json(
                { error: "Failed to fetch portfolio from Directus" },
                { status: res.status, headers: noCacheHeaders }
            );
        }

        const data = await res.json();

        return NextResponse.json(data, {
            headers: noCacheHeaders,
        });
    } catch (error) {
        console.error("💥 GET Catch Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500, headers: noCacheHeaders }
        );
    }
}

export async function PATCH(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    try {
        const { id } = await context.params;
        const body = (await request.json()) as PortfolioUpdateBody;

        console.log("📥 Incoming Payload from Frontend:", body);

        const updateData: Record<string, unknown> = {
            title_en: body.title_en ?? body.titleEn,
            title_fa: body.title_fa ?? body.titleFa,
            slug: body.slug,
            category_fa: body.category_fa ?? body.categoryFa,
            category_en: body.category_en ?? body.categoryEn,
            description_fa: body.description_fa ?? body.descriptionFa,
            description_en: body.description_en ?? body.descriptionEn,
            featured: body.featured !== undefined ? body.featured : undefined,
            cover_image: body.cover_image ?? body.coverImage,
        };

        if (body.status) {
            updateData.status = body.status;
        }

        if (Array.isArray(body.gallery)) {
            updateData.gallery = body.gallery.map((fileId: string) => ({
                directus_files_id: fileId,
            }));
        }

        if (Array.isArray(body.tags)) {
            updateData.tags = body.tags.map((tagId: string) => ({
                portfolio_tags_id: tagId,
            }));
        }

        Object.keys(updateData).forEach((key) => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        console.log("📤 Final Data Sending to Directus:", updateData);

        const res = await fetch(`${DIRECTUS_URL}/items/portfolio/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...authHeaders(),
            },
            body: JSON.stringify(updateData),
        });

        if (!res.ok) {
            const details = await res.text();
            console.error("❌ Directus PATCH Error:", details);

            return NextResponse.json(
                { error: "Failed to update portfolio in Directus", details },
                { status: res.status }
            );
        }

        const updatedData = await res.json();

        // 👈 پاک کردن آنی کش کامپوننت‌ها پس از آپدیت موفق وضعیت یا دیتای آیتم
        revalidatePath("/[locale]/portfolio", "page");
        revalidatePath("/[locale]/atelier-dashboard/portfolio", "page");

        return NextResponse.json(updatedData, { headers: noCacheHeaders });
    } catch (error) {
        console.error("💥 PATCH Catch Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    try {
        const { id } = await context.params;
        const res = await fetch(`${DIRECTUS_URL}/items/portfolio/${id}`, {
            method: "DELETE",
            headers: authHeaders(),
        });

        if (!res.ok) {
            return NextResponse.json(
                { error: "Failed to delete portfolio from Directus" },
                { status: res.status }
            );
        }

        // 👈 پاک کردن کش پس از حذف آیتم
        revalidatePath("/[locale]/portfolio", "page");
        revalidatePath("/[locale]/atelier-dashboard/portfolio", "page");

        return NextResponse.json({ success: true }, { headers: noCacheHeaders });
    } catch (error) {
        console.error("💥 DELETE Catch Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}