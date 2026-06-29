"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AtelierDashboard() {
    const router = useRouter();
    const pathname = usePathname();

    const locale = pathname.startsWith("/fa") ? "fa" : "en";

    const handleLogout = async () => {
        await fetch("/api/atelier-dashboard/logout", {
            method: "POST",
            credentials: "include",
        });

        router.push(`/${locale}/atelier-dashboard/login`);
        router.refresh();
    };

    return (
        <main className="min-h-screen bg-black text-white p-10 pt-32">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-zinc-500 mb-3">
                            Atelier Dashboard
                        </p>

                        <h1 className="text-4xl md:text-5xl font-light">
                            Dashboard
                        </h1>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="border border-zinc-800 px-5 py-3 rounded-full hover:border-zinc-600 hover:bg-zinc-900 transition"
                    >
                        Logout
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* ORDERS */}
                    <Link
                        href={`/${locale}/atelier-dashboard/orders`}
                        className="group border border-zinc-800 bg-zinc-950 rounded-3xl p-8 hover:border-zinc-600 hover:bg-zinc-900 transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl">
                                📦
                            </div>
                            <span className="text-zinc-500 group-hover:text-zinc-300 transition">
                                Open →
                            </span>
                        </div>

                        <h2 className="text-2xl font-light mb-3">Orders</h2>
                        <p className="text-zinc-500 leading-7">
                            View and manage customer orders, uploaded files,
                            and project details.
                        </p>
                    </Link>

                    {/* HOMEPAGE SECTIONS */}
                    <Link
                        href={`/${locale}/atelier-dashboard/homepage-sections`}
                        className="group border border-zinc-800 bg-zinc-950 rounded-3xl p-8 hover:border-zinc-600 hover:bg-zinc-900 transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl">
                                🧩
                            </div>
                            <span className="text-zinc-500 group-hover:text-zinc-300 transition">
                                Open →
                            </span>
                        </div>

                        <h2 className="text-2xl font-light mb-3">
                            Homepage Sections
                        </h2>

                        <p className="text-zinc-500 leading-7">
                            Control homepage section visibility and display order.
                        </p>
                    </Link>

                    {/* PORTFOLIO */}
                    <Link
                        href={`/${locale}/atelier-dashboard/portfolio`}
                        className="group border border-zinc-800 bg-zinc-950 rounded-3xl p-8 hover:border-zinc-600 hover:bg-zinc-900 transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl">
                                🖼
                            </div>
                            <span className="text-zinc-500 group-hover:text-zinc-300 transition">
                                Open →
                            </span>
                        </div>

                        <h2 className="text-2xl font-light mb-3">Portfolio</h2>
                        <p className="text-zinc-500 leading-7">
                            Manage portfolio projects, cover images and featured works.
                        </p>
                    </Link>

                    {/* FAQ MANAGER */}
                    <Link
                        href={`/${locale}/atelier-dashboard/faq`}
                        className="group border border-zinc-800 bg-zinc-950 rounded-3xl p-8 hover:border-zinc-600 hover:bg-zinc-900 transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl">
                                ❓
                            </div>

                            <span className="text-zinc-500 group-hover:text-zinc-300 transition">
                                Open →
                            </span>
                        </div>

                        <h2 className="text-2xl font-light mb-3">
                            FAQ Manager
                        </h2>

                        <p className="text-zinc-500 leading-7">
                            Manage frequently asked questions shown on the website.
                        </p>
                    </Link>
                    {/* PRICING MANAGER */}
                    <Link
                        href={`/${locale}/atelier-dashboard/pricing`}
                        className="group border border-zinc-800 bg-zinc-950 rounded-3xl p-8 hover:border-zinc-600 hover:bg-zinc-900 transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl">
                                💰
                            </div>

                            <span className="text-zinc-500 group-hover:text-zinc-300 transition">
                                Open →
                            </span>
                        </div>

                        <h2 className="text-2xl font-light mb-3">
                            Pricing Manager
                        </h2>

                        <p className="text-zinc-500 leading-7">
                            Manage pricing items, categories and service details.
                        </p>
                    </Link>

                    {/* JOURNAL MANAGER (NEW) */}
                    <Link
                        href={`/${locale}/atelier-dashboard/journal`}
                        className="group border border-zinc-800 bg-zinc-950 rounded-3xl p-8 hover:border-zinc-600 hover:bg-zinc-900 transition-all duration-300"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl">
                                📝
                            </div>

                            <span className="text-zinc-500 group-hover:text-zinc-300 transition">
                                Open →
                            </span>
                        </div>

                        <h2 className="text-2xl font-light mb-3">Journal</h2>

                        <p className="text-zinc-500 leading-7">
                            Manage articles, blog posts and editorial content.
                        </p>
                    </Link>

                </div>
            </div>
        </main>
    );
}
