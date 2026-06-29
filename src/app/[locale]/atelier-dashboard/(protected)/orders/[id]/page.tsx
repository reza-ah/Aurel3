"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";

interface OrderFile {
    id: string;
    filename_download?: string;
    type?: string;
    filesize?: number;
    width?: number;
    height?: number;
    url: string;
}

interface Order {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    service: string;
    details: string;
    status: string;
    created_at: string;
    tracking_code?: string;
    files?: OrderFile[];
}

// ─── file extension helper ───────────────────────────────────────────────────

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

function FileIcon({ ext }: { ext: string }) {
    const color = EXT_COLORS[ext] || "#6b7280";
    return (
        <div className="flex flex-col items-center justify-center gap-2">
            <svg width="56" height="68" viewBox="0 0 56 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0" y="0" width="56" height="68" rx="6" fill="#1a1a1a" />
                <rect x="0" y="0" width="56" height="68" rx="6" stroke="#333" strokeWidth="1.5" />
                <path d="M36 0 L56 20 L36 20 Z" fill={color} opacity="0.25" />
                <path d="M36 0 L56 20 H36 V0 Z" fill={color} opacity="0.5" />
            </svg>
            <span
                className="text-[11px] font-bold tracking-widest px-2 py-0.5 rounded"
                style={{ color, background: `${color}20` }}
            >
                {ext}
            </span>
        </div>
    );
}

// ─── modal ──────────────────────────────────────────────────────────────────

