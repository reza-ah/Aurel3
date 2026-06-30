import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth/verify-session";

export async function requireAdminAuth(): Promise<NextResponse | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_auth")?.value;

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ❌ حذف legacy cookie check
    // if(token === "authenticated-admin") {
    //     return null;
    // }

    const payload = await verifyAdminToken(token);
    if (!payload) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return null;
}