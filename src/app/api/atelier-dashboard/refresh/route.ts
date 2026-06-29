import { NextResponse } from "next/server";
import { verifyRefreshToken, createAdminToken } from "@/lib/auth/verify-session";

export async function POST(request: Request) {
    const refreshToken = request.cookies.get("admin_refresh")?.value;

    if (!refreshToken) {
        return NextResponse.json({ success: false }, { status: 401 });
    }

    const payload = await verifyRefreshToken(refreshToken);
    if (!payload) {
        return NextResponse.json({ success: false }, { status: 401 });
    }

    const newAccessToken = await createAdminToken();
    const response = NextResponse.json({ success: true });

    response.cookies.set("admin_auth", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60,
    });

    return response;
}