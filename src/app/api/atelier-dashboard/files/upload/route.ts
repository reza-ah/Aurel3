import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/lib/sanity";

// ✅ Rate limiter ساده برای آپلود عمومی
const uploadCounts = new Map<string, { count: number; resetAt: number }>();
const MAX_UPLOADS_PER_HOUR = 10;

export async function POST(request: NextRequest) {
    try {
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";

        // ✅ Rate limiting
        const now = Date.now();
        const attempt = uploadCounts.get(ip);

        if (attempt && attempt.resetAt > now) {
            if (attempt.count >= MAX_UPLOADS_PER_HOUR) {
                return NextResponse.json(
                    { error: "Too many uploads. Please try again later." },
                    { status: 429 }
                );
            }
            attempt.count += 1;
        } else {
            uploadCounts.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
        }

        const formData = await request.formData();
        const file = formData.get("file");

        if (!file || !(file instanceof Blob)) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        // ✅ محدودیت حجم: 10MB
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json(
                { error: "File too large. Maximum size is 10MB." },
                { status: 400 }
            );
        }

        // ✅ محدودیت نوع فایل
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "application/pdf",
        ];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type. Only JPEG, PNG, WebP, and PDF are allowed." },
                { status: 400 }
            );
        }

        // ✅ آپلود به Sanity
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const asset = await writeClient.assets.upload("image", buffer, {
            filename: file.name,
            contentType: file.type,
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
        return NextResponse.json(
            { error: "Upload failed" },
            { status: 500 }
        );
    }
}