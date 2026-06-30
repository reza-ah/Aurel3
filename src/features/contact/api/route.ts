import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/lib/sanity";
import { requireAdminAuth } from "@/lib/api-auth";

export async function POST(request: NextRequest) {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file || !(file instanceof Blob)) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Upload to Sanity
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const asset = await writeClient.assets.upload("image", buffer, {
            filename: file.name,
            contentType: file.type,
        });

        return NextResponse.json({
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