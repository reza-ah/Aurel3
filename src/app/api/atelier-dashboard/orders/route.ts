import { NextRequest, NextResponse } from "next/server";
import { client, writeClient } from "@/lib/sanity";
import { requireAdminAuth } from "@/lib/api-auth";

/* =========================
   GET - لیست سفارش‌ها (فقط ادمین)
========================= */
export async function GET() {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    try {
        const orders = await client.fetch(
            `*[_type == "order"] | order(date_created desc) {
                _id,
                name,
                email,
                phone,
                message,
                files,
                status,
                date_created
            }`
        );

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Get orders error:", error);
        return NextResponse.json([], { status: 200 });
    }
}

/* =========================
   POST - ثبت سفارش جدید (عمومی - بدون auth)
   ✅ با honeypot و timeSpent برای anti-spam
========================= */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // ✅ Anti-spam: honeypot
        if (body.honeypot) {
            return NextResponse.json(
                { success: false, error: "Spam detected" },
                { status: 400 }
            );
        }

        // ✅ Anti-spam: timeSpent (حداقل ۴ ثانیه)
        const timeSpent = Number.parseInt(String(body.timeSpent), 10);
        if (!timeSpent || timeSpent < 4) {
            return NextResponse.json(
                { success: false, error: "Too fast" },
                { status: 400 }
            );
        }

        // ✅ Validation
        if (!body.full_name || !body.email || !body.details) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 }
            );
        }

        // ✅ ایجاد سفارش در Sanity
        const order = await writeClient.create({
            _type: "order",
            name: body.full_name,
            email: body.email,
            phone: body.phone || "",
            message: body.details,
            files: body.files || [],
            status: "new",
            date_created: new Date().toISOString(),
        });

        // ✅ کد پیگیری (۸ کاراکتر آخر _id)
        const tracking_code = order._id.slice(-8);

        return NextResponse.json({
            success: true,
            data: order,
            tracking_code,
        });
    } catch (error) {
        console.error("Create order error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create order" },
            { status: 500 }
        );
    }
}

/* =========================
   PATCH - تغییر وضعیت سفارش (فقط ادمین)
========================= */
export async function PATCH(request: NextRequest) {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    try {
        const body = await request.json();

        if (!body._id || !body.status) {
            return NextResponse.json(
                { success: false, error: "Missing _id or status" },
                { status: 400 }
            );
        }

        await writeClient
            .patch(body._id)
            .set({ status: body.status })
            .commit();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Update order error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update order" },
            { status: 500 }
        );
    }
}

/* =========================
   DELETE - حذف سفارش (فقط ادمین)
========================= */
export async function DELETE(request: NextRequest) {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    try {
        const id = request.nextUrl.searchParams.get("id");
        if (!id) {
            return NextResponse.json(
                { success: false, error: "Missing id" },
                { status: 400 }
            );
        }

        await writeClient.delete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete order error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete order" },
            { status: 500 }
        );
    }
}