import { NextResponse } from "next/server";
import { createAdminToken, createRefreshToken } from "@/lib/auth/verify-session";
import bcrypt from "bcryptjs";

// ⚠️ TODO: Rate limiter با new Map در Vercel Serverless کار نمی‌کند
// برای production، از Upstash Redis یا Vercel KV استفاده شود
// const loginAttempts = new Map<string, { count: number; blockedUntil?: number }>();

export async function POST(request: Request) {
    try {
        const { password } = await request.json();
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!adminPasswordHash) {
            console.error("ADMIN_PASSWORD_HASH environment variable is not set");
            return NextResponse.json({ success: false }, { status: 500 });
        }

        const isValid = await bcrypt.compare(password, adminPasswordHash);

        if (!isValid) {
            return NextResponse.json(
                { success: false, message: "Incorrect password" },
                { status: 401 }
            );
        }

        const accessToken = await createAdminToken();
        const refreshToken = await createRefreshToken();
        const response = NextResponse.json({ success: true });

        response.cookies.set("admin_auth", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60,
        });

        response.cookies.set("admin_refresh", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}