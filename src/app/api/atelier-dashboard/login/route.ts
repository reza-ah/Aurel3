import { NextResponse } from "next/server";
import { createAdminToken, createRefreshToken } from "@/lib/auth/verify-session";
import bcrypt from "bcryptjs";

const loginAttempts = new Map<string, { count: number; blockedUntil?: number }>();
const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 15 * 60 * 1000;

export async function POST(request: Request) {
    try {
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
        const attempt = loginAttempts.get(ip);

        if (attempt?.blockedUntil && attempt.blockedUntil > Date.now()) {
            const remaining = Math.ceil((attempt.blockedUntil - Date.now()) / 60000);
            return NextResponse.json(
                { success: false, message: `Too many attempts. Try again in ${remaining} minute(s).` },
                { status: 429 }
            );
        }

        const { password } = await request.json();
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!adminPasswordHash) {
            console.error("ADMIN_PASSWORD_HASH environment variable is not set");
            return NextResponse.json({ success: false }, { status: 500 });
        }

        // ✅ مقایسه امن با bcrypt
        const isValid = await bcrypt.compare(password, adminPasswordHash);

        if (!isValid) {
            const current = loginAttempts.get(ip) ?? { count: 0 };
            current.count += 1;
            if (current.count >= MAX_ATTEMPTS) {
                current.blockedUntil = Date.now() + BLOCK_DURATION;
            }
            loginAttempts.set(ip, current);
            return NextResponse.json(
                { success: false, message: "Incorrect password" },
                { status: 401 }
            );
        }

        loginAttempts.delete(ip);

        const accessToken = await createAdminToken();
        const refreshToken = await createRefreshToken();
        const response = NextResponse.json({ success: true });

        // ✅ sameSite: strict
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