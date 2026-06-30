import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { client, writeClient } from "@/lib/sanity";
import { requireAdminAuth } from "@/lib/api-auth";

export async function GET() {
    const authError = await requireAdminAuth();
    if (authError) return authError;
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

        const items = await client.fetch(
            `*[_type == "pricingItem" && is_active == true] | order(sort asc) {
                _id,
                title_en,
                title_fa,
                description_en,
                description_fa,
                sort,
                is_active,
                price_en,
                price_fa,
                delivery_time_en,
                delivery_time_fa,
                img,
                suitable_en,
                suitable_fa,
                features_en,
                features_fa,
                category->{
                    _id,
                    title_en,
                    title_fa
                }
            }`
        );

        return NextResponse.json({ categories, items });
    } catch (error) {
        console.error("Pricing error:", error);
        return NextResponse.json({ categories: [], items: [] }, { status: 200 });
    }
}

export async function PATCH(request: NextRequest) {
    const authError = await requireAdminAuth();
    if (authError) return authError;
    try {
        const body = await request.json();
        const { items } = body;

        if (!Array.isArray(items)) {
            return NextResponse.json({ error: "Invalid items" }, { status: 400 });
        }

        const updatePromises = items.map((item) =>
            writeClient
                .patch(item._id)
                .set({
                    title_en: item.title_en,
                    title_fa: item.title_fa,
                    description_en: item.description_en,
                    description_fa: item.description_fa,
                    sort: item.sort,
                    is_active: item.is_active,
                    price_en: item.price_en,
                    price_fa: item.price_fa,
                    delivery_time_en: item.delivery_time_en,
                    delivery_time_fa: item.delivery_time_fa,
                    suitable_en: item.suitable_en,
                    suitable_fa: item.suitable_fa,
                    features_en: item.features_en,
                    features_fa: item.features_fa,
                })
                .commit()
        );

        await Promise.all(updatePromises);

        revalidatePath("/[locale]/pricing", "page");
        revalidatePath("/en/pricing", "page");
        revalidatePath("/fa/pricing", "page");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Update pricing error:", error);
        return NextResponse.json({ error: "Failed to update pricing" }, { status: 500 });
    }
}