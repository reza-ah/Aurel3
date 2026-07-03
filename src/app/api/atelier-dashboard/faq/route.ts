import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { client, writeClient } from "@/lib/sanity";
import { requireAdminAuth } from "@/lib/api-auth";

type FAQItem = {
    _id: string;
    question_en?: string;
    question_fa?: string;
    answer_en?: string;
    answer_fa?: string;
    sort?: number;
    enabled?: boolean;
    locale?: string;
};

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const locale = searchParams.get("locale") || "en";

        // ❌ حذف: console.log locale

        const faqs = await client.fetch(
            `*[_type == "faq" && enabled == true] | order(sort asc) {
                _id,
                question_en,
                question_fa,
                answer_en,
                answer_fa,
                sort,
                enabled,
                locale
            }`
        );

        // ❌ حذف: console.log total FAQs

        const filtered = faqs.filter((f: FAQItem) => {
            if (!f.locale || f.locale === locale) {
                return true;
            }
            return false;
        });

        // ❌ حذف: console.log filtered FAQs

        return NextResponse.json(filtered);
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
            question_en: body.question_en || body.question || "",
            question_fa: body.question_fa || "",
            answer_en: body.answer_en || body.answer || "",
            answer_fa: body.answer_fa || "",
            sort: body.sort || 999,
            enabled: body.enabled !== false,
            locale: body.locale || "en",
            date_created: new Date().toISOString(),
        });

        revalidatePath("/[locale]/faq", "page");
        revalidatePath("/en/faq", "page");
        revalidatePath("/fa/faq", "page");

        return NextResponse.json(result);
    } catch (error) {
        console.error("FAQ POST error:", error);
        return NextResponse.json({ error: "Failed to create FAQ" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    try {
        const body = await request.json();

        if (Array.isArray(body.faqs)) {
            const updatePromises = body.faqs.map((faq: FAQItem) =>
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
        } else if (body.id) {
            await writeClient
                .patch(body.id)
                .set({
                    question_en: body.question_en || body.question,
                    question_fa: body.question_fa || "",
                    answer_en: body.answer_en || body.answer,
                    answer_fa: body.answer_fa || "",
                    sort: body.sort,
                    enabled: body.enabled,
                })
                .commit();
        }

        revalidatePath("/[locale]/faq", "page");
        revalidatePath("/en/faq", "page");
        revalidatePath("/fa/faq", "page");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Update FAQ error:", error);
        return NextResponse.json({ error: "Failed to update FAQ" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    try {
        const id = request.nextUrl.searchParams.get("id");
        if (!id) {
            return NextResponse.json({ error: "Missing id" }, { status: 400 });
        }

        await writeClient.delete(id);

        revalidatePath("/[locale]/faq", "page");
        revalidatePath("/en/faq", "page");
        revalidatePath("/fa/faq", "page");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("FAQ DELETE error:", error);
        return NextResponse.json({ error: "Failed to delete FAQ" }, { status: 500 });
    }
}