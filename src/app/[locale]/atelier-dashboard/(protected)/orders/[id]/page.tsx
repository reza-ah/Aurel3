"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Order {
    _id: string;
    name: string;
    email: string;
    phone: string;
    service: string;
    jewelry_type?: string;
    message: string;
    status: string;
    tracking_code?: string;
    date_created: string;
    files?: any[];
}

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;
    const locale = (params.locale as string) || "en";

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        async function fetchOrder() {
            try {
                const res = await fetch("/api/atelier-dashboard/orders", {
                    credentials: "include",
                });
                const data = await res.json();
                const found = data.find((o: Order) => o._id === orderId);
                if (found) {
                    setOrder(found);
                }
            } catch (error) {
                console.error("Failed to load order:", error);
            } finally {
                setLoading(false);
            }
        }

        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    async function updateStatus(newStatus: string) {
        if (!order) return;
        setUpdating(true);
        try {
            await fetch("/api/atelier-dashboard/orders", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    _id: order._id,
                    status: newStatus,
                }),
            });
            setOrder({ ...order, status: newStatus });
        } catch (error) {
            console.error("Failed to update status:", error);
        } finally {
            setUpdating(false);
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-black text-white pt-32 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="animate-pulse text-zinc-500">Loading...</div>
                </div>
            </main>
        );
    }

    if (!order) {
        return (
            <main className="min-h-screen bg-black text-white pt-32 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl font-light mb-4">Order Not Found</h1>
                    <Link
                        href={`/${locale}/atelier-dashboard/orders`}
                        className="text-[#D4AF37] hover:underline"
                    >
                        Back to Orders
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white pt-32 px-6 pb-16">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Link
                    href={`/${locale}/atelier-dashboard/orders`}
                    className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors"
                >
                    ← Back to Orders
                </Link>

                {/* Header */}
                <div className="mb-10">
                    <p className="text-sm tracking-[0.3em] uppercase text-zinc-500 mb-3">
                        Order Details
                    </p>
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-light">#{order.tracking_code || order._id.slice(-8)}</h1>
                        <span className={`px-3 py-1 rounded-full text-xs uppercase tracking-wider ${order.status === 'new' ? 'bg-emerald-500/20 text-emerald-400' :
                            order.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-blue-500/20 text-blue-400'
                            }`}>
                            {order.status}
                        </span>
                    </div>
                </div>

                {/* Order Info */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="border border-zinc-800 rounded-2xl p-6 bg-zinc-950/70">
                        <h2 className="text-lg font-medium mb-4 text-zinc-300">Customer Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-zinc-500 mb-1">Name</p>
                                <p className="text-white">{order.name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500 mb-1">Email</p>
                                <p className="text-white">{order.email}</p>
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500 mb-1">Phone</p>
                                <p className="text-white" dir="ltr">{order.phone}</p>
                            </div>
                            <div>
                                <p className="text-xs text-zinc-500 mb-1">Date</p>
                                <p className="text-white">
                                    {new Date(order.date_created).toLocaleString("fa-IR", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="border border-zinc-800 rounded-2xl p-6 bg-zinc-950/70">
                        <h2 className="text-lg font-medium mb-4 text-zinc-300">Order Details</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-zinc-500 mb-1">Service</p>
                                <p className="text-white">{order.service}</p>
                            </div>
                            {order.jewelry_type && (
                                <div>
                                    <p className="text-xs text-zinc-500 mb-1">Jewelry Type</p>
                                    <p className="text-white">{order.jewelry_type}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-xs text-zinc-500 mb-1">Message</p>
                                <p className="text-white whitespace-pre-wrap">{order.message}</p>
                            </div>
                        </div>
                    </div>

                    {/* Status Update */}
                    <div className="border border-zinc-800 rounded-2xl p-6 bg-zinc-950/70">
                        <h2 className="text-lg font-medium mb-4 text-zinc-300">Update Status</h2>
                        <div className="flex gap-3">
                            <button
                                onClick={() => updateStatus("new")}
                                disabled={updating || order.status === "new"}
                                className={`px-4 py-2 rounded-lg transition ${order.status === "new"
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                                    } disabled:opacity-50`}
                            >
                                New
                            </button>
                            <button
                                onClick={() => updateStatus("in_progress")}
                                disabled={updating || order.status === "in_progress"}
                                className={`px-4 py-2 rounded-lg transition ${order.status === "in_progress"
                                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40"
                                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                                    } disabled:opacity-50`}
                            >
                                In Progress
                            </button>
                            <button
                                onClick={() => updateStatus("completed")}
                                disabled={updating || order.status === "completed"}
                                className={`px-4 py-2 rounded-lg transition ${order.status === "completed"
                                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                                    } disabled:opacity-50`}
                            >
                                Completed
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}