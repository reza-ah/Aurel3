import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
    process.env.ADMIN_SECRET
);

export async function createAdminToken() {
    return await new SignJWT({
        role: "admin",
    })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(secret);
}

export async function verifyAdminToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, secret);

        if (payload.role !== "admin") {
            return null;
        }

        return payload;
    } catch {
        return null;
    }
}

