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

        // ❌ حذف: console.log اطلاعات مشتری

        if (body.honeypot) {
            console.error("Spam detected - honeypot filled");
            return NextResponse.json(
                { success: false, error: "Spam detected" },
                { status: 400 }
            );
        }

        const timeSpent = Number.parseInt(String(body.timeSpent), 10);
        // ❌ حذف: console.log timeSpent

        if (isNaN(timeSpent) || timeSpent < 4) {
            console.error("Too fast submission detected");
            return NextResponse.json(
                { success: false, error: "Too fast" },
                { status: 400 }
            );
        }

        if (!body.full_name || !body.email || !body.details) {
            console.error("Missing required fields in order submission");
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

        const tracking_code = `AUR-${Date.now().toString(36).toUpperCase()}`;

        const filesArray = Array.isArray(body.files)
            ? body.files.map((file: any, index: number) => {
                if (typeof file === 'string') {
                    return {
                        _key: `file-${Date.now()}-${index}`,
                        _type: 'file',
                        asset: {
                            _type: 'reference',
                            _ref: file,
                        },
                    };
                }

                if (file._ref) {
                    return {
                        _key: file._key || `file-${Date.now()}-${index}`,
                        _type: 'file',
                        asset: {
                            _type: 'reference',
                            _ref: file._ref,
                        },
                    };
                }

                if (file.asset) {
                    return {
                        _key: file._key || `file-${Date.now()}-${index}`,
                        _type: 'file',
                        asset: file.asset,
                    };
                }

                return null;
            }).filter(Boolean)
            : [];

        // ❌ حذف: console.log files array

        const order = await writeClient.create({
            _type: "order",
            name: body.full_name,
            email: body.email,
            phone: body.phone || "",
            message: body.details,
            service: body.service || "",
            jewelry_type: body.jewelry_type || "",
            files: filesArray,
            status: "new",
            tracking_code: tracking_code,
            date_created: new Date().toISOString(),
        });

        // ❌ حذف: console.log order created

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