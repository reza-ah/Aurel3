import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/lib/sanity";

// ⚠️ TODO: Rate limiter با new Map در Vercel Serverless کار نمی‌کند
// برای production، از Upstash Redis یا Vercel KV استفاده شود
// const uploadCounts = new Map<string, { count: number; resetAt: number }>();

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