function FileModal({ file, onClose }: { file: OrderFile; onClose: () => void }) {
    const name = file.filename_download || "file";
    const ext = getFileExtension(file);

    // همان منطق تشخیص عکس که در کد اصلی بود
    const isImage =
        file.type?.toLowerCase().includes("image") ||
        /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file.filename_download || "") ||
        !!file.url.toLowerCase().match(/\.(jpg|jpeg|png|webp|gif|svg)$/);

    function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
        if (e.target === e.currentTarget) onClose();
    }

    async function handleDownload() {
        try {
            const res = await fetch(file.url);
            const blob = await res.blob();
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = name;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(blobUrl);
        } catch {
            window.location.href = file.url;
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={handleBackdrop}
        >
            <div className="relative bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-3xl flex flex-col overflow-hidden shadow-2xl">
                {/* header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
                    <p className="text-sm text-zinc-400 truncate max-w-[70%]">{name}</p>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white transition text-lg leading-none"
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                {/* preview — همان background-image برای عکس، آیکون برای بقیه */}
                <div className="flex items-center justify-center bg-black overflow-hidden" style={{ minHeight: 300, maxHeight: "60vh" }}>
                    {isImage ? (
                        <div
                            className="w-full bg-contain bg-center bg-no-repeat"
                            style={{ backgroundImage: `url("${file.url}")`, minHeight: 300, maxHeight: "60vh" }}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-4 py-16">
                            <FileIcon ext={ext} />
                            <p className="text-zinc-500 text-sm">Preview not available for this file type</p>
                        </div>
                    )}
                </div>

                {/* footer */}
                <div className="px-6 py-4 border-t border-zinc-800 flex justify-end">
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 bg-white text-black text-sm font-medium px-5 py-2.5 rounded-full hover:bg-zinc-200 transition"
                    >
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.5 1v9M4 7l3.5 3.5L11 7M2 13h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Download
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── page ───────────────────────────────────────────────────────────────────

export default function OrderDetailsPage() {
    const params = useParams();
    const id = params?.id as string;

    const pathname = usePathname();
    const locale = pathname?.split("/")?.[1] || "en";

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState<OrderFile | null>(null);

    useEffect(() => {
        async function fetchOrder() {
            try {
                const response = await fetch(
                    `/api/atelier-dashboard/orders/${id}`,
                    {
                        cache: "no-store",
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch order");
                }

                const data = await response.json();
                setOrder(data);
            } catch (error) {
                console.error("ORDER PAGE ERROR:", error);
            } finally {
                setLoading(false);
            }
        }

        if (id) fetchOrder();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                Loading...
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                Order not found
            </div>
        );
    }

    return (
        <>
            {selectedFile && (
                <FileModal file={selectedFile} onClose={() => setSelectedFile(null)} />
            )}

            <div className="min-h-screen bg-black text-white px-6 py-32">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <p className="text-zinc-500 uppercase tracking-[0.3em] text-xs mb-3">
                                Order Details
                            </p>
                            <h1 className="text-4xl font-light">Order #{order.id}</h1>
                        </div>

                        <Link
                            href={`/${locale}/atelier-dashboard/orders`}
                            className="border border-zinc-800 hover:border-zinc-600 px-5 py-3 rounded-full text-sm transition"
                        >
                            Back to Orders
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                        <div className="border border-zinc-800 rounded-3xl p-6 bg-zinc-950">
                            <p className="text-zinc-500 text-xs uppercase tracking-[0.2em] mb-6">Client Information</p>
                            <div className="space-y-5">
                                <div>
                                    <p className="text-zinc-500 text-sm mb-1">Full Name</p>
                                    <p className="text-lg text-white">{order.full_name}</p>
                                </div>
                                <div>
                                    <p className="text-zinc-500 text-sm mb-1">Email</p>
                                    <p className="text-white">{order.email}</p>
                                </div>
                                <div>
                                    <p className="text-zinc-500 text-sm mb-1">Phone</p>
                                    <p className="text-white">{order.phone}</p>
                                </div>
                            </div>
                        </div>

                        <div className="border border-zinc-800 rounded-3xl p-6 bg-zinc-950">
                            <p className="text-zinc-500 text-xs uppercase tracking-[0.2em] mb-6">Order Information</p>
                            <div className="space-y-5">
                                <div>
                                    <p className="text-zinc-500 text-sm mb-1">Service</p>
                                    <p className="text-white">{order.service}</p>
                                </div>
                                <div>
                                    <p className="text-zinc-500 text-sm mb-1">Status</p>
                                    <p className="text-white">{order.status}</p>
                                </div>
                                {order.tracking_code && (
                                    <div>
                                        <p className="text-zinc-500 text-sm mb-1">Tracking Code</p>
                                        <p className="text-white tracking-widest">{order.tracking_code}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-zinc-500 text-sm mb-1">Created At</p>
                                    <p className="text-white">
                                        {new Date(order.created_at).toLocaleString("fa-IR", {
                                            year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border border-zinc-800 rounded-3xl p-6 bg-zinc-950 mb-10">
                        <p className="text-zinc-500 text-xs uppercase tracking-[0.2em] mb-6">Project Details</p>
                        <div className="text-zinc-300 leading-8 whitespace-pre-wrap">{order.details}</div>
                    </div>

                    {order.files && order.files.length > 0 && (
                        <div className="border border-zinc-800 rounded-3xl p-6 bg-zinc-950">
                            <p className="text-zinc-500 text-xs uppercase tracking-[0.2em] mb-6">Uploaded Files</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {order.files.map((file) => {
                                    const isImage =
                                        file.type?.toLowerCase().includes("image") ||
                                        /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file.filename_download || "") ||
                                        file.url.toLowerCase().match(/\.(jpg|jpeg|png|webp|gif|svg)$/);

                                    // ← این متغیر عیناً از کد اصلی حفظ شده
                                    const forceShowImage = true;

                                    return (
                                        <button
                                            key={file.id}
                                            onClick={() => setSelectedFile(file)}
                                            className="group border border-zinc-800 hover:border-zinc-600 rounded-2xl overflow-hidden transition bg-zinc-900 block text-left w-full"
                                        >
                                            <div className="aspect-video bg-black overflow-hidden relative flex items-center justify-center">
                                                {forceShowImage ? (
                                                    // ← عیناً همان JSX کد اصلی
                                                    <div
                                                        className="w-full h-full bg-contain bg-center bg-no-repeat group-hover:scale-105 transition duration-500"
                                                        style={{ backgroundImage: `url("${file.url}")` }}
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center text-zinc-500">
                                                        <div className="text-5xl mb-3">📄</div>
                                                        <p className="text-sm">Preview not available</p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4 flex items-center justify-between gap-4">
                                                <div className="min-w-0">
                                                    <p className="text-sm truncate">{file.filename_download || "Uploaded File"}</p>
                                                </div>
                                                <span className="text-xs text-zinc-500 bg-black px-3 py-1 rounded-full border border-zinc-800 group-hover:border-zinc-600">
                                                    Open
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}