import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/lib/sanity";

const uploadCounts = new Map<string, { count: number; resetAt: number }>();
const MAX_UPLOADS_PER_HOUR = 10;

const ALLOWED_EXTENSIONS = [
    ".png", ".jpg", ".jpeg", ".webp",
    ".pdf",
    ".3dm",
    ".stl",
    ".zip",
];

const ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
    "application/zip",
    "application/x-zip-compressed",
    "application/octet-stream",
    "model/stl",
    "",
];

export async function POST(request: NextRequest) {
    try {
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";

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

        if (file.size > 20 * 1024 * 1024) {
            return NextResponse.json(
                { error: "File too large. Maximum size is 20MB." },
                { status: 400 }
            );
        }

        const fileName = (file as File).name.toLowerCase();
        const fileExtension = fileName.slice(fileName.lastIndexOf("."));

        if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
            return NextResponse.json(
                { error: `Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}` },
                { status: 400 }
            );
        }

        if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
            if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
                return NextResponse.json(
                    { error: "Invalid file type." },
                    { status: 400 }
                );
            }
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // ✅ تشخیص نوع asset بر اساس context
        // اگر در URL ?type=image بود، image upload کن
        const uploadType = request.nextUrl.searchParams.get("type") || "file";
        const isImage = uploadType === "image" || [".png", ".jpg", ".jpeg", ".webp"].includes(fileExtension);

        const asset = await writeClient.assets.upload(isImage ? "image" : "file", buffer, {
            filename: (file as File).name,
            contentType: file.type || "application/octet-stream",
        });

        return NextResponse.json({
            success: true,
            data: {
                _id: asset._id,
                url: asset.url,
                type: isImage ? "image" : "file",
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