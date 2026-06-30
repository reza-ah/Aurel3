import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";
import { requireAdminAuth } from "@/lib/api-auth";

export async function GET() {
    const authError = await requireAdminAuth();
    if (authError) {
        return authError;
    }

    try {
        const tags = await client.fetch(
            `*[_type == "portfolioTag"] | order(sort asc) {
                _id,
                name_en,
                name_fa,
                sort
            }`
        );

        return NextResponse.json(tags);
    } catch (error) {
        console.error("Portfolio tags error:", error);
        return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 });
    }
}