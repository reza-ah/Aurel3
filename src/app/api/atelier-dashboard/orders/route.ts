import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/api-auth";

const DIRECTUS_URL = process.env.DIRECTUS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL;
const DIRECTUS_TOKEN =
    process.env.DIRECTUS_STATIC_TOKEN ||
    process.env.DIRECTUS_ADMIN_TOKEN ||
    process.env.DIRECTUS_TOKEN;

function directusHeaders(): Record<string, string> {
    return {
        "Content-Type": "application/json",
        ...(DIRECTUS_TOKEN ? { Authorization: `Bearer ${DIRECTUS_TOKEN}` } : {}),
    };
}

export async function GET() {
    const authError = await requireAdminAuth();

    if (authError) {
        return authError;
    }

    try {
        const res = await fetch(`${DIRECTUS_URL}/items/orders`, {
            headers: directusHeaders(),
            cache: "no-store",
        });
        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(
                { error: "Failed to fetch orders from Directus" },
                { status: res.status }
            );
        }

        return NextResponse.json(data.data || []);
    } catch {
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const res = await fetch(`${DIRECTUS_URL}/items/orders`, {
            method: "POST",
            headers: directusHeaders(),
            body: JSON.stringify(body),
        });
        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(
                { error: data.errors?.[0]?.message || "Failed to create order" },
                { status: res.status }
            );
        }

        const trackingCode = `ORD-${data.data.id || Math.floor(1000 + Math.random() * 9000)}`;

        return NextResponse.json({ success: true, tracking_code: trackingCode, data: data.data });
    } catch {
        return NextResponse.json({ error: "Server error during order submission" }, { status: 500 });
    }
}
