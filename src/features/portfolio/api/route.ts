import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

const DIRECTUS_URL = process.env.DIRECTUS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://127.0.0.1:8055";
const DIRECTUS_TOKEN =
    process.env.DIRECTUS_STATIC_TOKEN;

export async function GET(request: NextRequest) {
    const locale =
        request.nextUrl.searchParams.get("locale") || "en";

    try {
        const res = await fetch(
            `${DIRECTUS_URL}/items/homepage_sections?filter[locale][_eq]=${locale}&sort=sort`,
            {
                headers: {
                    Authorization: `Bearer ${DIRECTUS_TOKEN}`,
                },
                cache: "no-store",
            }
        );

        const text = await res.text();

        let json: any = {};
        try {
            json = text ? JSON.parse(text) : {};
        } catch {
            console.error("Invalid JSON from Directus:", text);
            return NextResponse.json([]);
        }

        console.log("Directus homepage sections:", json);

        if (!json || !Array.isArray(json.data)) {
            return NextResponse.json([]);
        }

        return NextResponse.json(json.data);
    } catch (error) {
        console.error("Homepage sections error:", error);

        return NextResponse.json([], {
            status: 200,
        });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();

        const { sections, locale } = body;

        if (!Array.isArray(sections)) {
            return NextResponse.json(
                { error: "Invalid sections" },
                { status: 400 }
            );
        }

        // Update all sections
        const updatePromises = sections.map(section =>
            fetch(
                `${DIRECTUS_URL}/items/homepage_sections/${section.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${DIRECTUS_TOKEN}`,
                    },
                    body: JSON.stringify({
                        enabled: section.enabled,
                        sort: section.sort,
                    }),
                }
            )
        );

        await Promise.all(updatePromises);

        // Revalidate homepage for all locales
        revalidatePath("/[locale]", "page");
        revalidatePath(`/${locale || "en"}`, "page");
        revalidatePath("/en", "page");
        revalidatePath("/fa", "page");

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.error("Update sections error:", error);

        return NextResponse.json(
            {
                error: "Failed to update sections",
            },
            {
                status: 500,
            }
        );
    }
}

