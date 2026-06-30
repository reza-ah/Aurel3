import { NextRequest, NextResponse } from "next/server";
import { client, writeClient } from "@/lib/sanity";
import { requireAdminAuth } from "@/lib/api-auth";

export async function GET() {
    const authError = await requireAdminAuth();
    if (authError) return authError;
    try {
        const orders = await client.fetch(
            `*[_type == "order"] | order(date_created desc) {
                _id,
                name,
                email,
                phone,
                message,
                status,
                date_created
            }`
        );

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Orders error:", error);
        return NextResponse.json([], { status: 200 });
    }
}

export async function PATCH(request: NextRequest) {
    const authError = await requireAdminAuth();
    if (authError) return authError;
    try {
        const body = await request.json();
        const { orderId, status } = body;

        if (!orderId || !status) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        await writeClient
            .patch(orderId)
            .set({ status })
            .commit();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Update order error:", error);
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }
}