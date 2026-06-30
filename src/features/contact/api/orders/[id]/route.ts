import { NextRequest, NextResponse } from "next/server";
import { client, writeClient } from "@/lib/sanity";
import { requireAdminAuth } from "@/lib/api-auth";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }  // ✅ Promise
) {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    try {
        const { id } = await params;  // ✅ await
        const order = await client.fetch(
            `*[_type == "order" && _id == $id][0] {
                _id,
                name,
                email,
                phone,
                message,
                files,
                status,
                date_created
            }`,
            { id }
        );

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error("Get order error:", error);
        return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }  // ✅ Promise
) {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    try {
        const { id } = await params;  // ✅ await
        const body = await request.json();

        await writeClient
            .patch(id)
            .set({ status: body.status })
            .commit();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Update order error:", error);
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }  // ✅ Promise
) {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    try {
        const { id } = await params;  // ✅ await
        await writeClient.delete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete order error:", error);
        return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
    }
}