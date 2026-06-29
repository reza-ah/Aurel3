import { NextResponse } from "next/server";

const DIRECTUS_URL = process.env.DIRECTUS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://127.0.0.1:8055";

/* ---------------- GET ---------------- */

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const locale = searchParams.get("locale") || "en";

        const res = await fetch(
            `${DIRECTUS_URL}/items/faq?filter[locale][_eq]=${locale}&filter[enabled][_eq]=true&sort=sort`,
            { cache: "no-store" }
        );

        if (!res.ok) {
            return NextResponse.json([]);
        }

        const json = await res.json();

        return NextResponse.json(json?.data ?? []);
    } catch (error) {
        console.error("FAQ GET error:", error);
        return NextResponse.json([]);
    }
}

/* ---------------- POST ---------------- */

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const res = await fetch(`${DIRECTUS_URL}/items/faq`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            return NextResponse.json({ error: true });
        }

        const json = await res.json();

        return NextResponse.json(json?.data ?? null);
    } catch (error) {
        console.error("FAQ POST error:", error);
        return NextResponse.json({ error: true });
    }
}

/* ---------------- PATCH ---------------- */

export async function PATCH(req: Request) {
    try {
        const body = await req.json();

        const res = await fetch(`${DIRECTUS_URL}/items/faq/${body.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            return NextResponse.json({ error: true });
        }

        const json = await res.json();

        return NextResponse.json(json?.data ?? null);
    } catch (error) {
        console.error("FAQ PATCH error:", error);
        return NextResponse.json({ error: true });
    }
}

/* ---------------- DELETE ---------------- */

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: true });
        }

        await fetch(`${DIRECTUS_URL}/items/faq/${id}`, {
            method: "DELETE",
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("FAQ DELETE error:", error);
        return NextResponse.json({ error: true });
    }
}

