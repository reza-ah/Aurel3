"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface OrderFile {
    id: string;
    filename_download: string;
    type: string;
    filesize: number;
    url: string;
}

interface Order {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    service: string;
    jewelry_type?: string;
    details: string;
    status: string;
    created_at: string;
    tracking_code?: string;
    files?: OrderFile[];
}

export default function OrderDetailPage() {
    const params = useParams();
    const orderId = params.id as string;
    const locale = (params.locale as string) || "en";

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [selectedFile, setSelectedFile] = useState<OrderFile | null>(null);

    useEffect(() => {
        async function fetchOrder() {
            try {
                // ✅ اصلاح: استفاده از endpoint درست
                const res = await fetch(`/api/atelier-dashboard/orders/${orderId}`, {
                    credentials: "include",
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch order");
                }

                const data = await res.json();
                console.log("Order data:", data);
                console.log("Files:", data.files);

                setOrder(data);
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
                    _id: order.id,
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

    function isImage(file: OrderFile): boolean {
        return (
            file.type?.toLowerCase().includes("image") ||
            /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file.filename_download || "") ||
            !!file.url.toLowerCase().match(/\.(jpg|jpeg|png|webp|gif|svg)$/)
        );
    }

    function getFileExtension(file: OrderFile): string {
        const name = file.filename_download || file.url || "";
        const match = name.match(/\.([a-zA-Z0-9]+)(\?|$)/);
        return match ? match[1].toUpperCase() : "FILE";
    }

    const EXT_COLORS: Record<string, string> = {
        PDF: "#e74c3c",
        DOC: "#2980b9",
        DOCX: "#2980b9",
        XLS: "#27ae60",
        XLSX: "#27ae60",
        ZIP: "#f39c12",
        RAR: "#f39c12",
        MP4: "#8e44ad",
        MOV: "#8e44ad",
        MP3: "#1abc9c",
        PSD: "#3498db",
        AI: "#f39c12",
        EPS: "#e67e22",
    };

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
        <>
            {/* File Modal */}
            {selectedFile && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setSelectedFile(null);
                    }}
                >
                    <div className="relative bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-3xl flex flex-col overflow-hidden shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
                            <p className="text-sm text-zinc-400 truncate max-w-[70%]">
                                {selectedFile.filename_download}
                            </p>
                            <button
                                onClick={() => setSelectedFile(null)}
                                className="w-8 h-8 flex items-center justify-center rounded-full border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white transition text-lg leading-none"
                            >
                                ×
                            </button>
                        </div>

                        <div className="flex items-center justify-center bg-black overflow-hidden" style={{ minHeight: 300, maxHeight: "60vh" }}>
                            {isImage(selectedFile) ? (
                                <div
                                    className="w-full bg-contain bg-center bg-no-repeat"
                                    style={{ backgroundImage: `url("${selectedFile.url}")`, minHeight: 300, maxHeight: "60vh" }}
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-4 py-16">
                                    <div className="text-6xl">📄</div>
                                    <p className="text-zinc-500 text-sm">Preview not available for this file type</p>
                                </div>
                            )}
                        </div>

                        <div className="px-6 py-4 border-t border-zinc-800 flex justify-end">
                            <a
                                href={selectedFile.url}
                                download={selectedFile.filename_download}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-white text-black text-sm font-medium px-5 py-2.5 rounded-full hover:bg-zinc-200 transition"
                            >
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.5 1v9M4 7l3.5 3.5L11 7M2 13h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Download
                            </a>
                        </div>
                    </div>
                </div>
            )}

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
                            <h1 className="text-4xl font-light">#{order.tracking_code || order.id.slice(-8)}</h1>
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
                                    <p className="text-white">{order.full_name}</p>
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
                                        {new Date(order.created_at).toLocaleString("fa-IR", {
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
                                    <p className="text-white whitespace-pre-wrap">{order.details}</p>
                                </div>
                            </div>
                        </div>

                        {/* ✅ اضافه شده: Files Section */}
                        {order.files && order.files.length > 0 && (
                            <div className="border border-zinc-800 rounded-2xl p-6 bg-zinc-950/70">
                                <h2 className="text-lg font-medium mb-4 text-zinc-300">
                                    Uploaded Files ({order.files.length})
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {order.files.map((file) => {
                                        const ext = getFileExtension(file);
                                        const color = EXT_COLORS[ext] || "#6b7280";

                                        return (
                                            <button
                                                key={file.id}
                                                onClick={() => setSelectedFile(file)}
                                                className="group border border-zinc-800 hover:border-zinc-600 rounded-xl overflow-hidden transition bg-zinc-900 block text-left w-full"
                                            >
                                                <div className="aspect-video bg-black overflow-hidden relative flex items-center justify-center">
                                                    {isImage(file) ? (
                                                        <div
                                                            className="w-full h-full bg-contain bg-center bg-no-repeat group-hover:scale-105 transition duration-500"
                                                            style={{ backgroundImage: `url("${file.url}")` }}
                                                        />
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center gap-2">
                                                            <div className="text-5xl">📄</div>
                                                            <span
                                                                className="text-[11px] font-bold tracking-widest px-2 py-0.5 rounded"
                                                                style={{ color, background: `${color}20` }}
                                                            >
                                                                {ext}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-3 flex items-center justify-between gap-2">
                                                    <p className="text-sm truncate flex-1">
                                                        {file.filename_download || "Uploaded File"}
                                                    </p>
                                                    <span className="text-xs text-zinc-500 bg-black px-2 py-1 rounded-full border border-zinc-800 group-hover:border-zinc-600">
                                                        Open
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

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
        </>
    );
}