import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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

export async function PATCH(request: NextRequest) {
    const authError = await requireAdminAuth();
    if (authError) return authError;
    try {
        const body = await request.json();
        const { faqs } = body;

        if (!Array.isArray(faqs)) {
            return NextResponse.json({ error: "Invalid faqs" }, { status: 400 });
        }

        const updatePromises = faqs.map((faq) =>
            writeClient
                .patch(faq._id)
                .set({
                    question_en: faq.question_en,
                    question_fa: faq.question_fa,
                    answer_en: faq.answer_en,
                    answer_fa: faq.answer_fa,
                    sort: faq.sort,
                    enabled: faq.enabled,
                })
                .commit()
        );

        await Promise.all(updatePromises);

        revalidatePath("/[locale]/faq", "page");
        revalidatePath("/en/faq", "page");
        revalidatePath("/fa/faq", "page");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Update FAQ error:", error);
        return NextResponse.json({ error: "Failed to update FAQ" }, { status: 500 });
    }
}