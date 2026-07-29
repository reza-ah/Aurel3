import { NextResponse } from "next/server";

export async function GET() {
    return new NextResponse("76220062", {
        status: 200,
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "X-Robots-Tag": "noindex",
        },
    });
}