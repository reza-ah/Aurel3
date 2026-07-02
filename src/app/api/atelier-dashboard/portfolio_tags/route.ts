import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { client, writeClient } from "@/lib/sanity";
import { requireAdminAuth } from "@/lib/api-auth";

export async function GET() {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    try {
        const tags = await client.fetch(
            `*[_type == "portfolioTag"] | order(sort asc) {
                _id,
                name_en,
                name_fa,
                sort,
                is_active
            }`
        );

        return NextResponse.json(tags);
    } catch (error) {
        console.error("Portfolio tags error:", error);
        return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    try {
        const body = await request.json();

        if (!body.name_en || !body.name_fa) {
            return NextResponse.json(
                { error: "Name (EN) and Name (FA) are required" },
                { status: 400 }
            );
        }

        const result = await writeClient.create({
            _type: "portfolioTag",
            name_en: body.name_en,
            name_fa: body.name_fa,
            sort: body.sort || 999,
            is_active: body.is_active !== false,
        });

        revalidatePath("/[locale]/portfolio", "page");
        revalidatePath("/en/portfolio", "page");
        revalidatePath("/fa/portfolio", "page");

        return NextResponse.json(result);
    } catch (error) {
        console.error("Portfolio tag POST error:", error);
        return NextResponse.json({ error: "Failed to create tag" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    try {
        const body = await request.json();

        if (!body._id) {
            return NextResponse.json({ error: "Missing _id" }, { status: 400 });
        }

        await writeClient
            .patch(body._id)
            .set({
                name_en: body.name_en,
                name_fa: body.name_fa,
                sort: body.sort,
                is_active: body.is_active,
            })
            .commit();

        revalidatePath("/[locale]/portfolio", "page");
        revalidatePath("/en/portfolio", "page");
        revalidatePath("/fa/portfolio", "page");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Portfolio tag PATCH error:", error);
        return NextResponse.json({ error: "Failed to update tag" }, { status: 500 });
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

        revalidatePath("/[locale]/portfolio", "page");
        revalidatePath("/en/portfolio", "page");
        revalidatePath("/fa/portfolio", "page");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Portfolio tag DELETE error:", error);
        return NextResponse.json({ error: "Failed to delete tag" }, { status: 500 });
    }
}