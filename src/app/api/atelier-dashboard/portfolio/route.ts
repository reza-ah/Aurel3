import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { client, writeClient } from "@/lib/sanity";

export async function GET() {
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

export async function PATCH(request: NextRequest) {
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
                category_en: item.category_en,
                category_fa: item.category_fa,
                description_en: item.description_en,
                description_fa: item.description_fa,
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