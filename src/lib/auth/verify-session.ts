import { SignJWT, jwtVerify } from "jose";

// ❌ حذف fallback - crash کن اگه تنظیم نشده
const adminSecret = process.env.ADMIN_SECRET;
if (!adminSecret) {
    throw new Error("ADMIN_SECRET environment variable is not set");
}

const secret = new TextEncoder().encode(adminSecret);

/* =========================
ACCESS TOKEN (1 ساعت)
========================= */
export async function createAdminToken() {
    return await new SignJWT({ role: "admin", type: "access" })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(secret);
}

/* =========================
REFRESH TOKEN (7 روز)
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