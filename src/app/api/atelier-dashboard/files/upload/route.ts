import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/lib/sanity";
import { requireAdminAuth } from "@/lib/api-auth";

const uploadCounts = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: NextRequest) {
    const authError = await requireAdminAuth();
    if (authError) {
        return authError;
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
    const now = Date.now();
    const limit = uploadCounts.get(ip);

    if (limit && limit.resetAt > now && limit.count >= 10) {
        return NextResponse.json({ error: "Too many uploads" }, { status: 429 });
    }

    if (!limit || limit.resetAt <= now) {
        uploadCounts.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 });
    } else {
        limit.count++;
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file || !(file instanceof Blob)) {
            return NextResponse.json({ error: "No file field in form-data" }, { status: 400 });
        }

        // Upload to Sanity
        const sanityAsset = await writeClient.assets.upload('image', file.stream(), {
            filename: file.name,
        });

        return NextResponse.json({
            data: {
                _id: sanityAsset._id,
                url: sanityAsset.url,
                metadata: sanityAsset.metadata,
            }
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }
}