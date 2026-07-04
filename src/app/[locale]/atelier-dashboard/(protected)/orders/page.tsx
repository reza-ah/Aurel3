"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// ✅ اصلاح: استفاده از _id و نام‌های درست فیلدها
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
}

interface Message {
    _id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    date_created: string;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"orders" | "messages">("orders");

    const pathname = usePathname();
    const locale = pathname?.split("/")?.[1] || "en";

    useEffect(() => {
        async function fetchData() {
            try {
                // ✅ سفارش‌ها
                const orderRes = await fetch("/api/atelier-dashboard/orders", { credentials: "include" });
                const orderData = await orderRes.json();
                setOrders(
                    Array.isArray(orderData)
                        ? orderData.sort((a: Order, b: Order) =>
                            new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
                        )
                        : []
                );

                // ✅ پیام‌ها
                const msgRes = await fetch("/api/atelier-dashboard/contact", { credentials: "include" });
                const msgData = await msgRes.json();
                setMessages(
                    Array.isArray(msgData)
                        ? msgData.sort((a: Message, b: Message) =>
                            new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
                        )
                        : []
                );

            } catch (error) {
                console.error("Failed to load data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) {
        return (
            <main className="min-h-screen bg-black text-white pt-32 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="animate-pulse text-zinc-500">Loading...</div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white pt-32 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header & Tabs */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <p className="text-sm tracking-[0.3em] uppercase text-zinc-500 mb-3">
                            Atelier Dashboard
                        </p>

                        <div className="flex gap-8">
                            <button
                                onClick={() => setActiveTab("orders")}
                                className={`text-4xl md:text-5xl font-light transition ${activeTab === 'orders' ? 'text-white' : 'text-zinc-600 hover:text-[#a3a3a3]'}`}
                            >
                                Orders
                            </button>
                            <button
                                onClick={() => setActiveTab("messages")}
                                className={`text-4xl md:text-5xl font-light transition ${activeTab === 'messages' ? 'text-white' : 'text-zinc-600 hover:text-[#a3a3a3]'}`}
                            >
                                Messages
                            </button>
                        </div>
                    </div>

                    <div className="text-sm text-zinc-500">
                        {activeTab === 'orders' ? `${orders.length} Orders` : `${messages.length} Messages`}
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-5">
                    {activeTab === "orders" ? (
                        orders.map((order) => (
                            <Link
                                // ✅ اصلاح: استفاده از _id
                                key={order._id}
                                href={`/${locale}/atelier-dashboard/orders/${order._id}`}
                                className="group block border border-zinc-800 bg-zinc-950/70 rounded-3xl p-6 hover:border-zinc-600 hover:bg-zinc-900 transition-all duration-300"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`w-2 h-2 rounded-full ${order.status === 'new' ? 'bg-emerald-500' :
                                                order.status === 'in_progress' ? 'bg-yellow-500' :
                                                    'bg-blue-500'
                                                }`} />
                                            <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                                                {order.status}
                                            </span>
                                        </div>

                                        {/* ✅ اصلاح: استفاده از name به جای full_name */}
                                        <h2 className="text-2xl font-light mb-2 group-hover:text-zinc-300 transition truncate">
                                            {order.name}
                                        </h2>

                                        <div className="space-y-1 text-sm text-[#a3a3a3] truncate">
                                            <p>{order.email}</p>
                                            <p dir="ltr" className="text-left">{order.phone}</p>
                                        </div>

                                        <div className="mt-5 inline-flex items-center rounded-full border border-zinc-800 px-4 py-2 text-sm text-zinc-300">
                                            {order.service}
                                        </div>

                                        {order.jewelry_type && (
                                            <div className="mt-2 inline-flex items-center rounded-full border border-zinc-800 px-4 py-2 text-sm text-[#a3a3a3] ml-2">
                                                {order.jewelry_type}
                                            </div>
                                        )}
                                    </div>

                                    <div className="lg:text-right shrink-0">
                                        {order.tracking_code && (
                                            <>
                                                <div className="text-3xl font-light text-[#D4AF37]">
                                                    #{order.tracking_code}
                                                </div>
                                                <div className="mt-3 text-sm text-zinc-500">Tracking Code</div>
                                            </>
                                        )}
                                        {/* ✅ اصلاح: استفاده از date_created */}
                                        {order.date_created && (
                                            <div className="mt-4 text-xs text-zinc-600">
                                                {new Date(order.date_created).toLocaleString("fa-IR", {
                                                    year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        messages.map((msg) => (
                            <div key={msg._id} className="border border-zinc-800 bg-zinc-950/70 rounded-3xl p-6 min-w-0">
                                <div className="flex justify-between items-start gap-4">
                                    <h2 className="text-2xl font-light truncate">{msg.name}</h2>
                                    <span className="text-xs text-zinc-600 shrink-0">
                                        {new Date(msg.date_created).toLocaleString("fa-IR")}
                                    </span>
                                </div>
                                <p className="text-sm text-[#a3a3a3] mt-1 truncate">{msg.email} | {msg.phone}</p>
                                <p
                                    className="text-zinc-300 mt-4 italic break-words"
                                    style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
                                >
                                    "{msg.message}"
                                </p>
                            </div>
                        ))
                    )}

                    {/* Empty States */}
                    {activeTab === "orders" && orders.length === 0 && (
                        <div className="border border-zinc-800 rounded-3xl p-12 text-center text-zinc-500 bg-zinc-950/50">
                            No orders found.
                        </div>
                    )}
                    {activeTab === "messages" && messages.length === 0 && (
                        <div className="border border-zinc-800 rounded-3xl p-12 text-center text-zinc-500 bg-zinc-950/50">
                            No messages found.
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}