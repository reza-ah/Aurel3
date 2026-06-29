import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const DIRECTUS_URL =
    process.env.DIRECTUS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL;

const DIRECTUS_ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

// GET - دریافت یک پورتفولیو
export async function GET(request: Request, context: any) {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get("admin_auth")?.value;

        if (!adminToken) {
            return NextResponse.json(
                { error: "Unauthorized - No admin token" },
                { status: 401 }
            );
        }

        if (!DIRECTUS_ADMIN_TOKEN) {
            console.error("DIRECTUS_ADMIN_TOKEN is not set");
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 }
            );
        }

        const { id } = context.params;

        const res = await fetch(
            `${DIRECTUS_URL}/items/portfolio/${id}?fields=*,gallery.directus_files_id.*`,
            {
                headers: {
                    Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
                },
                cache: "no-store",
            }
        );

        if (!res.ok) {
            const errorText = await res.text();
            return NextResponse.json(
                { error: "Failed to fetch portfolio from Directus" },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// PATCH - آپدیت پورتفولیو
export async function PATCH(request: Request, context: any) {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get("admin_auth")?.value;

        if (!adminToken) {
            return NextResponse.json(
                { error: "Unauthorized - No admin token" },
                { status: 401 }
            );
        }

        if (!DIRECTUS_ADMIN_TOKEN) {
            console.error("DIRECTUS_ADMIN_TOKEN is not set");
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 }
            );
        }

        const { id } = context.params;

        const body = await request.json();

        const updateData: any = {
            title_en: body.title_en,
            title_fa: body.title_fa,
            slug: body.slug,
            cover_image: body.cover_image,
        };

        if (body.status) {
            updateData.status = body.status;
        }

        if (body.gallery && Array.isArray(body.gallery)) {
            updateData.gallery = body.gallery.map((fileId: string) => ({
                directus_files_id: fileId,
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

        if (!res.ok) {
            const errorText = await res.text();
            return NextResponse.json(
                {
                    error: "Failed to update portfolio in Directus",
                    details: errorText,
                },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE - حذف پورتفولیو
export async function DELETE(request: Request, context: any) {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get("admin_auth")?.value;

        if (!adminToken) {
            return NextResponse.json(
                { error: "Unauthorized - No admin token" },
                { status: 401 }
            );
        }

        if (!DIRECTUS_ADMIN_TOKEN) {
            console.error("DIRECTUS_ADMIN_TOKEN is not set");
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 }
            );
        }

        const { id } = context.params;

        const res = await fetch(
            `${DIRECTUS_URL}/items/portfolio/${id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
                },
            }
        );

        if (!res.ok) {
            const errorText = await res.text();
            return NextResponse.json(
                { error: "Failed to delete portfolio from Directus" },
                { status: res.status }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}