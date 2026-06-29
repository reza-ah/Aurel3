import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const formData = await req.formData();

    // ارسال فایل به دایرکتوس
    const res = await fetch(`${process.env.DIRECTUS_URL}/files`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.DIRECTUS_ADMIN_TOKEN}` },
        body: formData,
    });

    const result = await res.json();
    // دایرکتوس id فایل آپلود شده را برمی‌گرداند
    return NextResponse.json(result);
}

