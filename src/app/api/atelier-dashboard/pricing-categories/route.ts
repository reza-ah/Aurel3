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

        return NextResponse.json(categories);
    } catch (error) {
        console.error("Pricing categories error:", error);
        return NextResponse.json([], { status: 200 });
    }
}

export async function POST(request: NextRequest) {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    try {
        const body = await request.json();

        const result = await writeClient.create({
            _type: "pricingCategory",
            title_en: body.title_en || "",
            title_fa: body.title_fa || "",
            description_en: body.description_en || "",
            description_fa: body.description_fa || "",
            image: body.image || null,
            sort: body.sort || 999,
            date_created: new Date().toISOString(),
        });

        revalidatePath("/[locale]/pricing", "page");
        revalidatePath("/en/pricing", "page");
        revalidatePath("/fa/pricing", "page");

        return NextResponse.json(result);
    } catch (error) {
        console.error("Pricing category POST error:", error);
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    try {
        const body = await request.json();

        if (body._id) {
            await writeClient
                .patch(body._id)
                .set({
                    title_en: body.title_en,
                    title_fa: body.title_fa,
                    description_en: body.description_en,
                    description_fa: body.description_fa,
                    image: body.image || null,
                    sort: body.sort,
                })
                .commit();
        }

        revalidatePath("/[locale]/pricing", "page");
        revalidatePath("/en/pricing", "page");
        revalidatePath("/fa/pricing", "page");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Pricing category PATCH error:", error);
        return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
    }
}

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
        console.error("Pricing category DELETE error:", error);
        return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
    }
}