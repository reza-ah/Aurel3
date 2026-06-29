import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { client, writeClient } from "@/lib/sanity";

export async function GET(request: NextRequest) {
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

        console.log("Sanity homepage sections:", sections);
        return NextResponse.json(sections);
    } catch (error) {
        console.error("Homepage sections error:", error);
        return NextResponse.json([], { status: 200 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { sections, locale } = body;

        if (!Array.isArray(sections)) {
            return NextResponse.json({ error: "Invalid sections" }, { status: 400 });
        }

        // Update all sections in Sanity
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

        // Revalidate homepage
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