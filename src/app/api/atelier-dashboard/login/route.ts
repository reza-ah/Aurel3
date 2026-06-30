import { NextResponse } from "next/server";
import { createAdminToken, createRefreshToken } from "@/lib/auth/verify-session";

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
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminPassword) {
            console.error("ADMIN_PASSWORD environment variable is not set");
            return NextResponse.json({ success: false }, { status: 500 });
        }

        if (password !== adminPassword) {
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

        // Access Token (1 hour)
        response.cookies.set("admin_auth", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60, // 1 hour
        });

        // Refresh Token (7 days)
        response.cookies.set("admin_refresh", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return response;
    } catch {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
