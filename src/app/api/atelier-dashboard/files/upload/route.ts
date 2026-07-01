import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/lib/sanity";

// ✅ Rate limiter ساده برای آپلود عمومی
const uploadCounts = new Map<string, { count: number; resetAt: number }>();
const MAX_UPLOADS_PER_HOUR = 10;

// ✅ لیست پسوندهای مجاز (برای فایل‌های CAD که MIME درست ندارند)
const ALLOWED_EXTENSIONS = [
    ".png", ".jpg", ".jpeg", ".webp",  // تصاویر
    ".pdf",                             // اسناد
    ".3dm",                             // Rhino CAD
    ".stl",                             // 3D Printing
    ".zip",                             // آرشیو
];

// ✅ MIME types مجاز (برای فایل‌های معمولی)
const ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
    "application/zip",
    "application/x-zip-compressed",
    "application/octet-stream",  // برای فایل‌های CAD
    "model/stl",                 // STL files
    "",                          // برخی مرورگرها MIME خالی می‌فرستند
];

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

        // ✅ محدودیت حجم: 20MB (برای فایل‌های CAD بزرگ)
        if (file.size > 20 * 1024 * 1024) {
            return NextResponse.json(
                { error: "File too large. Maximum size is 20MB." },
                { status: 400 }
            );
        }

        // ✅ بررسی پسوند فایل (مهم‌تر از MIME type برای فایل‌های CAD)
        const fileName = (file as File).name.toLowerCase();
        const fileExtension = fileName.slice(fileName.lastIndexOf("."));

        if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
            return NextResponse.json(
                {
                    error: `Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`
                },
                { status: 400 }
            );
        }

        // ✅ بررسی MIME type (اگر وجود دارد)
        if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
            // اگر پسوند معتبر است ولی MIME ناشناخته، اجازه بده
            // (چون مرورگرها برای CAD MIME درست نمی‌فرستند)
            if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
                return NextResponse.json(
                    { error: "Invalid file type." },
                    { status: 400 }
                );
            }
        }

        // ✅ آپلود به Sanity
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // ✅ تعیین نوع asset بر اساس پسوند
        const assetType = fileExtension === ".pdf" || fileExtension === ".zip"
            ? "file"
            : "image";

        const asset = await writeClient.assets.upload(assetType, buffer, {
            filename: (file as File).name,
            contentType: file.type || "application/octet-stream",
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