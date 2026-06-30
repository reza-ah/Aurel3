import { NextRequest, NextResponse } from "next/server";
import { client, writeClient } from "@/lib/sanity";
import { requireAdminAuth } from "@/lib/api-auth";

export async function GET() {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    try {
        const messages = await client.fetch(
            `*[_type == "contactMessage"] | order(date_created desc) {
                _id,
                name,
                email,
                phone,
                subject,
                message,
                date_created
            }`
        );

        return NextResponse.json(messages);
    } catch (error) {
        console.error("Contact messages error:", error);
        return NextResponse.json([], { status: 200 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, phone, subject, message, honeypot, timeSpent } = body;

        if (honeypot) {
            return NextResponse.json({ error: "Spam detected" }, { status: 400 });
        }

        if (!timeSpent || Number.parseInt(String(timeSpent), 10) < 4) {
            return NextResponse.json({ error: "Too fast" }, { status: 400 });
        }

        if (!name || !email || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await writeClient.create({
            _type: "contactMessage",
            name,
            email,
            phone: phone || "",
            subject: subject || "",
            message,
            date_created: new Date().toISOString(),
        });

        return NextResponse.json({ message: "Success" });
    } catch (error) {
        console.error("Contact POST error:", error);
        return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }
}