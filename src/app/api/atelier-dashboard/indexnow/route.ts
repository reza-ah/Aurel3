import { NextRequest, NextResponse } from "next/server";

const INDEXNOW_KEY = "1632c73e94a848f0b0fc8c20f04e851d";
const HOST = "www.aureldesign.ir";

export async function POST(request: NextRequest) {
    try {
        const { urls } = await request.json();

        if (!Array.isArray(urls) || urls.length === 0) {
            return NextResponse.json({ error: "urls array is required" }, { status: 400 });
        }

        const res = await fetch("https://api.indexnow.org/indexnow", {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify({
                host: HOST,
                key: INDEXNOW_KEY,
                keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
                urlList: urls,
            }),
        });

        return NextResponse.json({ ok: res.ok }, { status: res.status });
    } catch {
        return NextResponse.json({ error: "Failed to submit to IndexNow" }, { status: 500 });
    }
}