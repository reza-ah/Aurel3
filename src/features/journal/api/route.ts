import { NextRequest, NextResponse } from "next/server";
import { client, writeClient } from "@/lib/sanity";
import { requireAdminAuth } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    const locale = request.nextUrl.searchParams.get("locale") || "en";

    try {
        const faqs = await client.fetch(
            `*[_type == "faq" && locale == $locale] | order(sort asc) {
                _id,
                question_en,
                question_fa,
                answer_en,
                answer_fa,
                sort,
                enabled
            }`,
            { locale }
        );

        return NextResponse.json(faqs);
    } catch (error) {
        console.error("FAQ error:", error);
        return NextResponse.json([], { status: 200 });
    }
}

export async function POST(request: NextRequest) {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    try {
        const body = await request.json();

        const result = await writeClient.create({
            _type: "faq",
            question_en: body.question_en || "",
            question_fa: body.question_fa || "",
            answer_en: body.answer_en || "",
            answer_fa: body.answer_fa || "",
            sort: body.sort || 0,
            enabled: body.enabled ?? true,
            locale: body.locale || "en",
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("FAQ POST error:", error);
        return NextResponse.json({ error: true }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    try {
        const body = await request.json();

        await writeClient
            .patch(body._id)
            .set({
                question_en: body.question_en,
                question_fa: body.question_fa,
                answer_en: body.answer_en,
                answer_fa: body.answer_fa,
                sort: body.sort,
                enabled: body.enabled,
            })
            .commit();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("FAQ PATCH error:", error);
        return NextResponse.json({ error: true }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    try {
        const id = request.nextUrl.searchParams.get("id");
        if (!id) {
            return NextResponse.json({ error: true }, { status: 400 });
        }

        await writeClient.delete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("FAQ DELETE error:", error);
        return NextResponse.json({ error: true }, { status: 500 });
    }
}