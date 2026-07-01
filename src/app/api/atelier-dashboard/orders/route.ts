import { NextRequest, NextResponse } from "next/server";
import { client, writeClient } from "@/lib/sanity";
import { requireAdminAuth } from "@/lib/api-auth";

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
                service,
                jewelry_type,
                files,
                status,
                tracking_code,
                date_created
            }`
        );

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Get orders error:", error);
        return NextResponse.json([], { status: 200 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        console.log("Order payload received:", JSON.stringify(body, null, 2));

        // ✅ Anti-spam: honeypot
        if (body.honeypot) {
            console.error("Spam detected - honeypot filled");
            return NextResponse.json(
                { success: false, error: "Spam detected" },
                { status: 400 }
            );
        }

        // ✅ Anti-spam: timeSpent (حداقل ۴ ثانیه)
        const timeSpent = Number.parseInt(String(body.timeSpent), 10);
        console.log("Parsed timeSpent:", timeSpent);

        if (isNaN(timeSpent) || timeSpent < 4) {
            console.error("Too fast - timeSpent:", timeSpent);
            return NextResponse.json(
                { success: false, error: "Too fast", receivedTimeSpent: body.timeSpent, parsedTimeSpent: timeSpent },
                { status: 400 }
            );
        }

        // Validation
        if (!body.full_name || !body.email || !body.details) {
            console.error("Missing fields:", {
                full_name: !!body.full_name,
                email: !!body.email,
                details: !!body.details,
            });
            return NextResponse.json(
                {
                    success: false,
                    error: "Missing required fields",
                    missing: {
                        full_name: !body.full_name,
                        email: !body.email,
                        details: !body.details,
                    }
                },
                { status: 400 }
            );
        }

        // ✅ ایجاد سفارش در Sanity
        const tracking_code = `AUR-${Date.now().toString(36).toUpperCase()}`;

        const order = await writeClient.create({
            _type: "order",
            name: body.full_name,
            email: body.email,
            phone: body.phone || "",
            message: body.details,
            service: body.service || "",
            jewelry_type: body.jewelry_type || "",
            files: Array.isArray(body.files)
                ? body.files.map((file: any, index: number) => ({
                    _key: `file-${Date.now()}-${index}`,
                    _type: 'file',
                    asset: {
                        _type: 'reference',
                        _ref: typeof file === 'string' ? file : file._ref || file,
                    },
                }))
                : [],
            status: "new",
            tracking_code: tracking_code,
            date_created: new Date().toISOString(),
        });

        console.log("Order created successfully:", order._id);

        return NextResponse.json({
            success: true,
            data: order,
            tracking_code,
        });
    } catch (error) {
        console.error("Create order error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create order", details: String(error) },
            { status: 500 }
        );
    }
}

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