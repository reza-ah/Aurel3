import { SignJWT, jwtVerify } from "jose";

// Fallback برای زمانی که ADMIN_SECRET تنظیم نشده
const secret = new TextEncoder().encode(
    process.env.ADMIN_SECRET || "fallback-secret-change-me-in-production"
);

/* =========================
ACCESS TOKEN (1 ساعت اعتبار)
========================= */
export async function createAdminToken() {
    return await new SignJWT({ role: "admin", type: "access" })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(secret);
}

/* =========================
REFRESH TOKEN (7 روز اعتبار)
========================= */
export async function createRefreshToken() {
    return await new SignJWT({ role: "admin", type: "refresh" })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(secret);
}

/* =========================
تأیید Access Token
========================= */
export async function verifyAdminToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, secret);
        if (payload.role !== "admin" || payload.type !== "access") {
            return null;
        }
        return payload;
    } catch {
        return null;
    }
}

/* =========================
تأیید Refresh Token
========================= */
export async function verifyRefreshToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, secret);
        if (payload.role !== "admin" || payload.type !== "refresh") {
            return null;
        }
        return payload;
    } catch {
        return null;
    }
}