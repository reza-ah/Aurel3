import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/api-auth";

const DIRECTUS_URL = process.env.DIRECTUS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL;
const DIRECTUS_ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

export async function POST(request: Request) {
    const authError = await requireAdminAuth();

    if (authError) {
        return authError;
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file || !(file instanceof Blob)) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const uploadForm = new FormData();
        uploadForm.append("file", file);

        const res = await fetch(`${DIRECTUS_URL}/files`, {
            method: "POST",
            headers: DIRECTUS_ADMIN_TOKEN
                ? { Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}` }
                : undefined,
            body: uploadForm,
        });
        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json({ error: "Directus upload failed" }, { status: 500 });
        }

        return NextResponse.json({ fileId: data.data.id });
    } catch {
        return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
    }
}
