import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({
        success: true,
        message: "Logged out",
    });

    // ✅ پاک کردن Access Token با sameSite: strict
    response.cookies.set("admin_auth", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: new Date(0),
    });

    // ✅ پاک کردن Refresh Token با sameSite: strict
    response.cookies.set("admin_refresh", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: new Date(0),
    });

    return response;
}