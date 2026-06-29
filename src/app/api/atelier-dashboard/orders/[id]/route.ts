import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/api-auth";

type DirectusFile = {
    id?: string;
    filename_download?: string;
    type?: string;
    filesize?: number;
    width?: number;
    height?: number;
};

type OrderFile = DirectusFile & {
    directus_files_id?: DirectusFile;
};

const DIRECTUS_URL = process.env.DIRECTUS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL;
const DIRECTUS_TOKEN =
    process.env.DIRECTUS_STATIC_TOKEN ||
    process.env.DIRECTUS_ADMIN_TOKEN ||
    process.env.DIRECTUS_TOKEN;

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const authError = await requireAdminAuth();

    if (authError) {
        return authError;
    }

    try {
        const { id } = await context.params;
        const res = await fetch(`${DIRECTUS_URL}/items/orders/${id}?fields=*.*`, {
            headers: {
                "Content-Type": "application/json",
                ...(DIRECTUS_TOKEN ? { Authorization: `Bearer ${DIRECTUS_TOKEN}` } : {}),
            },
            cache: "no-store",
        });
        const json = await res.json();

        if (!res.ok) {
            return NextResponse.json(
                { error: "Failed to fetch order", details: json },
                { status: res.status }
            );
        }

        const order = json.data;
        const files = Array.isArray(order.files)
            ? order.files
                .filter((file: any) => file.directus_files_id) // اطمینان از وجود ID
                .map((file: any, index: number) => {
                    const fileId = file.directus_files_id; // این اکنون مستقیماً رشته ID است

                    return {
                        id: fileId,
                        filename_download: `file-${index + 1}`, // نام پیش‌فرض چون نام واقعی نداریم
                        url: `https://aureldesign.ir/cms-assets/assets/${fileId}`,
                    };
                })
            : [];

        return NextResponse.json({ ...order, files });
    } catch (error) {
        console.error("ORDER DETAILS ERROR:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
