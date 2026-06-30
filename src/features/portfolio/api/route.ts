import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { client, writeClient } from "@/lib/sanity";
import { requireAdminAuth } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
    const authError = await requireAdminAuth();
    if (authError) return authError;
    const locale = request.nextUrl.searchParams.get("locale") || "en";

    try {
        const sections = await client.fetch(
            `*[_type == "homepageSection" && locale == $locale] | order(sort asc) {
                _id,
                type,
                enabled,
                locale,
                sort,
                label
            }`,
            { locale }
        );

        return NextResponse.json(sections);
    } catch (error) {
        console.error("Homepage sections error:", error);
        return NextResponse.json([], { status: 200 });
    }
}

export async function PATCH(request: NextRequest) {
    const authError = await requireAdminAuth();
    if (authError) return authError;
    try {
        const body = await request.json();
        const { sections, locale } = body;

        if (!Array.isArray(sections)) {
            return NextResponse.json({ error: "Invalid sections" }, { status: 400 });
        }

        const updatePromises = sections.map((section) =>
            writeClient
                .patch(section._id)
                .set({
                    enabled: section.enabled,
                    sort: section.sort,
                })
                .commit()
        );

        await Promise.all(updatePromises);

        revalidatePath("/[locale]", "page");
        revalidatePath(`/${locale || "en"}`, "page");
        revalidatePath("/en", "page");
        revalidatePath("/fa", "page");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Update sections error:", error);
        return NextResponse.json({ error: "Failed to update sections" }, { status: 500 });
    }
}