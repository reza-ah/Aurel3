import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const DIRECTUS_URL =
    process.env.DIRECTUS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL;

const DIRECTUS_ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

// GET
export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get("admin_auth")?.value;

        if (!adminToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!DIRECTUS_ADMIN_TOKEN) {
            return NextResponse.json(
                { error: "Server config error" },
                { status: 500 }
            );
        }

        const { id } = await context.params;

        const res = await fetch(
            `${DIRECTUS_URL}/items/portfolio/${id}?fields=*,gallery.directus_files_id.*`,
            {
                headers: {
                    Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
                },
                cache: "no-store",
            }
        );

        const data = await res.json();
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// PATCH
export async function PATCH(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get("admin_auth")?.value;

        if (!adminToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await context.params;
        const body = await request.json();

        const updateData: any = {
            title_en: body.title_en,
            title_fa: body.title_fa,
            slug: body.slug,
            cover_image: body.cover_image,
        };

        if (body.status) updateData.status = body.status;

        if (Array.isArray(body.gallery)) {
            updateData.gallery = body.gallery.map((id: string) => ({
                directus_files_id: id,
            }));
        }

        const res = await fetch(
            `${DIRECTUS_URL}/items/portfolio/${id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
                },
                body: JSON.stringify(updateData),
            }
        );

        const data = await res.json();
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE
export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get("admin_auth")?.value;

        if (!adminToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await context.params;

        const res = await fetch(
            `${DIRECTUS_URL}/items/portfolio/${id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
                },
            }
        );

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}