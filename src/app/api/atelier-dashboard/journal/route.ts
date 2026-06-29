import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/api-auth";

const DIRECTUS_URL = process.env.DIRECTUS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL;
const DIRECTUS_ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

function authHeaders(): Record<string, string> {
    return DIRECTUS_ADMIN_TOKEN ? { Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}` } : {};
}

export async function GET() {
    const authError = await requireAdminAuth();

    if (authError) {
        return authError;
    }

    try {
        const res = await fetch(
            `${DIRECTUS_URL}/items/journal?fields=id,slug,title_en,title_fa,excerpt_en,excerpt_fa,cover_image.id,status,date_created&sort=-date_created`,
            {
                headers: authHeaders(),
                cache: "no-store",
            }
        );

        return NextResponse.json(await res.json());
    } catch {
        return NextResponse.json({ error: "Failed to fetch journal posts" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const authError = await requireAdminAuth();

    if (authError) {
        return authError;
    }

    try {
        const body = await request.json();
        const res = await fetch(`${DIRECTUS_URL}/items/journal`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...authHeaders(),
            },
            body: JSON.stringify({
                title_en: body.title_en || "",
                title_fa: body.title_fa || "",
                slug: body.slug,
                excerpt_en: body.excerpt_en || "",
                excerpt_fa: body.excerpt_fa || "",
                content_en: body.content_en || "",
                content_fa: body.content_fa || "",
                cover_image: body.cover_image || null,
                status: body.status || "draft",
            }),
        });

        return NextResponse.json(await res.json());
    } catch {
        return NextResponse.json({ error: "Failed to create journal post" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const authError = await requireAdminAuth();

    if (authError) {
        return authError;
    }

    try {
        const id = new URL(request.url).searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Missing id" }, { status: 400 });
        }

        const res = await fetch(`${DIRECTUS_URL}/items/journal/${id}`, {
            method: "DELETE",
            headers: authHeaders(),
        });

        if (res.status === 204) {
            return NextResponse.json({ success: true });
        }

        return NextResponse.json(await res.json());
    } catch {
        return NextResponse.json({ error: "Failed to delete journal post" }, { status: 500 });
    }
}
