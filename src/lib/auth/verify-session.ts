import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
    process.env.ADMIN_SECRET || "fallback-secret-change-me"
);

// Access Token (1 hour)
export async function createAdminToken() {
    return await new SignJWT({ role: "admin", type: "access" })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(secret);
}

// Refresh Token (7 days)
export async function createRefreshToken() {
    return await new SignJWT({ role: "admin", type: "refresh" })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(secret);
}

// Verify Access Token
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

// Verify Refresh Token
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