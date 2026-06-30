import { NextRequest, NextResponse } from "next/server";
import { client, writeClient } from "@/lib/sanity";
import { requireAdminAuth } from "@/lib/api-auth";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    try {
        const { id } = await params;
        const item = await client.fetch(
            `*[_type == "portfolio" && _id == $id][0] {
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
            }`,
            { id }
        );

        if (!item) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

        return NextResponse.json(item);
    } catch (error) {
        console.error("Get portfolio item error:", error);
        return NextResponse.json({ error: "Failed to fetch item" }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    try {
        const { id } = await params;
        const body = await request.json();

        await writeClient
            .patch(id)
            .set(body)
            .commit();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Update portfolio error:", error);
        return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    try {
        const { id } = await params;
        await writeClient.delete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete portfolio error:", error);
        return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
    }
}