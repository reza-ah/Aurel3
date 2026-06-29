import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/api-auth";

const DIRECTUS_URL = process.env.DIRECTUS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL;
const TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

function authHeaders(): Record<string, string> {
    return TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {};
}

export async function GET() {
    const authError = await requireAdminAuth();

    if (authError) {
        return authError;
    }

    const res = await fetch(`${DIRECTUS_URL}/items/pricing_items_new`, {
        headers: authHeaders(),
        cache: "no-store",
    });

    return NextResponse.json(await res.json());
}

export async function POST(req: Request) {
    const authError = await requireAdminAuth();

    if (authError) {
        return authError;
    }

    const body = await req.json();
    const res = await fetch(`${DIRECTUS_URL}/items/pricing_items_new`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...authHeaders(),
        },
        body: JSON.stringify(body),
    });

    return NextResponse.json(await res.json());
}

export async function PATCH(req: Request) {
    const authError = await requireAdminAuth();

    if (authError) {
        return authError;
    }

    const { id, ...data } = await req.json();
    const res = await fetch(`${DIRECTUS_URL}/items/pricing_items_new/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            ...authHeaders(),
        },
        body: JSON.stringify(data),
    });

    return NextResponse.json(await res.json());
}

export async function DELETE(req: Request) {
    const authError = await requireAdminAuth();

    if (authError) {
        return authError;
    }

    const { id } = await req.json();

    await fetch(`${DIRECTUS_URL}/items/pricing_items_new/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    });

    return NextResponse.json({ success: true });
}
