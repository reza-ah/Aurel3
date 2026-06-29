import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const DIRECTUS_URL = process.env.DIRECTUS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL;
const DIRECTUS_ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

export async function GET() {
    const cookieStore = await cookies();
    if (!cookieStore.get("admin_auth")?.value) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const res = await fetch(`${DIRECTUS_URL}/items/pricing_categories`, {
            headers: { Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}` },
            cache: "no-store",
        });

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}

