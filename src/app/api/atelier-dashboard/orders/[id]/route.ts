import { NextRequest, NextResponse } from "next/server";
import { client } from "@/lib/sanity";
import { requireAdminAuth } from "@/lib/api-auth";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authError = await requireAdminAuth();
    if (authError) return authError;

    try {
        const { id } = await params;

        const order = await client.fetch(
            `*[_type == "order" && _id == $id][0] {
                _id,
                name,
                email,
                phone,
                message,
                service,
                jewelry_type,
                files[] {
                    _key,
                    asset->{
                        _id,
                        url,
                        originalFilename,
                        mimeType,
                        size
                    }
                },
                status,
                tracking_code,
                date_created
            }`,
            { id }
        );

        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        // ✅ تبدیل به فرمت مورد انتظار صفحه
        const formattedOrder = {
            id: order._id,
            full_name: order.name,
            email: order.email,
            phone: order.phone,
            service: order.service,
            jewelry_type: order.jewelry_type,  // ✅ اضافه شد
            details: order.message,
            status: order.status,
            created_at: order.date_created,
            tracking_code: order.tracking_code,
            files: order.files?.map((file: any) => ({
                id: file._key || file.asset?._id,
                filename_download: file.asset?.originalFilename || "file",
                type: file.asset?.mimeType || "application/octet-stream",
                filesize: file.asset?.size || 0,
                url: file.asset?.url || "",
            })) || [],
        };

        return NextResponse.json(formattedOrder);
    } catch (error) {
        console.error("Get order error:", error);
        return NextResponse.json(
            { error: "Failed to fetch order" },
            { status: 500 }
        );
    }
}