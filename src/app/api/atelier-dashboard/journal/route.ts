import { NextRequest, NextResponse } from "next/server";
import { client, writeClient } from "@/lib/sanity";
import { requireAdminAuth } from "@/lib/api-auth";

export async function GET() {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    try {
        const posts = await client.fetch(
            `*[_type == "journal"] | order(date_created desc) {
                _id,
                slug,
                title_en,
                title_fa,
                excerpt_en,
                excerpt_fa,
                cover_image,
                status,
                date_created
            }`
        );

        return NextResponse.json(posts);
    } catch (error) {
        console.error("Journal error:", error);
        return NextResponse.json([], { status: 200 });
    }
}

export async function POST(request: NextRequest) {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    try {
        const body = await request.json();

        const result = await writeClient.create({
            _type: "journal",
            title_en: body.title_en || "",
            title_fa: body.title_fa || "",
            slug: { _type: "slug", current: body.slug },
            excerpt_en: body.excerpt_en || "",
            excerpt_fa: body.excerpt_fa || "",
            content_en: body.content_en || "",
            content_fa: body.content_fa || "",
            cover_image: body.cover_image || null,
            status: body.status || "draft",
            date_created: new Date().toISOString(),
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Journal POST error:", error);
        return NextResponse.json({ error: "Failed to create" }, { status: 500 });
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
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Journal DELETE error:", error);
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}