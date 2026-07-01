import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { client, writeClient } from "@/lib/sanity";
import { requireAdminAuth } from "@/lib/api-auth";

export async function GET() {
    const authError = await requireAdminAuth();
    if (authError) return authError;
    try {
        const items = await client.fetch(
            `*[_type == "portfolio"] | order(date_created desc) {
                _id,
                slug,
                title_en,
                title_fa,
                category_en,
                category_fa,
                description_en,
                description_fa,
                cover_image,
                gallery,
                tags,
                featured,
                status,
                date_created
            }`
        );

        return NextResponse.json(items);
    } catch (error) {
        console.error("Portfolio error:", error);
        return NextResponse.json([], { status: 200 });
    }
}

export async function POST(request: NextRequest) {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    try {
        const body = await request.json();

        const result = await writeClient.create({
            _type: "portfolio",
            title_en: body.title_en || "",
            title_fa: body.title_fa || "",
            slug: body.slug ? { _type: "slug", current: body.slug } : undefined,
            category_en: body.category_en || "",
            category_fa: body.category_fa || "",
            description_en: body.description_en || "",
            description_fa: body.description_fa || "",
            cover_image: body.cover_image || null,
            // ✅ اصلاح: اضافه کردن _key به هر آیتم gallery
            gallery: Array.isArray(body.gallery)
                ? body.gallery.map((file: any, index: number) => ({
                    _key: `gallery-${Date.now()}-${index}`,
                    _type: 'image',
                    asset: {
                        _type: 'reference',
                        _ref: typeof file === 'string' ? file : file._ref || file,
                    },
                }))
                : [],
            tags: body.tags || [],
            featured: body.featured || false,
            status: body.status || "draft",
            date_created: new Date().toISOString(),
        });

        revalidatePath("/[locale]/portfolio", "page");
        revalidatePath("/[locale]/portfolio/[slug]", "page");
        revalidatePath("/en/portfolio", "page");
        revalidatePath("/fa/portfolio", "page");

        return NextResponse.json(result);
    } catch (error) {
        console.error("Portfolio POST error:", error);
        return NextResponse.json({ error: "Failed to create portfolio" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    const authError = await requireAdminAuth();
    if (authError) return authError;
    try {
        const body = await request.json();
        const { item } = body;

        if (!item || !item._id) {
            return NextResponse.json({ error: "Invalid item" }, { status: 400 });
        }

        await writeClient
            .patch(item._id)
            .set({
                title_en: item.title_en,
                title_fa: item.title_fa,
                slug: item.slug ? { _type: "slug", current: typeof item.slug === "string" ? item.slug : item.slug.current } : undefined,
                category_en: item.category_en,
                category_fa: item.category_fa,
                description_en: item.description_en,
                description_fa: item.description_fa,
                cover_image: item.cover_image || null,
                // ✅ اصلاح: اضافه کردن _key به gallery در PATCH هم
                gallery: Array.isArray(item.gallery)
                    ? item.gallery.map((file: any, index: number) => ({
                        _key: file._key || `gallery-${Date.now()}-${index}`,
                        _type: 'image',
                        asset: {
                            _type: 'reference',
                            _ref: typeof file === 'string' ? file : file.asset?._ref || file._ref || file,
                        },
                    }))
                    : undefined,
                tags: item.tags || [],
                featured: item.featured,
                status: item.status,
            })
            .commit();

        revalidatePath("/[locale]/portfolio", "page");
        revalidatePath("/[locale]/portfolio/[slug]", "page");
        revalidatePath("/en/portfolio", "page");
        revalidatePath("/fa/portfolio", "page");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Update portfolio error:", error);
        return NextResponse.json({ error: "Failed to update portfolio" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    try {
        const id = request.nextUrl.searchParams.get("id");
        if (!id) {
            return NextResponse.json({ error: "Missing id" }, { status: 400 });
        }

        await writeClient.delete(id);

        revalidatePath("/[locale]/portfolio", "page");
        revalidatePath("/[locale]/portfolio/[slug]", "page");
        revalidatePath("/en/portfolio", "page");
        revalidatePath("/fa/portfolio", "page");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Portfolio DELETE error:", error);
        return NextResponse.json({ error: "Failed to delete portfolio" }, { status: 500 });
    }
}