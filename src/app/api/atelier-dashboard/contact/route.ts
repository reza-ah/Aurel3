import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/sanity";

export async function GET() {
    try {
        const messages = await client.fetch(
            `*[_type == "contactMessage"] | order(date_created desc) {
                _id,
                name,
                email,
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