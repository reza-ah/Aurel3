import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { client, writeClient } from "@/lib/sanity";

export async function GET() {
    try {
        const posts = await client.fetch(
            `*[_type == "journal"] | order(date_created desc) {
                _id,
                slug,
                title_en,
                title_fa,
                excerpt_en,
                excerpt_fa,
                content_en,
                content_fa,
                cover_image,
                status,
                date_created
            }`
        );

        return NextResponse.json(posts);
    } catch (error) {
        console.error("Journal error:", error);
        return NextResponse.json([], { status: 200 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { post } = body;

        if (!post || !post._id) {
            return NextResponse.json({ error: "Invalid post" }, { status: 400 });
        }

        await writeClient
            .patch(post._id)
            .set({
                title_en: post.title_en,
                title_fa: post.title_fa,
                excerpt_en: post.excerpt_en,
                excerpt_fa: post.excerpt_fa,
                content_en: post.content_en,
                content_fa: post.content_fa,
                status: post.status,
            })
            .commit();

        revalidatePath("/[locale]/journal", "page");
        revalidatePath("/[locale]/journal/[slug]", "page");
        revalidatePath("/en/journal", "page");
        revalidatePath("/fa/journal", "page");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Update journal error:", error);
        return NextResponse.json({ error: "Failed to update journal" }, { status: 500 });
    }
}