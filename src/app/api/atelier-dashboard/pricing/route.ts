import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { client, writeClient } from "@/lib/sanity";
import { requireAdminAuth } from "@/lib/api-auth";

type PricingItem = {
    _id: string;
    title_en?: string;
    title_fa?: string;
    description_en?: string;
    description_fa?: string;
    sort?: number;
    is_active?: boolean;
    price_en?: string;
    price_fa?: string;
    delivery_time_en?: string;
    delivery_time_fa?: string;
    suitable_en?: string;
    suitable_fa?: string;
    features_en?: string;
    features_fa?: string;
    img?: string | null;
    category?: { _type: string; _ref: string } | string | null;
};

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
            `*[_type == "pricingItem"] | order(sort asc) {
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

// ✅ POST - اضافه کردن pricing item جدید
export async function POST(request: NextRequest) {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    try {
        const body = await request.json();

        const result = await writeClient.create({
            _type: "pricingItem",
            title_en: body.title_en || "",
            title_fa: body.title_fa || "",
            description_en: body.description_en || "",
            description_fa: body.description_fa || "",
            price_en: body.price_en || "",
            price_fa: body.price_fa || "",
            delivery_time_en: body.delivery_time_en || "",
            delivery_time_fa: body.delivery_time_fa || "",
            suitable_en: body.suitable_en || "",
            suitable_fa: body.suitable_fa || "",
            features_en: body.features_en || "",
            features_fa: body.features_fa || "",
            img: body.img ? { _type: "image", asset: { _type: "reference", _ref: typeof body.img === "string" ? body.img : body.img._ref } } : null,
            category: body.category ? { _type: "reference", _ref: typeof body.category === "string" ? body.category : body.category._ref } : null,
            sort: body.sort || 999,
            is_active: body.is_active !== false,
            // ❌ حذف date_created - Sanity خودش _createdAt را اضافه می‌کند
        });

        revalidatePath("/[locale]/pricing", "page");
        revalidatePath("/en/pricing", "page");
        revalidatePath("/fa/pricing", "page");

        return NextResponse.json(result);
    } catch (error) {
        console.error("Pricing POST error:", error);
        return NextResponse.json({ error: "Failed to create pricing item" }, { status: 500 });
    }
}

// ✅ PATCH - به‌روزرسانی pricing items
export async function PATCH(request: NextRequest) {
    const authError = await requireAdminAuth();
    if (authError) return authError;
    try {
        const body = await request.json();

        // ✅ پشتیبانی از دو فرمت: array یا single item
        if (Array.isArray(body.items)) {
            const updatePromises = body.items.map((item: PricingItem) =>
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
                        img: item.img || null,
                        category: item.category ? { _type: "reference", _ref: typeof item.category === "string" ? item.category : item.category._ref } : null,
                    })
                    .commit()
            );

            await Promise.all(updatePromises);
        } else if (body._id) {
            // ✅ فرمت single item
            await writeClient
                .patch(body._id)
                .set({
                    title_en: body.title_en,
                    title_fa: body.title_fa,
                    description_en: body.description_en,
                    description_fa: body.description_fa,
                    sort: body.sort,
                    is_active: body.is_active,
                    price_en: body.price_en,
                    price_fa: body.price_fa,
                    delivery_time_en: body.delivery_time_en,
                    delivery_time_fa: body.delivery_time_fa,
                    suitable_en: body.suitable_en,
                    suitable_fa: body.suitable_fa,
                    features_en: body.features_en,
                    features_fa: body.features_fa,
                    img: body.img ? {
                        _type: "image",
                        asset: {
                            _type: "reference",
                            _ref: typeof body.img === "string" ? body.img : body.img._ref || body.img
                        }
                    } : null,
                    category: body.category ? { _type: "reference", _ref: typeof body.category === "string" ? body.category : body.category._ref } : null,
                })
                .commit();
        }

        revalidatePath("/[locale]/pricing", "page");
        revalidatePath("/en/pricing", "page");
        revalidatePath("/fa/pricing", "page");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Update pricing error:", error);
        return NextResponse.json({ error: "Failed to update pricing" }, { status: 500 });
    }
}

// ✅ DELETE - حذف pricing item
export async function DELETE(request: NextRequest) {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    try {
        const id = request.nextUrl.searchParams.get("id");
        if (!id) {
            return NextResponse.json({ error: "Missing id" }, { status: 400 });
        }

        await writeClient.delete(id);

        revalidatePath("/[locale]/pricing", "page");
        revalidatePath("/en/pricing", "page");
        revalidatePath("/fa/pricing", "page");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Pricing DELETE error:", error);
        return NextResponse.json({ error: "Failed to delete pricing item" }, { status: 500 });
    }
}