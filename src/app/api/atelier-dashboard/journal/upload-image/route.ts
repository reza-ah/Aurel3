import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/lib/sanity";
import { requireAdminAuth } from "@/lib/api-auth";

export async function POST(request: NextRequest) {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // آپلود به Sanity
        const asset = await writeClient.assets.upload("image", file, {
            filename: file.name,
        });

        return NextResponse.json({
            success: true,
            data: {
                _id: asset._id,
                url: asset.url,
            },
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}