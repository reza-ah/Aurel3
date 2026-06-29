import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/api-auth";

export async function GET() {
    const authError = await requireAdminAuth();

    if (authError) {
        return authError;
    }

    return NextResponse.json({ authenticated: true });
}
