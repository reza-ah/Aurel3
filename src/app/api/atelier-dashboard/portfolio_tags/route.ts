import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/api-auth";

const DIRECTUS_URL = process.env.DIRECTUS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL;
const DIRECTUS_ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

export async function GET() {
    const authError = await requireAdminAuth();

    if (authError) {
        return authError;
    }

    const res = await fetch(`${DIRECTUS_URL}/items/portfolio_tags?sort=sort`, {
        headers: DIRECTUS_ADMIN_TOKEN ? { Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}` } : {},
        cache: "no-store",
    });

    return NextResponse.json(await res.json());
}
