import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/lib/sanity";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const phone = formData.get("phone") as string;
        const subject = formData.get("subject") as string;
        const message = formData.get("message") as string;

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
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

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Contact form error:", error);
        return NextResponse.json(
            { error: "Failed to submit message" },
            { status: 500 }
        );
    }
}