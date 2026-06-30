import { NextRequest, NextResponse } from "next/server";
import { client, writeClient } from "@/lib/sanity";
import { requireAdminAuth } from "@/lib/api-auth";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    const order = await client.fetch(
        `*[_type == "order" && _id == $id][0]`,
        { id: params.id }
    );

    if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    const body = await request.json();

    await writeClient
        .patch(params.id)
        .set(body)
        .commit();

    return NextResponse.json({ success: true });
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    await writeClient.delete(params.id);

    return NextResponse.json({ success: true });
}