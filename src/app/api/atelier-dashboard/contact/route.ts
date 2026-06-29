import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/api-auth";
import { logError } from "@/lib/logger";

const DIRECTUS_URL = process.env.DIRECTUS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://127.0.0.1:8055";
const DIRECTUS_TOKEN = process.env.DIRECTUS_STATIC_TOKEN || process.env.DIRECTUS_ADMIN_TOKEN;

function directusHeaders(): Record<string, string> {
    return {
        "Content-Type": "application/json",
        ...(DIRECTUS_TOKEN ? { Authorization: `Bearer ${DIRECTUS_TOKEN}` } : {}),
    };
}

export async function GET() {
    const authError = await requireAdminAuth();

    if (authError) {
        return authError;
    }

    try {
        const res = await fetch(`${DIRECTUS_URL}/items/messages?sort=-date_created`, {
            headers: directusHeaders(),
            cache: "no-store",
        });
        const json = await res.json();

        return NextResponse.json(json.data || []);
    } catch (error) {
        logError("contact GET", error);
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, subject, message, honeypot, timeSpent } = body;

        if (honeypot) {
            return NextResponse.json({ error: "Spam detected" }, { status: 400 });
        }

        if (!timeSpent || Number.parseInt(String(timeSpent), 10) < 4) {
            return NextResponse.json({ error: "Too fast" }, { status: 400 });
        }

        const res = await fetch(`${DIRECTUS_URL}/items/messages`, {
            method: "POST",
            headers: directusHeaders(),
            body: JSON.stringify({ name, email, phone, subject, message }),
        });

        if (!res.ok) {
            throw new Error("Failed to save to Directus");
        }

        return NextResponse.json({ message: "Success" });
    } catch (error) {
        logError("contact POST", error);
        return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }
}
