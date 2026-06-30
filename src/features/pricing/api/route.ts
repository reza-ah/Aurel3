import { NextResponse } from "next/server";
import { client } from "@/lib/sanity";
import { requireAdminAuth } from "@/lib/api-auth";

export async function GET() {
    const authError = await requireAdminAuth();
    if (authError) {
        return authError;
    }

    try {
        const categories = await client.fetch(
            `*[_type == "pricingCategory"] | order(sort asc) {
                _id,
                title_en,
                title_fa,
                slug,
                image,
                sort,
                description_en,
                description_fa
            }`
        );

        return NextResponse.json(categories);
    } catch (error) {
        console.error("Pricing categories error:", error);
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}