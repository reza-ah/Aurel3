// src/app/api/sanity-webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";

const WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET!;
const INDEXNOW_KEY = "1632c73e94a848f0b0fc8c20f04e851d";
const HOST = "www.aureldesign.ir";
const BASE_URL = `https://${HOST}`;

// نگاشت نوع سند Sanity به مسیر صفحه در سایت
const TYPE_TO_PATH: Record<string, string> = {
    portfolio: "portfolio",
    journal: "journal",
    products: "products",
};

export async function POST(request: NextRequest) {
    const body = await request.text();
    const signature = request.headers.get(SIGNATURE_HEADER_NAME);

    if (!signature || !(await isValidSignature(body, signature, WEBHOOK_SECRET))) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(body);
    const { _type, slug } = payload;

    const path = TYPE_TO_PATH[_type];
    if (!path || !slug) {
        return NextResponse.json({ skipped: true });
    }

    const urls = [
        `${BASE_URL}/en/${path}/${slug}`,
        `${BASE_URL}/fa/${path}/${slug}`,
    ];

    try {
        const res = await fetch("https://api.indexnow.org/indexnow", {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify({
                host: HOST,
                key: INDEXNOW_KEY,
                keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
                urlList: urls,
            }),
        });

        return NextResponse.json({ ok: res.ok, urls }, { status: res.status });
    } catch {
        return NextResponse.json({ error: "Failed to submit to IndexNow" }, { status: 500 });
    }
}