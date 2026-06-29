import { NextRequest, NextResponse } from "next/server";

const DIRECTUS_URL = process.env.DIRECTUS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://127.0.0.1:8055";
const DIRECTUS_TOKEN = process.env.DIRECTUS_STATIC_TOKEN || process.env.DIRECTUS_ADMIN_TOKEN;

const uploadCounts = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: NextRequest) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
    const now = Date.now();
    const limit = uploadCounts.get(ip);

    if (limit && limit.resetAt > now && limit.count >= 10) {
        return NextResponse.json({ error: "Too many uploads" }, { status: 429 });
    }

    if (!limit || limit.resetAt <= now) {
        uploadCounts.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 });
    } else {
        limit.count++;
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file || !(file instanceof Blob)) {
            return NextResponse.json({ error: "No file field in form-data" }, { status: 400 });
        }

        const directusForm = new FormData();
        directusForm.append("file", file);

        const res = await fetch(`${DIRECTUS_URL}/files`, {
            method: "POST",
            headers: DIRECTUS_TOKEN ? { Authorization: `Bearer ${DIRECTUS_TOKEN}` } : undefined,
            body: directusForm,
        });

        if (!res.ok) {
            return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
        }

        const json = await res.json();
        return NextResponse.json({ data: { id: json.data?.id, ...json.data } });
    } catch {
        return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
    }
}
